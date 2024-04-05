import { plotData } from "./plotData.mjs";
import { invokeEndpoint } from "./prediction.mjs";

//Axios will handle HTTP requests to web service
import axios from "axios";

//The ID of the student whose data you want to plot
let studentID = process.env.STUDENT_ID;

//URL where student data is available
let url = "https://y2gtfx0jg3.execute-api.us-east-1.amazonaws.com/prod/";

export const handler = async (event) => {
  try {
    //Get synthetic data
    let { target, start } = (await axios.get(url + studentID)).data;

    //Add basic X values for plot
    let xValues = [];
    for (let i = 0; i < target.length; ++i) {
      xValues.push(i);
    }

    let xValuesCount = xValues.length;

    let xPredictionValues = [xValuesCount];

    let { predictions } = await invokeEndpoint(target, start);
    let yMeanValues = predictions[0].mean;
    let yLowerQuantileValues = predictions[0].quantiles["0.1"];
    let yUpperQuantileValues = predictions[0].quantiles["0.9"];

    for (let i = 1; i < yMeanValues.length + 1; ++i) {
      xPredictionValues.push(i + xValuesCount);
    }

    //Call function to plot data
    let plotResult = await plotData(
      studentID,
      xValues,
      target,
      xPredictionValues,
      yMeanValues,
      yLowerQuantileValues,
      yUpperQuantileValues
    );
    console.log(
      "Plot for student '" + studentID + "' available at: " + plotResult.url
    );

    return {
      statusCode: 200,
      body: "Ok",
    };
  } catch (err) {
    console.log("ERROR: " + JSON.stringify(err));
    return {
      statusCode: 500,
      body: "Error plotting data for student ID: " + studentID,
    };
  }
};
