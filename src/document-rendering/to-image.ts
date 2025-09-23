import { chromium } from "playwright";
import { createChangeOrderLogHtml } from "../html-templates/change-order-log.js";
import type { ShapedData } from "../types.js";

// Note: This function now returns an array of buffers to support pagination in the future.
// For now, it will return an array with a single image buffer.
export async function renderToImage(shapedData: ShapedData): Promise<Buffer[]> {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    // Set a viewport that approximates landscape letter size
    viewport: { width: 1056, height: 816 },
  });
  const page = await context.newPage();

  const html = createChangeOrderLogHtml(shapedData);
  await page.setContent(html, { waitUntil: "networkidle" });

  const imageBuffer = await page.screenshot({
    fullPage: true,
  });

  await browser.close();

  // Return as an array to accommodate future pagination logic
  return [imageBuffer];
}
