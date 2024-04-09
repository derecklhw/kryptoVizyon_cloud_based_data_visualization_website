import {
  DynamoDBClient,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import axios from "axios";
import { v4 } from "uuid";

// Create DynamoDBClient and DynamoDBDocumentClient
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const symbols = ["BTC", "ETH", "BNB", "SOL", "DOGE"];
  const textProcessingApiUrl = "http://text-processing.com/api/sentiment/";

  const sentiments = await Promise.all(
    symbols.map(async (symbol) => {
      let positive = [],
        negative = [],
        neutral = [],
        textArray = [];

      // Query the last 3 news articles for each symbol
      const command = new QueryCommand({
        TableName: "News",
        IndexName: "symbol-timestamp-index",
        KeyConditionExpression: "symbol = :symbol",
        ExpressionAttributeValues: {
          ":symbol": symbol,
        },
        ScanIndexForward: false,
        Limit: 3,
      });

      try {
        const { Items } = await docClient.send(command);
        if (!Items || !Items.length) return;

        textArray = Items.map((item) => item.title);
      } catch (error) {
        return;
      }

      if (!textArray.length) return;

      // Fetch sentiment analysis for each article
      const sentimentResults = await Promise.all(
        textArray.map(async (text) => {
          try {
            const response = await axios.post(
              textProcessingApiUrl,
              `text=${encodeURIComponent(text)}`,
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              }
            );

            return response.data;
          } catch (error) {
            throw new Error("Error fetching sentiment analysis API: " + error);
          }
        })
      );

      // Calculate average sentiment for each symbol
      sentimentResults.forEach((result) => {
        if (!result) return;

        positive.push(result.probability.pos);
        negative.push(result.probability.neg);
        neutral.push(result.probability.neutral);
      });

      const positiveAvg = positive.reduce((a, b) => a + b, 0) / positive.length;
      const negativeAvg = negative.reduce((a, b) => a + b, 0) / negative.length;
      const neutralAvg = neutral.reduce((a, b) => a + b, 0) / neutral.length;

      return {
        PutRequest: {
          Item: {
            id: { S: v4().toString() },
            timestamp: { N: `${Date.now()}` },
            symbol: { S: symbol },
            positive: { N: positiveAvg.toString() },
            negative: { N: negativeAvg.toString() },
            neutral: { N: neutralAvg.toString() },
          },
        },
      };
    })
  );

  // Filter out any undefined sentiments
  const sentimentsFiltered = sentiments.filter((sentiment) => sentiment);

  // Write sentiments to DynamoDB
  const command = new BatchWriteItemCommand({
    RequestItems: {
      Sentiments: sentimentsFiltered,
    },
  });

  try {
    await docClient.send(command);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        "Error writing sentiments to DynamoDB: " + error.message
      ),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify("Sentiments successfully written to DynamoDB"),
  };
};
