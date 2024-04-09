import { plotData } from "./plotData.mjs";
import { invokeEndpoint } from "./prediction.mjs";

//Axios will handle HTTP requests to web service
import axios from "axios";
import { queryData } from "./queryData.mjs";

//The ID of the student whose data you want to plot
let studentID = process.env.STUDENT_ID;

export const handler = async (event) => {
  const { symbol, url } = event.queryStringParameters;
  try {
    if (!symbol) return { statusCode: 400, body: "Symbol is required" };

    let endpoint =
      symbol === "Synthetic"
        ? "SyntheticDataEndpoint8"
        : symbol === "BTC"
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

    //Get data
    let responseData;
    if (symbol === "Synthetic") {
      responseData = await axios.get(url + studentID);
    } else {
      responseData = await queryData(symbol);
    }

    if (!responseData || !responseData.data)
      return { statusCode: 500, body: "Error extracting data" };

    console.log("Data for '" + symbol + " extracted successfully.");

    let { target, start } = responseData.data;

    //Add basic X values for plot
    let xValues = [];
    for (let i = 0; i < target.length; ++i) {
      xValues.push(i);
    }

    let xValuesCount = xValues.length;

    let xPredictionValues = [xValuesCount];

    let { predictions } = await invokeEndpoint(endpoint, target, start);
    let yMeanValues = predictions[0].mean;
    let yLowerQuantileValues = predictions[0].quantiles["0.1"];
    let yUpperQuantileValues = predictions[0].quantiles["0.9"];

    for (let i = 1; i < yMeanValues.length + 1; ++i) {
      xPredictionValues.push(i + xValuesCount);
    }

    // Call function to plot data
    let plotResult = await plotData(
      symbol,
      xValues,
      target,
      xPredictionValues,
      yMeanValues,
      yLowerQuantileValues,
      yUpperQuantileValues
    );
    console.log("Plot for '" + symbol + "' available at: " + plotResult.url);

    return {
      statusCode: 200,
      body: "Ok",
    };
  } catch (err) {
    console.log("ERROR: " + JSON.stringify(err));
    return {
      statusCode: 500,
      body: "Error plotting data for " + symbol,
    };
  }
};
