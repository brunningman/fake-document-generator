import ExcelJS from "exceljs";
import type { ShapedData } from "../types.js";
import { formatCurrency } from "./common.js";

export async function renderToXlsx(shapedData: ShapedData): Promise<Buffer> {
  const {
    documentTitle,
    subcontractor,
    generalContractor,
    project,
    headers,
    data,
    includedColumns,
    pageHeader,
  } = shapedData;
  const { useParenthesesForNegative } = shapedData;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Change Orders");

  // Add headers
  const lastColumn = String.fromCharCode(65 + includedColumns.length - 1);
  worksheet.mergeCells(`A1:${lastColumn}1`);
  worksheet.getCell("A1").value = documentTitle;
  worksheet.getCell("A1").font = { bold: true, size: 16 };
  worksheet.getCell("A1").alignment = { horizontal: "center" };

  let currentRow = 3;
  if (pageHeader) {
    const headerLines = pageHeader.split("\n");
    headerLines.forEach((line) => {
      worksheet.getCell(`A${currentRow}`).value = line;
      currentRow++;
    });
  } else {
    worksheet.getCell("A3").value = "Project:";
    worksheet.getCell("B3").value = project;
    worksheet.getCell("A4").value = "From:";
    worksheet.getCell("B4").value = subcontractor;
    worksheet.getCell("A5").value = "To:";
    worksheet.getCell("B5").value = generalContractor;
    currentRow = 6;
  }
  worksheet.getRow(currentRow).values = [];
  currentRow++;

  // Add table headers dynamically
  const headerValues = includedColumns.map((key) => headers[key] ?? "");
  const headerRow = worksheet.addRow(headerValues);
  if (headerRow.model) {
    headerRow.model.outlineLevel = 0;
  }
  headerRow.font = { bold: true };
  headerRow.font = { bold: true };

  // Add data rows dynamically
  data.forEach((row) => {
    const rowValues = includedColumns.map((key) => {
      const value = row[key];
      if (typeof value === "number") {
        return formatCurrency(value, useParenthesesForNegative);
      }
      // ExcelJS handles dates and nulls gracefully
      return value;
    });
    worksheet.addRow(rowValues);
  });

  // Auto-fit columns
  for (let i = 0; i < worksheet.columnCount; i++) {
    const column = worksheet.getColumn(i + 1);
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength < 10 ? 10 : maxLength + 2;
  }

  // Return as buffer
  return workbook.xlsx.writeBuffer() as unknown as Promise<Buffer>;
}
