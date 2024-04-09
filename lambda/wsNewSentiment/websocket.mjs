//Import functions for database
import {
  getConnectionIds,
  deleteConnectionId,
  getSentimentAnalysis,
} from "./database.mjs";

//Import API Gateway
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

/*
 * Function to send latest sentiments to connected clients.
 * @param domain - Domain name of API Gateway.
 * @param stage - Stage of API Gateway.
 * @returns Array of promises to send messages to connected clients.
 */
export async function getSendSentimentsPromises(domain, stage) {
  //Get connection IDs of clients
  let clientIdArray = await getConnectionIds();
  console.log("\nClient IDs:\n" + JSON.stringify(clientIdArray));
  console.log("domainName: " + domain + "; stage: " + stage);

  //Create API Gateway management class.
  const callbackUrl = `https://${domain}/${stage}`;
  const apiGwClient = new ApiGatewayManagementApiClient({
    endpoint: callbackUrl,
  });
  let latestSentiments = {};

  // Get sentiment analysis data
  try {
    latestSentiments = await getSentimentAnalysis();
  } catch (err) {
    console.log("Error getting sentiment analysis: " + JSON.stringify(err));
    throw err;
  }

  //Try to send message to connected clients
  let msgPromiseArray = clientIdArray.map(async (item) => {
    //Extract connection ID
    const connId = item.ConnectionId;
    try {
      //   console.log("Sending message '" + message + "' to: " + connId);

      //Create post to connection command
      const postToConnectionCommand = new PostToConnectionCommand({
        ConnectionId: connId,
        Data: JSON.stringify({
          action: "newSentiment",
          latestSentiments: latestSentiments,
        }),
      });

      //Wait for API Gateway to execute and log result
      await apiGwClient.send(postToConnectionCommand);
      console.log("Latest sentiments sent to: " + connId);
    } catch (err) {
      console.log("Failed to send message to: " + connId);

      //Delete connection ID from database
      if (err.statusCode == 410) {
        try {
          await deleteConnectionId(connId);
        } catch (err) {
          console.log("ERROR deleting connectionId: " + JSON.stringify(err));
          throw err;
        }
      } else {
        console.log("UNKNOWN ERROR: " + JSON.stringify(err));
        throw err;
      }
    }
  });

  return msgPromiseArray;
}
