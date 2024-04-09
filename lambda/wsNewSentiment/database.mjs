//Import library and scan command
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

//Create client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/*
 * Function to get connection IDs
 * @return - Connection IDs
 */
export async function getConnectionIds() {
  const scanCommand = new ScanCommand({
    TableName: "WebSocketClients",
  });

  const response = await docClient.send(scanCommand);
  return response.Items;
}

/*
 * Function to delete a connection ID
 * @param connectionId - Connection ID to delete
 */
export async function deleteConnectionId(connectionId) {
  console.log("Deleting connection Id: " + connectionId);

  const deleteCommand = new DeleteCommand({
    TableName: "WebSocketClients",
    Key: {
      ConnectionId: connectionId,
    },
  });
  return docClient.send(deleteCommand);
}

/*
 * Function to get sentiment analysis data
 * @return - Sentiment analysis data
 */
export async function getSentimentAnalysis() {
  const symbols = ["BTC", "ETH", "BNB", "SOL", "DOGE"];

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
