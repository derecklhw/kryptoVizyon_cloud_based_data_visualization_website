//Import external library with websocket functions
import { getSendPredictionsPromises } from "./websocket.mjs";

export const handler = async (event) => {
  console.log(JSON.stringify(event));
  try {
    //Extract domain and stage from event
    const domain = "sq12h10asg.execute-api.us-east-1.amazonaws.com";
    const stage = "prod";
    console.log("Domain: " + domain + " stage: " + stage);

    let symbol;
    for (const record of event.Records) {
      //Extract message from record
      if (record.eventName == "INSERT")
        symbol = record.dynamodb.NewImage.symbol.S;
      else symbol = record.dynamodb.OldImage.symbol.S;
    }

    console.log("Symbol: " + symbol);

    //Get promises to send latest sentiments to connected clients
    let sendMsgPromises = await getSendPredictionsPromises(
      domain,
      stage,
      symbol
    );

    //Execute promises
    await Promise.all(sendMsgPromises);
  } catch (err) {
    return { statusCode: 500, body: "Error: " + JSON.stringify(err) };
  }

  //Success
  return { statusCode: 200, body: "Data sent successfully." };
};
