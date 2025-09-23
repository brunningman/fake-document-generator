import { chromium } from "playwright";
import { createChangeOrderLogHtml } from "../html-templates/change-order-log.js";
import type { ShapedData } from "../types.js";

export async function renderToPdf(shapedData: ShapedData): Promise<Buffer> {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const html = createChangeOrderLogHtml(shapedData);
  await page.setContent(html, { waitUntil: "networkidle" });

  const pdfBuffer = await page.pdf({
    format: "Letter",
    landscape: true,
    printBackground: true,
    margin: {
      top: "1in",
      right: "1in",
      bottom: "1in",
      left: "1in",
    },
  });

  await browser.close();
  return pdfBuffer;
}
