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
  pcoNum: {
    header: "PCO #",
    variants: ["Change #", "PCI #", "CO Num", "PO #"],
    type: "id",
  },
  status: { header: "Status", variants: ["Stat."], type: "status" },
  description: {
    header: "Description",
    variants: ["Scope"],
    type: "description",
  },
  quoteDate: {
    header: "Quote Date",
    variants: ["Date", "Submitted Date", "Sent On"],
    type: "date",
  },
  totalQuote: {
    header: "Total Quote",
    variants: ["Amount", "Value", "Cost"],
    type: "currency",
  },
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
  approvedDate: {
    header: "Approved Date",
    variants: ["Date Approved", "Approved On"],
    type: "date",
  },
  coIssuedDate: { header: "CO Issued Date", variants: [], type: "date" },
  voidDate: {
    header: "Void Date",
    variants: ["Voided On", "Cancelled On"],
    type: "date",
  },
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
    "quoteDate",
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
  const coNumPrefix = ["PCO-", "CO ", ""][Math.floor(Math.random() * 3)];
  let coNumCounter = 1;

  for (let i = 0; i < count; i++) {
    const order = {} as ChangeOrder;
    let amount = generateCurrencyAmount();
    const randomCase = Math.random();
    if (randomCase < 0.1) {
      amount = NaN; // Will result in an empty string
    } else if (randomCase < 0.2) {
      amount = 0;
    }

    // Generate status first to drive date logic
    if (includedColumns.includes("status")) {
      const statuses = ["Submitted", "In Review", "Approved", "Void", null];
      order.status = statuses[Math.floor(Math.random() * statuses.length)] as
        | string
        | null;
    } else {
      order.status = null;
    }

    // Handle date logic based on status
    if (order.status) {
      order.quoteDate = generateDateRecent();
      if (order.status === "Approved") {
        order.approvedDate = generateDateRecent();
        order.voidDate = null;
      } else if (order.status === "Void") {
        order.voidDate = generateDateRecent();
        order.approvedDate = null;
      } else {
        order.approvedDate = null;
        order.voidDate = null;
      }
    } else {
      order.quoteDate = null;
      order.approvedDate = null;
      order.voidDate = null;
    }

    // Generate other fields
    if (i > 0 && generateBoolean()) {
      // Skip a number
      coNumCounter += Math.floor(Math.random() * 2);
    }
    const revision = generateBoolean()
      ? `.${Math.floor(Math.random() * 5) + 1}`
      : "";
    order.pcoNum = `${coNumPrefix}${coNumCounter}${revision}`;
    coNumCounter++;

    order.description = `${
      ["RFI", "ASI"][Math.floor(Math.random() * 2)]
    } #${Math.floor(Math.random() * 1000)} - ${generateSentence(4)}`;
    order.totalQuote = !isNaN(amount)
      ? formatCurrency(amount, useParenthesesForNegative)
      : "";

    if (includedColumns.includes("notes")) {
      order.notes = generateBoolean() ? generateSentence(8) : "";
    }
    if (includedColumns.includes("gcCO")) {
      order.gcCO = `GC-CO-${i + 1}`;
    }
    if (includedColumns.includes("quoteType")) {
      order.quoteType = generateSentence(1);
    }
    if (includedColumns.includes("amountApproved")) {
      order.amountApproved =
        order.status === "Approved"
          ? formatCurrency(amount * 0.9, useParenthesesForNegative)
          : null;
    }
    if (includedColumns.includes("coIssuedDate")) {
      order.coIssuedDate =
        order.status === "Approved" ? generateDateRecent() : null;
    }

    // Null out fields that are not included in this run
    for (const key of Object.keys(order) as (keyof ChangeOrder)[]) {
      if (!includedColumns.includes(key)) {
        (order as any)[key] = undefined;
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

  let pageHeader: string | undefined;
  if (generateBoolean()) {
    const headerLines = [
      `Project: ${project}`,
      `To: ${generalContractor}`,
      `From: ${subcontractor}`,
      `Date: ${generateDateRecent().toLocaleDateString()}`,
    ];
    // Randomly shuffle and pick a subset of lines
    const shuffledLines = headerLines.sort(() => 0.5 - Math.random());
    const selectedLines = shuffledLines.slice(
      0,
      Math.floor(Math.random() * headerLines.length) + 1
    );

    // Add some random blank lines
    const blankLines = "\n".repeat(Math.floor(Math.random() * 4));
    pageHeader = selectedLines.join("\n") + blankLines;
  }

  return {
    documentTitle,
    subcontractor,
    generalContractor,
    project,
    headers,
    data: changeOrders,
    includedColumns,
    pageHeader,
  };
}
