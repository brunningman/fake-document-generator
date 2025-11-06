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
  gcCO: { header: "GC CO#", variants: ["GC Change Order"], type: "id" },
  quoteType: { header: "Quote Type", variants: ["Type"], type: "string" },
  approvedDate: {
    header: "Approved Date",
    variants: ["Date Approved", "Approved On", "Approved Date"],
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
  const useLeadingZeroForMonthAndDay = generateBoolean();
  const useFullYear = useLeadingZeroForMonthAndDay ? true : generateBoolean();

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
  const headers: Record<string, string> = {};
  const generatedHeaders: { key: keyof ChangeOrder; header: string }[] = [];

  // First pass: generate all headers
  for (const key of includedColumns) {
    const poolItem = masterColumnPool[key];
    if (poolItem) {
      const variants = poolItem.variants;
      const header = [poolItem.header, ...variants][
        Math.floor(Math.random() * (variants.length + 1))
      ]!;
      generatedHeaders.push({ key, header });
    }
  }

  // Second pass: process for duplicates
  const headerCounts: Record<string, number> = {};
  for (const item of generatedHeaders) {
    const currentCount = headerCounts[item.header] || 0;
    if (currentCount > 0) {
      // This is a duplicate
      if (currentCount === 1) {
        // Find the first item and suffix it with _1
        const firstItem = generatedHeaders.find(
          (h) => h.header === item.header
        );
        if (firstItem) {
          headers[firstItem.key] = `${firstItem.header}_1`;
        }
      }
      // Suffix the current item with the next number
      headers[item.key] = `${item.header}_${currentCount + 1}`;
    } else {
      // Not a duplicate yet
      headers[item.key] = item.header;
    }
    headerCounts[item.header] = currentCount + 1;
  }

  const changeOrders: ChangeOrder[] = [];
  const coNumPrefix = ["PCO-", "CO ", ""][Math.floor(Math.random() * 3)];
  let coNumCounter = 1;

  const formatDate = (date: Date | null): string | null => {
    if (!date) return null;
    const month = useLeadingZeroForMonthAndDay
      ? (date.getMonth() + 1).toString().padStart(2, "0")
      : (date.getMonth() + 1).toString();
    const day = useLeadingZeroForMonthAndDay
      ? date.getDate().toString().padStart(2, "0")
      : date.getDate().toString();
    const year = useFullYear
      ? date.getFullYear()
      : date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  };

  for (let i = 0; i < count; i++) {
    const order = {} as ChangeOrder;
    let amount = Number(generateCurrencyAmount().toFixed(2));
    const randomCase = Math.random();
    if (randomCase < 0.1) {
      amount = NaN; // Will result in an empty string
    } else if (randomCase < 0.2) {
      amount = 0;
    }

    // Generate status first to drive date logic
    if (includedColumns.includes("status")) {
      const statuses = ["Submitted", "In Review", "Approved", "Void", ""];
      order.status = statuses[Math.floor(Math.random() * statuses.length)] as
        | string;
    } else {
      order.status = "";
    }

    // Handle date logic based on status or other date fields
    const hasStatus = includedColumns.includes("status");

    order.quoteDate = formatDate(generateDateRecent()); // Always generate a quote date

    if (
      (hasStatus && order.status === "Approved") ||
      (!hasStatus && generateBoolean())
    ) {
      order.approvedDate = formatDate(generateDateRecent());
      order.voidDate = null;
      if (hasStatus) order.status = "Approved";
    } else if (
      (hasStatus && order.status === "Void") ||
      (!hasStatus && generateBoolean())
    ) {
      order.voidDate = formatDate(generateDateRecent());
      order.approvedDate = null;
      if (hasStatus) order.status = "Void";
    } else {
      order.approvedDate = null;
      order.voidDate = null;
      if (
        hasStatus &&
        order.status !== "In Review" &&
        order.status !== "Submitted"
      ) {
        order.status = "Submitted";
      }
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
    order.totalQuote = !isNaN(amount) ? amount : null;

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
          ? Number((amount * Math.random()).toFixed(2))
          : null;
    }
    if (includedColumns.includes("coIssuedDate")) {
      order.coIssuedDate =
        order.status === "Approved" ? formatDate(generateDateRecent()) : null;
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
      `Date: ${formatDate(generateDateRecent())}`,
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
    useParenthesesForNegative,
  };
}
