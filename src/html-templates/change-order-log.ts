import type { ShapedData } from "../types.js";

export function createChangeOrderLogHtml(shapedData: ShapedData): string {
  const {
    documentTitle,
    subcontractor,
    generalContractor,
    project,
    headers,
    data,
    includedColumns,
  } = shapedData;

  // Dynamically generate header cells
  const headerHtml = includedColumns
    .map((key) => `<th>${headers[key] ?? ""}</th>`)
    .join("");

  // Dynamically generate body rows and cells
  const rowsHtml = data
    .map((row) => {
      const cellsHtml = includedColumns
        .map((key) => {
          const value = row[key];
          // Handle date formatting and null/undefined values
          if (value instanceof Date) {
            return `<td>${value.toISOString().split("T")[0]}</td>`;
          }
          return `<td>${value ?? ""}</td>`;
        })
        .join("");
      return `<tr>${cellsHtml}</tr>`;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>${documentTitle}</title>
      <style>
        body {
          font-family: Helvetica, Arial, sans-serif;
          font-size: 12px;
        }
        @page {
          size: landscape;
          margin: 1in;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
          word-wrap: break-word;
        }
        th {
          background-color: #f2f2f2;
        }
        .header-info {
          margin-bottom: 20px;
        }
        h1 {
          text-align: center;
        }
        tr {
          page-break-inside: avoid;
        }
      </style>
    </head>
    <body>
      <h1>${documentTitle}</h1>
      <div class="header-info">
        <div><strong>Project:</strong> ${project}</div>
        <div><strong>From:</strong> ${subcontractor}</div>
        <div><strong>To:</strong> ${generalContractor}</div>
      </div>
      <table>
        <thead>
          <tr>
            ${headerHtml}
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </body>
    </html>
  `;
}
