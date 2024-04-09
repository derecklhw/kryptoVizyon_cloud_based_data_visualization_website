//Import AWS
import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} from "@aws-sdk/client-sagemaker-runtime";

import { addHours, format } from "date-fns";

//Create SageMakerRuntimeClient
const client = new SageMakerRuntimeClient({});

export async function getPredictions(historicData) {
  console.log("Getting predictions...");
  let predictions = [];

  for (const data of historicData) {
    let symbol = data.symbol;
    let start = data.data[0].timestamp;
    let target = data.data.map((item) => item.close);

    let endpoint =
      symbol === "BTC"
        ? "BTC-Endpoint1"
        : symbol === "ETH"
        ? "ETH-Endpoint3"
        : symbol === "BNB"
        ? "BNB-Endpoint"
        : symbol === "SOL"
        ? "SOL-Endpoint"
        : symbol === "DOGE"
        ? "DOGE-Endpoint"
        : "None";

    if (endpoint === "None") return { statusCode: 400, body: "Invalid symbol" };

    let result = await invokeEndpoint(endpoint, target, start);

    predictions.push({
      symbol: symbol,
      data: result,
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
  // const last100DataPoints = data.slice(-100);
  // const newStartTime = addHours(originalStartTime, data.length - 100);
  const endpointData = {
    instances: [
      {
        start: format(originalStartTime, "yyyy-MM-dd HH:mm:ss"),
        target: data,
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
  return result.predictions[0].mean;
}
