import { getSentimentAnalysis, getHistoricData } from "./database.mjs";
import { getPredictions } from "./prediction.mjs";

import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

/*
 * Function to send initial data to client
 * @param domain - Domain of API Gateway
 * @param stage - Stage of API Gateway
 * @param connId - Connection Id
 */
export async function getSendMessagePromise(domain, stage, connId) {
  //Create API Gateway management class.
  const callbackUrl = `https://${domain}/${stage}`;
  const apiGwClient = new ApiGatewayManagementApiClient({
    endpoint: callbackUrl,
  });

  try {
    console.log("Retrieving data initiated...");

    // Get latest sentiments, historic data and predictions
    let latestSentiments = await getSentimentAnalysis();
    let historicData = await getHistoricData();
    let predictions = await getPredictions(historicData);

    console.log("Successfully retrieved data.");

    // Reduce historic data to only the last 150 data points
    historicData = historicData.reduce((accumulator, data) => {
      accumulator[data.symbol] = data.data.slice(-150);
      return accumulator;
    }, {});

    //Create post to connection command
    const postToConnectionCommand = new PostToConnectionCommand({
      ConnectionId: connId,
      Data: JSON.stringify({
        action: "initialData",
        sentiments: latestSentiments,
        historicData: historicData,
        predictions: predictions,
      }),
    });

    //Wait for API Gateway to execute and log result
    await apiGwClient.send(postToConnectionCommand);
    console.log("Successfully sent data to: " + connId);
  } catch (err) {
    console.log("Failed to send data to: " + connId);
    console.log("Error: " + JSON.stringify(err));
    throw err;
  }

  return true;
}
