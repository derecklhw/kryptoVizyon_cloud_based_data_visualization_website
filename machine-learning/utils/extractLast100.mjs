import fs from "fs";
import { parseISO, addHours, format } from "date-fns";

// Get the input file name from command line arguments
const [, , inputFile] = process.argv;

if (!inputFile) {
  console.log("Usage: node script.mjs <input_file>");
  process.exit(1);
}

// Function to read and process the file
function processFile(fileName) {
  const fileContent = fs.readFileSync(fileName, "utf8");
  const data = JSON.parse(fileContent);

  // Extract the last 100 data points from the "target" array
  const last100DataPoints = data.target.slice(-100);

  // Calculate the new start time
  const originalStartTime = parseISO(data.start);
  const newStartTime = addHours(originalStartTime, data.target.length - 100);

  // Construct the new data structure
  const newData = {
    start: format(newStartTime, "yyyy-MM-dd HH:mm:ss"),
    target: last100DataPoints,
  };

  // Save the new data structure to a file
  fs.writeFileSync("output.json", JSON.stringify(newData, null, ""));
  console.log("Output saved to output.json");
}

// Execute the function and save the result to a file
processFile(inputFile);
