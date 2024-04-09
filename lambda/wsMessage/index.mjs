//Import external library with websocket functions
import { getSendMessagePromises } from "./websocket.mjs";

export const handler = async (event) => {
  console.log(JSON.stringify(event));
  try {
    //Extract domain and stage from event
    const domain = "sq12h10asg.execute-api.us-east-1.amazonaws.com";
    const stage = "prod";
    console.log("Domain: " + domain + " stage: " + stage);

    //Get promises to send messages to connected clients
    // let sendMsgPromises = await getSendMessagePromises(msg, domain, stage);

    //Execute promises
    // await Promise.all(sendMsgPromises);
  } catch (err) {
    return { statusCode: 500, body: "Error: " + JSON.stringify(err) };
  }

  //Success
  return { statusCode: 200, body: "Data sent successfully." };
};
