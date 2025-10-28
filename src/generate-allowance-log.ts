import { generateAllowances } from "./data-generation/allowance-log.js";
import { shapeAllowanceData } from "./data-shaping/allowance-log.js";
import { renderToSimpleCsv } from "./document-rendering/to-simple-csv.js";
import * as fs from "fs";
import * as path from "path";

const ARTEFACTS_DIR = "artefacts";
const ALLOWANCE_LOG_DIR = "allowance-log";

function writeCsvToFile(content: string, filename: string): void {
  const fullPath = path.join(ARTEFACTS_DIR, ALLOWANCE_LOG_DIR);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  fs.writeFileSync(path.join(fullPath, filename), content);
}

function main() {
  const allowances = generateAllowances(100);
  const shapedData = shapeAllowanceData(allowances);
  const csv = renderToSimpleCsv(shapedData);
  writeCsvToFile(csv, "allowance-log.csv");
  console.log("Allowance log generated successfully!");
}

main();
