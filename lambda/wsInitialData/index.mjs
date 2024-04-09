//Import external library with websocket functions
import { getSendMessagePromise } from "./websocket.mjs";

export const handler = async (event) => {
  try {
    //Extract domain and stage from event
    const domain = event.requestContext.domainName;
    const stage = event.requestContext.stage;

    //Extract connection id from event
    const connectionId = event.requestContext.connectionId;
    console.log("ConnectionId: " + connectionId);

    //Get promise to send inital data to client
    await getSendMessagePromise(domain, stage, connectionId);
  } catch (err) {
    return { statusCode: 500, body: "Error: " + JSON.stringify(err) };
  }

  //Success
  return { statusCode: 200, body: "Data sent successfully." };
};
