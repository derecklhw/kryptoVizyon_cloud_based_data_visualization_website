//Import AWS
import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} from "@aws-sdk/client-sagemaker-runtime";

import { format } from "date-fns";

//Create SageMakerRuntimeClient
const client = new SageMakerRuntimeClient({});

export async function getPredictions(historicData) {
  console.log("Getting predictions...");
  let predictions = [];

  for (const data of historicData) {
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

    let { mean } = await invokeEndpoint(endpoint, target, start);

    mean = mean.map((item) => {
      last += 3600;
      return {
        timestamp: last,
        close: item,
      };
    });

    predictions.push({
      symbol: symbol,
      data: mean,
    });
  }
  return predictions;
}

export async function invokeEndpoint(endpointName, data, originalStartTime) {
  /* Data we are going to send to endpoint
      REPLACE WITH YOUR OWN DATA!
      Should be last 100 points in your time series (depending on your choice of hyperparameters).
      Make sure that start is correct.
  */

  const last100DataPoints = data.slice(-100);
  const newStartTimeUnix = originalStartTime + (data.length - 100) * 3600;
  const newStartTime = new Date(newStartTimeUnix * 1000);
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
