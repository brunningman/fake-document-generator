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

interface SimpleCsvInput<T> {
  headers: Record<keyof T, string>;
  data: T[];
  includedColumns: (keyof T)[];
}

export function renderToSimpleCsv<T extends Record<string, any>>(
  csvInput: SimpleCsvInput<T>
): string {
  const { headers, data, includedColumns } = csvInput;

  let csv = "";

  // Add table headers dynamically
  const headerValues = includedColumns.map((key) => headers[key] ?? "");
  csv += `${headerValues.join(",")}\n`;

  // Add data rows dynamically
  data.forEach((row) => {
    const rowValues = includedColumns.map((key) => {
      const value = row[key];
      return escapeCsvField(value);
    });
    csv += `${rowValues.join(",")}\n`;
  });

  return csv;
}
