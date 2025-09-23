import {
  generateCurrencyAmount,
  generateDateRecent,
  generateId,
  generateSentence,
  generateBoolean,
} from "./common.js";
import type { PreformattedCorData } from "../types.js";

function generateOptional<T>(generator: () => T): T | null {
  return generateBoolean() ? generator() : null;
}

function generatePreformattedCorData(): PreformattedCorData {
  return {
    approved_co_date: generateOptional(() =>
      generateDateRecent().toISOString()
    ),
    approved_proceed_date: generateOptional(() =>
      generateDateRecent().toISOString()
    ),
    cor_number: generateId(),
    cor_title: generateSentence(4),
    cor_value: generateCurrencyAmount(),
    customer_co_number: generateOptional(generateId),
    customer_reference_number: generateOptional(generateId),
    date_submitted: generateOptional(() => generateDateRecent().toISOString()),
    labels: generateOptional(() => generateSentence(2)),
    status: 1,
    status_printed: "Pending",
    tm_tag_number: generateOptional(generateId),
    void_date: generateOptional(() => generateDateRecent().toISOString()),
  };
}

export function generatePreformattedCorDataArray(
  count: number
): PreformattedCorData[] {
  return Array.from({ length: count }, generatePreformattedCorData);
}
