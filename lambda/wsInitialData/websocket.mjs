import { getSentimentAnalysis, getHistoricData } from "./database.mjs";
import { getPredictions } from "./prediction.mjs";

//Import API Gateway
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

//Return promise to send data to client
export async function getSendMessagePromise(domain, stage, connId) {
  //Create API Gateway management class.
  const callbackUrl = `https://${domain}/${stage}`;
  const apiGwClient = new ApiGatewayManagementApiClient({
    endpoint: callbackUrl,
  });

  try {
    console.log("Retrieving data initiated...");

    //Get latest sentiments, historic data and predictions
    let latestSentiments = await getSentimentAnalysis();
    let historicData = await getHistoricData();
    let predictions = await getPredictions(historicData);

    console.log("Successfully retrieved data.");

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
    console.log(err);
    console.log("Failed to send data to: " + connId);
  }

  return true;
}
