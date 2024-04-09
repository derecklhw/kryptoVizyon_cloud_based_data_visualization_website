import fs from "fs";
import path from "path";
import { parseISO, addHours, format } from "date-fns";

/*
 * Function to create train data with reduced data points
 * @param inputFilePath - Input file path
 */
function createTrainData(inputFilePath) {
  // Read data from input file
  const data = JSON.parse(fs.readFileSync(inputFilePath, "utf8"));
  const targetData = data.target;

  // Reduce data points to 100
  const reducedTarget = targetData.slice(0, -100);
  data.target = reducedTarget;

  // Write data to output file
  const directory = path.dirname(inputFilePath);
  const outputFile = path.join(directory, "train.json");

  fs.writeFileSync(outputFile, JSON.stringify(data, null, ""));
  console.log(
    `${outputFile} has been created/updated with reduced data points.`
  );
}

/*
 * Function to extract the last 100 data points
 * @param inputFilePath - Input file path
 */
function extractLast100(inputFilePath) {
  // Read data from input file
  const data = JSON.parse(fs.readFileSync(inputFilePath, "utf8"));

  // Extract the last 100 data points and update the start time
  const last100DataPoints = data.target.slice(-100);
  const originalStartTime = parseISO(data.start);
  const newStartTime = addHours(originalStartTime, data.target.length - 100);
  const newData = {
    start: format(newStartTime, "yyyy-MM-dd HH:mm:ss"),
    target: last100DataPoints,
  };

  // Write data to output file
  const directory = path.dirname(inputFilePath);
  const outputFile = path.join(directory, "target.json");

  fs.writeFileSync(outputFile, JSON.stringify(newData, null, ""));
  console.log(
    `${outputFile} has been created/updated with the last 100 data points and new start time.`
  );
}

/*
 * Main function
 */
function main() {
  // Extract input file path from command line arguments
  const [, , inputFilePath] = process.argv;

  // Validate input file path
  if (!inputFilePath) {
    console.log("Usage: node processData.mjs <input_file>");
    process.exit(1);
  }

  createTrainData(inputFilePath);
  extractLast100(inputFilePath);
}

main();
