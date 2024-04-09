import Plotly from "plotly";

// Initialize Plotly with user details
const PLOTLY_USERNAME = process.env.PLOTLY_USERNAME;
const PLOTLY_KEY = process.env.PLOTLY_API_KEY;

let plotly = Plotly(PLOTLY_USERNAME, PLOTLY_KEY);

/*
 * Plots the data using Plotly
 * @param {string} symbol - The symbol of the data
 * @param {number[]} xValues - The x values of the original data
 * @param {number[]} yValues - The y values of the original data
 * @param {number[]} xPredictionValues - The x values of the prediction data
 * @param {number[]} yMeanValues - The mean values of the prediction data
 * @param {number[]} yLowerQuantileValues - The lower quantile values of the prediction data
 * @param {number[]} yUpperQuantileValues - The upper quantile values of the prediction data
 * @returns {Promise} - The promise of the plot
 */
export async function plotData(
  symbol,
  xValues,
  yValues,
  xPredictionValues,
  yMeanValues,
  yLowerQuantileValues,
  yUpperQuantileValues
) {
  // Data for graph
  let studentData = {
    x: xValues,
    y: yValues,
    type: "scatter",
    mode: "line",
    name: "Original Data",
    marker: {
      color: "rgb(219, 64, 82)",
      size: 12,
    },
  };
  let meanData = {
    x: xPredictionValues,
    y: yMeanValues,
    type: "scatter",
    mode: "line",
    name: "Mean",
    marker: {
      color: "rgb(64, 219, 82)",
      size: 12,
    },
  };
  let lowestQuantile = {
    x: xPredictionValues,
    y: yLowerQuantileValues,
    type: "scatter",
    mode: "line",
    name: "0.1 Quantile",
    marker: {
      color: "rgb(64, 82, 219)",
      size: 12,
    },
  };
  let highestQuantile = {
    x: xPredictionValues,
    y: yUpperQuantileValues,
    type: "scatter",
    mode: "line",
    name: "0.9 Quantile",
    marker: {
      color: "rgb(219, 219, 64)",
      size: 12,
    },
  };

  let data = [studentData, meanData, lowestQuantile, highestQuantile];

  //Layout of graph
  let layout = {
    title: "Data for: " + symbol,
    font: {
      size: 25,
    },
    xaxis: {
      title: "Time (hours)",
    },
    yaxis: {
      title: "Value",
    },
  };
  let graphOptions = {
    layout: layout,
    filename: "date-axes",
    fileopt: "overwrite",
  };

  //Wrap Plotly callback in a promise
  return new Promise((resolve, reject) => {
    plotly.plot(data, graphOptions, function (err, msg) {
      if (err) reject(err);
      else {
        resolve(msg);
      }
    });
  });
}
