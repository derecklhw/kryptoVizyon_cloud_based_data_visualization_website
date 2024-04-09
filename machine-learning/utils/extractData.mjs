import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import fs from "fs";
import path from "path";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    console.error(`Invalid directory: ${directory}. Directory does not exist.`);
    process.exit(1);
  }
}

async function queryData(symbol) {
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

async function main() {
  const [, , symbol, destinationDirectory] = process.argv;

  const symbols = ["BTC", "ETH", "BNB", "SOL", "DOGE"];

  if (!symbol || !destinationDirectory) {
    console.error("Usage: node script.mjs <symbol> <destination_directory>");
    process.exit(1);
  }

  if (!symbols.includes(symbol)) {
    console.error(
      `Invalid symbol: ${symbol}. Supported symbols are: ${symbols.join(", ")}`
    );
    process.exit(1);
  }

  ensureDirectoryExists(destinationDirectory);

  let responseData = await queryData(symbol);

  let { target, start } = responseData.data;

  const newData = {
    start: start,
    target: target,
  };

  const directory = path.resolve(destinationDirectory);
  const outputFile = path.join(directory, `test.json`);

  fs.writeFileSync(outputFile, JSON.stringify(newData, null, ""));

  console.log(`Test Data for '${symbol}' extracted and saved to ${outputFile}`);
}

main();
