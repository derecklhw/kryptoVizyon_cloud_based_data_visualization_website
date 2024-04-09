//Import library and scan command
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

//Create client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const symbols = ["BTC", "ETH", "BNB", "SOL", "DOGE"];

export async function getSentimentAnalysis() {
  console.log("Getting sentiment analysis data...");
  let sentiments = [];
  for (const symbol of symbols) {
    const command = new QueryCommand({
      TableName: "Sentiments",
      IndexName: "symbol-timestamp-index",
      KeyConditionExpression: "symbol = :symbol",
      ExpressionAttributeValues: {
        ":symbol": symbol,
      },
      ScanIndexForward: false,
      Limit: 1,
    });

    try {
      const { Items } = await docClient.send(command);

      if (Items.length > 0) {
        sentiments.push({
          symbol: symbol,
          negative: Items[0].negative,
          positive: Items[0].positive,
          neutral: Items[0].neutral,
        });
      } else {
        console.log("No data found for symbol:", symbol);
      }
    } catch (error) {
      console.error("Error querying data for symbol:", symbol, error);
      throw error;
    }
  }

  return sentiments;
}

export async function getHistoricData() {
  console.log("Getting historic data...");
  let historicData = [];

  for (const symbol of symbols) {
    const command = new QueryCommand({
      TableName: "Crypto",
      IndexName: "symbol-timestamp-index",
      KeyConditionExpression: "symbol = :symbol",
      ExpressionAttributeValues: {
        ":symbol": symbol,
      },
      ScanIndexForward: false,
      Limit: 100,
    });

    try {
      const { Items } = await docClient.send(command);

      if (Items.length > 0) {
        historicData.push({
          symbol: symbol,
          data: Items,
        });
      } else {
        console.log("No data found for symbol:", symbol);
      }
    } catch (error) {
      console.error("Error querying data for symbol:", symbol, error);
      throw error;
    }
  }

  return historicData;
}