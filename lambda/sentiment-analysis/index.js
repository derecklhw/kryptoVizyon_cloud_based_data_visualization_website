exports.handler = async (event) => {
  const axios = require("axios");

  for (let record of event.Records) {
    if (record.eventName == "INSERT") {
      let textProcessingApiUrl = "http://text-processing.com/api/sentiment/";

      let response = await axios.post(
        textProcessingApiUrl,
        {
          text: record.dynamodb.NewImage.title.S,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log(response.data);

      return {
        statusCode: 200,
        body: JSON.stringify("Success"),
      };
    }
  }
};
