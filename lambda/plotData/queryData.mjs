import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

//Create DynamoDBClient and DynamoDBDocumentClient
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/*
 * Function to query data from DynamoDB
 * @param symbol - Symbol to query data for
 * @return - Data for symbol
 */

export async function queryData(symbol) {
  console.log("Querying data for symbol: ", symbol);

  // Create and send command with data
  const command = new QueryCommand({
    TableName: "Crypto",
    IndexName: "symbol-timestamp-index",
    KeyConditionExpression: "symbol = :symbol",
    ExpressionAttributeValues: {
      ":symbol": symbol,
    },
  });

  try {
    // Send command
    const { Items } = await docClient.send(command);

    // Extract close prices
    const series = Items.map((item) => item.close);

    // Extract timestamp of first data point
    if (Items.length > 0 && Items[0].timestamp) {
      const timestamp = Number(Items[0].timestamp);
      const date = new Date(timestamp * 1000);

      const start = date.toISOString().replace("T", " ").substring(0, 19);

      // Return data
      return {
        data: {
          target: series,
          start: start,
        },
      };
    } else {
      console.log("No data found for symbol:", symbol);
      return [];
    }
  } catch (error) {
    console.error("Error querying data for symbol:", symbol, error);
    return [];
  }
}
