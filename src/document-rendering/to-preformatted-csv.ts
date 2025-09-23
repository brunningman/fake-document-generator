import type { PreformattedCorData } from "../types.js";
import { transformPreformattedCorData } from "../data-shaping/preformatted-cor.js";

// Helper to quote CSV fields if they contain commas or quotes
function escapeCsvField(field: any): string {
  if (field === null || field === undefined) {
    return "";
  }
  const stringField = String(field);
  if (
    stringField.includes(",") ||
    stringField.includes('"') ||
    stringField.includes("\n")
  ) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
}

export function renderToPreformattedCsv(data: PreformattedCorData[]): string {
  if (data.length === 0) {
    return "";
  }

  const transformedData = transformPreformattedCorData(data);
  const headers = Object.keys(transformedData[0]!);
  let csv = `${headers.join(",")}\n`;

  // Add data rows dynamically
  transformedData.forEach((row) => {
    const rowValues = headers.map((header) => {
      const value = row[header];
      return escapeCsvField(value);
    });
    csv += `${rowValues.join(",")}\n`;
  });

  return csv;
}
