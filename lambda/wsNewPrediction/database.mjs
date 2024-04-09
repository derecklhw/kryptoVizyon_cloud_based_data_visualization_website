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
 * Function to get historic data
 * @return - Historic data
 */
export async function getHistoricData(symbol) {
  console.log("Getting historic data...");
  let historicData = [];

  // Query all numerical data
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

  return historicData;
}
