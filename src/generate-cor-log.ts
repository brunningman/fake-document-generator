import fs from "fs/promises";
import path from "path";
import { shapeChangeOrderLog } from "./data-shaping/change-order-log.js";
import { renderToCsv } from "./document-rendering/to-csv.js";
import { renderToPdf } from "./document-rendering/to-pdf.js";
import { renderToImage } from "./document-rendering/to-image.js";
import { renderToXlsx } from "./document-rendering/to-xlsx.js";

async function main() {
  const outputDir = "artefacts/cor-logs";
  // Clear and recreate the output directory
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });

  const rowCounts = [20, 75, 200, 700];
  const docType = "changeOrderLog";

  console.log("Starting batch generation of change order logs...");

  for (const rows of rowCounts) {
    console.log(`\nGenerating dataset for ${rows} rows...`);

    // 1. Generate the dataset ONCE for this size
    const shapedData = shapeChangeOrderLog(rows);

    // 2. Render and save all formats for this dataset
    const baseFileName = `${docType}_${rows}_rows`;

    // CSV
    const csvContent = renderToCsv(shapedData);
    const csvPath = path.join(outputDir, `${baseFileName}.csv`);
    await fs.writeFile(csvPath, csvContent);
    console.log(`  - Created ${csvPath}`);

    // PDF
    const pdfContent = await renderToPdf(shapedData);
    const pdfPath = path.join(outputDir, `${baseFileName}.pdf`);
    await fs.writeFile(pdfPath, pdfContent);
    console.log(`  - Created ${pdfPath}`);

    // PNG
    // PNG (can be multiple pages)
    const pngBuffers = await renderToImage(shapedData);
    for (let i = 0; i < pngBuffers.length; i++) {
      const buffer = pngBuffers[i];
      const pageNum = i + 1;
      const pngPath = path.join(
        outputDir,
        `${baseFileName}_page_${pageNum}.png`
      );
      if (buffer) {
        await fs.writeFile(pngPath, buffer);
        console.log(`  - Created ${pngPath}`);
      }
    }

    // XLSX
    const xlsxContent = await renderToXlsx(shapedData);
    const xlsxPath = path.join(outputDir, `${baseFileName}.xlsx`);
    await fs.writeFile(xlsxPath, xlsxContent);
    console.log(`  - Created ${xlsxPath}`);
  }

  console.log("\nBatch generation complete.");
}

main().catch(console.error);
