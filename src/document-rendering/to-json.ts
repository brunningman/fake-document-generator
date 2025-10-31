import type { ShapedData } from "../types.js";

export function renderToJson(shapedData: ShapedData): string {
  const { headers, data, includedColumns } = shapedData;

  const headerValues = includedColumns.map((key) => headers[key] ?? "");

  const rows = data.map((row) => {
    const rowData: Record<string, any> = {};
    for (const key of includedColumns) {
      const header = headers[key];
      if (header) {
        const value = row[key];
        if (value instanceof Date) {
          rowData[header] = value.toLocaleDateString("en-US");
        } else if (typeof value === "number") {
          rowData[header] = value;
        } else {
          rowData[header] = value;
        }
      }
    }
    return rowData;
  });

  const analysis = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  ];

  const goldenData = {
    headers: headerValues,
    rows: rows,
    analysis: analysis.slice(0, Math.floor(Math.random() * 5) + 1),
  };

  return JSON.stringify(goldenData, null, 2);
}
