import fs from "fs";
import path from "path";
import { parseISO, addHours, format } from "date-fns";

// Function to remove the last 100 data points and save to a new file
function createTrainData(inputFilePath) {
  const data = JSON.parse(fs.readFileSync(inputFilePath, "utf8"));
  const targetData = data.target;
  const reducedTarget = targetData.slice(0, -100);
  data.target = reducedTarget;

  const directory = path.dirname(inputFilePath);
  const outputFile = path.join(directory, "train.json");

  fs.writeFileSync(outputFile, JSON.stringify(data, null, ""));
  console.log(
    `${outputFile} has been created/updated with reduced data points.`
  );
}

// Function to extract the last 100 data points with the adjusted start time
function extractLast100(inputFilePath) {
  const data = JSON.parse(fs.readFileSync(inputFilePath, "utf8"));
  const last100DataPoints = data.target.slice(-100);
  const originalStartTime = parseISO(data.start);
  const newStartTime = addHours(originalStartTime, data.target.length - 100);
  const newData = {
    start: format(newStartTime, "yyyy-MM-dd HH:mm:ss"),
    target: last100DataPoints,
  };

  const directory = path.dirname(inputFilePath);
  const outputFile = path.join(directory, "output.json");

  fs.writeFileSync(outputFile, JSON.stringify(newData, null, ""));
  console.log(
    `${outputFile} has been created/updated with the last 100 data points and new start time.`
  );
}

// Main function to control the workflow
function main() {
  const [, , inputFilePath] = process.argv;

  if (!inputFilePath) {
    console.log("Usage: node processData.mjs <input_file>");
    process.exit(1);
  }

  createTrainData(inputFilePath);
  extractLast100(inputFilePath);
}

main();
