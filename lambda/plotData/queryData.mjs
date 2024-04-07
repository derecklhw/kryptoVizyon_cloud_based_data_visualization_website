import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function queryData(symbol) {
  console.log("Querying data for symbol: ", symbol);
  const command = new QueryCommand({
    TableName: "Crypto",
    IndexName: "symbol-timestamp-index",
    KeyConditionExpression: "symbol = :symbol",
    ExpressionAttributeValues: {
      ":symbol": symbol,
    },
    ScanIndexForward: false,
  });

  try {
    const { Items } = await docClient.send(command);

    const series = Items.map((item) => item.close);

    if (Items.length > 0 && Items[0].timestamp) {
      const timestamp = Number(Items[0].timestamp);
      const date = new Date(timestamp * 1000);

      const start = date.toISOString().replace("T", " ").substring(0, 19);

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
