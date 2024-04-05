import fs from "fs";

// Get the input file name from command line arguments
const [, , inputFile] = process.argv;

// Check if the input file argument is provided
if (!inputFile) {
  console.log("Usage: node script.mjs <input_file>");
  process.exit(1);
}

// Load the input file specified by the user
const data = JSON.parse(fs.readFileSync(inputFile, "utf8"));

// Get the target array from the loaded data
const targetData = data.target;

// Calculate the number of data points to remove (30% of the total)
const numToRemove = Math.floor(targetData.length * 0.3);

// Remove the last 30% of data points
const reducedTarget = targetData.slice(0, targetData.length - numToRemove);

// Update the 'target' key with the reduced data set
data.target = reducedTarget;

// Save the modified data to train.json in one-line format
fs.writeFileSync("train.json", JSON.stringify(data, null, ""));

console.log("train.json created with reduced data points.");
