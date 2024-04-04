import { ListTablesCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import axios from "axios";

const client = new DynamoDBClient({});

export const handler = async (event) => {
  const command = new ListTablesCommand({});

  const response = await client.send(command);
  console.log(response);
  return response;

  // for (let record of event.Records) {
  //   if (record.eventName == "INSERT") {
  //     let textProcessingApiUrl = "http://text-processing.com/api/sentiment/";
  //     let response = await axios.post(
  //       textProcessingApiUrl,
  //       {
  //         text: record.dynamodb.NewImage.title.S,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //         },
  //       }
  //     );
  //     console.log(response.data);
  //     return {
  //       statusCode: 200,
  //       body: JSON.stringify("Success"),
  //     };
  //   }
  // }
};
