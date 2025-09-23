import { generatePreformattedCorDataArray } from "./data-generation/preformatted-cor.js";
import { renderToPreformattedCsv } from "./document-rendering/to-preformatted-csv.js";
import fs from "fs";
import path from "path";

const outputDir = "artefacts/preformatted-cor-logs";
const rowCount = 80;

// Clear the output directory
fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

// Generate the data
const data = generatePreformattedCorDataArray(rowCount);

// Render the CSV
const csv = renderToPreformattedCsv(data);

// Write the file
const outputFile = path.join(
  outputDir,
  `preformatted-cor-log_${rowCount}_rows.csv`
);
fs.writeFileSync(outputFile, csv);

console.log(`Generated ${outputFile}`);
