import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

// Create DynamoDBClient and DynamoDBDocumentClient
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const symbols = ["BTC", "ETH", "BNB", "SOL", "DOGE"];

/*
 * Function to get sentiment analysis data
 * @return - Sentiment analysis data
 */
export async function getSentimentAnalysis() {
  console.log("Getting sentiment analysis data...");
  let sentiments = {};
  for (const symbol of symbols) {
    // Query the last sentiment analysis data for each symbol
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

      // Add data to sentiments object
      if (Items.length > 0) {
        sentiments[symbol] = {
          negative: Items[0].negative,
          positive: Items[0].positive,
          neutral: Items[0].neutral,
        };
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

/*
 * Function to get historic data
 * @return - Historic data
 */
export async function getHistoricData() {
  console.log("Getting historic data...");
  let historicData = [];

  for (const symbol of symbols) {
    // Query all numerical data for each symbol
    const command = new QueryCommand({
      TableName: "Crypto",
      IndexName: "symbol-timestamp-index",
      KeyConditionExpression: "symbol = :symbol",
      ExpressionAttributeValues: {
        ":symbol": symbol,
      },
    });

    try {
      const { Items } = await docClient.send(command);

      // Process data to be in the correct format
      let processedItems = Items.map((item) => {
        return {
          timestamp: Number(item.timestamp),
          open: Number(item.open),
          high: Number(item.high),
          low: Number(item.low),
          close: Number(item.close),
        };
      });

      // Add data to historicData array
      if (Items.length > 0) {
        historicData.push({
          symbol: symbol,
          data: processedItems,
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
