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
          rowData[header] = value.toISOString().split("T");
        } else {
          rowData[header] = value;
        }
      }
    }
    return rowData;
  });

  const goldenData = {
    headers: headerValues,
    rows: rows,
  };

  return JSON.stringify(goldenData, null, 2);
}
