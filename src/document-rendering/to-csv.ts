import type { ShapedData } from "../types.js";
import { formatCurrency } from "./common.js";

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

export function renderToCsv(shapedData: ShapedData): string {
  const { documentTitle, headers, data, includedColumns, pageHeader } =
    shapedData;
  const { useParenthesesForNegative } = shapedData;

  let csv = "";

  // Add headers
  csv += `${documentTitle}\n`;
  if (pageHeader) {
    csv += `${pageHeader}\n`;
  }

  // Add table headers dynamically
  const headerValues = includedColumns.map((key) => headers[key] ?? "");
  csv += `${headerValues.join(",")}\n`;

  // Add data rows dynamically
  data.forEach((row) => {
    const rowValues = includedColumns.map((key) => {
      const value = row[key];
      if (typeof value === "number") {
        return escapeCsvField(formatCurrency(value, useParenthesesForNegative));
      }
      return escapeCsvField(value);
    });
    csv += `${rowValues.join(",")}\n`;
  });

  return csv;
}
