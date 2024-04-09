//Import AWS
import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} from "@aws-sdk/client-sagemaker-runtime";

import { format } from "date-fns";

// Create SageMakerRuntimeClient
const client = new SageMakerRuntimeClient({});

/*
 * Function to get predictions
 * @param historicData - Historic data
 * @return - Predictions
 */
export async function getPredictions(historicData) {
  console.log("Getting predictions...");
  let predictions = {};

  // Loop through historic data for each symbol
  for (const data of historicData) {
    // Extract symbol, start time, last time, and target data
    let symbol = data.symbol;
    let start = data.data[0].timestamp;
    let last = data.data[data.data.length - 1].timestamp;
    let target = data.data.map((item) => item.close);

    let endpoint =
      symbol === "BTC"
        ? "BTC-Endpoint4"
        : symbol === "ETH"
        ? "ETH-Endpoint4"
        : symbol === "BNB"
        ? "BNB-Endpoint4"
        : symbol === "SOL"
        ? "SOL-Endpoint1"
        : symbol === "DOGE"
        ? "DOGE-Endpoint1"
        : "None";

    if (endpoint === "None") return { statusCode: 400, body: "Invalid symbol" };

    // Call function to get predictions
    let { mean } = await invokeEndpoint(endpoint, target, start);

    // Create predictions object
    mean = mean.map((item) => {
      last += 3600;
      return {
        timestamp: last,
        close: item,
      };
    });

    predictions[symbol] = mean;
  }
  return predictions;
}

/*
 * Function to invoke endpoint
 * @param endpointName - Name of endpoint
 * @param data - Data to send to endpoint
 * @param originalStartTime - Original start time of data
 * @return - Predictions from endpoint
 */
export async function invokeEndpoint(endpointName, data, originalStartTime) {
  // Extract last 100 data points and new start time
  const last100DataPoints = data.slice(-100);
  const newStartTimeUnix = originalStartTime + (data.length - 100) * 3600;
  const newStartTime = new Date(newStartTimeUnix * 1000);

  // Create data for endpoint
  const endpointData = {
    instances: [
      {
        start: format(newStartTime, "yyyy-MM-dd HH:mm:ss"),
        target: last100DataPoints,
      },
    ],
    configuration: {
      num_samples: 50,
      output_types: ["mean", "quantiles", "samples"],
      quantiles: ["0.1", "0.9"],
    },
  };

  //Create and send command with data
  const command = new InvokeEndpointCommand({
    EndpointName: endpointName,
    Body: JSON.stringify(endpointData),
    ContentType: "application/json",
    Accept: "application/json",
  });
  const response = await client.send(command);

  //Must install @types/node for this to work
  let result = JSON.parse(Buffer.from(response.Body).toString("utf8"));

  return {
    mean: result.predictions[0].mean,
  };
}
