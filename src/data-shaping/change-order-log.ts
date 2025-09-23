import {
  generateBoolean,
  generateCompanyName,
  generateCurrencyAmount,
  generateDateRecent,
  generateId,
  generatePersonName,
  generateSentence,
} from "../data-generation/common.js";
import type { ChangeOrder, ShapedData } from "../types.js";

// Helper to format currency
function formatCurrency(
  amount: number,
  useParenthesesForNegative: boolean
): string {
  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "USD",
  };
  const formatted = new Intl.NumberFormat("en-US", options).format(amount);
  if (amount < 0 && useParenthesesForNegative) {
    return `(${formatted.replace("-", "")})`;
  }
  return formatted;
}

// Define a type for our column definitions
type ColumnDefinition = { header: string; variants: string[]; type: string };

// Master pool of all possible columns from all samples
const masterColumnPool: Record<string, ColumnDefinition> = {
  pcoNum: { header: "PCO #", variants: ["Change #"], type: "id" },
  status: { header: "Status", variants: ["Stat."], type: "status" },
  description: {
    header: "Description",
    variants: ["Scope"],
    type: "description",
  },
  quoteDate: { header: "Quote Date", variants: ["Date"], type: "date" },
  totalQuote: {
    header: "Total Quote",
    variants: ["Amount", "Value"],
    type: "currency",
  },
  revision: { header: "Revision", variants: ["Rev"], type: "revision" },
  notes: { header: "Notes", variants: ["Comments"], type: "notes" },
  amountApproved: {
    header: "Amount Approved",
    variants: ["Approved Amt"],
    type: "currency",
  },
  dateApproved: {
    header: "Date Approved",
    variants: ["Approved Date"],
    type: "date",
  },
  gcCO: { header: "GC CO#", variants: ["GC Change Order"], type: "id" },
  quoteType: { header: "Quote Type", variants: ["Type"], type: "string" },
};

// Main "shaper" function
export function shapeChangeOrderLog(count: number): ShapedData {
  const subcontractor = generateCompanyName();
  const generalContractor = generateCompanyName();
  const project = `Project ${generateId()}`;
  const useParenthesesForNegative = generateBoolean();

  // Randomly select a subset of columns for this run
  const columnKeys = Object.keys(masterColumnPool) as (keyof ChangeOrder)[];
  const includedColumns: (keyof ChangeOrder)[] = [
    "pcoNum",
    "description",
    "totalQuote",
  ]; // Core columns
  for (const key of columnKeys) {
    if (!includedColumns.includes(key) && generateBoolean()) {
      includedColumns.push(key);
    }
  }

  // Generate headers for the selected columns
  const headers = includedColumns.reduce((acc, key) => {
    const poolItem = masterColumnPool[key];
    if (poolItem) {
      const variants = poolItem.variants;
      acc[key] = [poolItem.header, ...variants][
        Math.floor(Math.random() * (variants.length + 1))
      ]!;
    }
    return acc;
  }, {} as Record<string, string>);

  const changeOrders: ChangeOrder[] = [];
  for (let i = 0; i < count; i++) {
    const order = {} as ChangeOrder; // Start with an empty object and assert its type
    const amount = generateCurrencyAmount();

    // Generate data for each selected column
    for (const key of includedColumns) {
      if (
        !["pcoNum", "description", "totalQuote"].includes(key) &&
        generateBoolean()
      ) {
        (order as any)[key] = null;
        continue;
      }

      const columnType = masterColumnPool[key]?.type;
      switch (columnType) {
        case "id":
          (order as any)[key] = `${generateBoolean() ? "-" : ""}${i + 1}`;
          break;
        case "status":
          (order as any)[key] = [
            "Submitted",
            "In Review",
            "Approved",
            "Quote in Process",
          ][Math.floor(Math.random() * 4)];
          break;
        case "description":
          (order as any)[key] = `${
            ["RFI", "ASI"][Math.floor(Math.random() * 2)]
          } #${Math.floor(Math.random() * 1000)} - ${generateSentence(4)}`;
          break;
        case "date":
          (order as any)[key] = generateDateRecent();
          break;
        case "currency":
          (order as any)[key] = formatCurrency(
            amount,
            useParenthesesForNegative
          );
          break;
        case "revision":
          (order as any)[key] = generateBoolean()
            ? Math.floor(Math.random() * 5)
            : "XXX";
          break;
        case "notes":
          (order as any)[key] = generateBoolean() ? generateSentence(8) : "";
          break;
        case "string":
          (order as any)[key] = generateSentence(1);
          break;
      }
    }
    changeOrders.push(order);
  }

  const documentTitles = [
    "Change Order Log",
    "COR Summary",
    "Project Change Orders",
    "Change Log",
  ];
  const documentTitle =
    documentTitles[Math.floor(Math.random() * documentTitles.length)]!;

  return {
    documentTitle,
    subcontractor,
    generalContractor,
    project,
    headers,
    data: changeOrders,
    includedColumns,
  };
}
