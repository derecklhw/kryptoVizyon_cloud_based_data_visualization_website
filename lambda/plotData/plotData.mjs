//Axios will handle HTTP requests to web service
import axios from "axios";

//The ID of the student whose data you want to plot
let studentID = "M00826933";

//URL where student data is available
let url = "https://y2gtfx0jg3.execute-api.us-east-1.amazonaws.com/prod/";

//Authentication details for Plotly
//ADD YOUR OWN AUTHENTICATION DETAILS
const PLOTLY_USERNAME = "dl661";
const PLOTLY_KEY = "Ziowel3gSBJMJ0nJ7NNj";

//Initialize Plotly with user details.
import Plotly from "plotly";
let plotly = Plotly(PLOTLY_USERNAME, PLOTLY_KEY);

async function handler(event) {
  try {
    //Get synthetic data
    let yValues = (await axios.get(url + studentID)).data.target;

    //Add basic X values for plot
    let xValues = [];
    for (let i = 0; i < yValues.length; ++i) {
      xValues.push(i);
    }

    let xValuesCount = xValues.length;

    let xPredictionValues = [xValuesCount];
    let yMeanValues = [
      600.4459838867, 596.5627441406, 620.3205566406, 636.9716796875,
      621.5438232422, 634.0146484375, 639.5564575195, 651.4906005859,
      652.7758178711, 661.565246582, 661.5686035156, 657.7469482422,
      651.9678344727, 656.0505981445, 652.9138793945, 644.2525024414,
      627.1451416016, 627.9223632812, 623.235168457, 645.2424316406,
      642.6328125, 630.6696777344, 635.0681762695, 634.8489379883, 648.546875,
      637.8089599609, 650.0704956055, 668.6294555664, 689.1611938477,
      683.7260131836, 700.384765625, 709.5647583008, 715.0274047852,
      726.2651367188, 718.8451538086, 716.032043457, 723.9096679688,
      711.0045166016, 711.4743652344, 710.7241210938, 713.4483032227,
      695.2567138672, 689.4649047852, 703.4821777344, 704.9007568359,
      705.9891357422, 697.9722900391, 679.4067993164, 681.9125976562,
      680.537109375,
    ];
    let yLowerQuantileValues = [
      570.7510375977, 570.075378418, 592.1709594727, 604.6682128906,
      602.6517944336, 604.3928222656, 613.2423706055, 624.1807861328,
      621.5659790039, 624.4218139648, 634.0059204102, 632.5487060547,
      624.4642333984, 619.1696777344, 632.8900756836, 621.188659668,
      591.9515991211, 596.3729248047, 599.1937255859, 616.1630249023,
      607.7339477539, 603.9561157227, 596.2838745117, 602.2775268555,
      608.7764892578, 605.6693725586, 622.7589111328, 628.030090332,
      662.2155761719, 650.626953125, 667.6058959961, 679.0215454102,
      671.2614135742, 697.6464233398, 684.8387451172, 685.8430786133,
      694.0180053711, 678.5720214844, 679.3731689453, 663.8770141602,
      677.2970581055, 664.6592407227, 656.6961669922, 667.0875244141,
      672.9889526367, 670.5202636719, 670.662902832, 647.4395751953,
      656.9071044922, 643.2025756836,
    ];
    let yUpperQuantileValues = [
      630.0259399414, 617.2377319336, 648.204284668, 679.0054321289,
      649.3887329102, 656.7922363281, 664.1311035156, 679.2598266602,
      680.8795166016, 690.1995239258, 701.2189941406, 695.5394897461,
      688.1558227539, 691.0747680664, 677.8071289062, 683.0530395508,
      659.3381958008, 672.9553222656, 655.8020019531, 679.7261352539,
      682.2381591797, 664.3648681641, 663.0891723633, 682.8103027344,
      683.969909668, 668.6721191406, 688.7399291992, 702.8628540039,
      720.7100830078, 715.6593017578, 738.9915161133, 742.9432373047,
      757.9356689453, 765.4763183594, 755.1768188477, 752.8223876953,
      749.7020874023, 741.2398681641, 742.0363769531, 760.0179443359,
      757.3140258789, 733.5171508789, 737.5048217773, 742.8277587891,
      739.6473999023, 740.6723632812, 740.5200195312, 721.5258178711,
      717.510925293, 714.2409667969,
    ];

    for (let i = 1; i < yMeanValues.length + 1; ++i) {
      xPredictionValues.push(i + xValuesCount);
    }

    //Call function to plot data
    let plotResult = await plotData(
      studentID,
      xValues,
      yValues,
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
}

//Plots the specified data
async function plotData(
  studentID,
  xValues,
  yValues,
  xPredictionValues,
  yMeanValues,
  yLowerQuantileValues,
  yUpperQuantileValues
) {
  //Data structure
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
    title: "Synthetic Data for Student " + studentID,
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

handler();
