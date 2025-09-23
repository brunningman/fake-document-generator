import type { PreformattedCorData } from "../types.js";

const headerMapping: { [K in keyof PreformattedCorData]: string } = {
  cor_number: "COR Number",
  cor_title: "COR Title",
  cor_value: "COR Value",
  customer_reference_number: "Customer Reference Number",
  date_submitted: "Date Submitted",
  status: "Status and Stage",
  approved_co_date: "Approved CO Issue Date",
  customer_co_number: "Customer CO Number",
  approved_proceed_date: "Approved To Proceed Date",
  void_date: "Void Date",
  labels: "Label",
  tm_tag_number: "T&M Tag Number",
  status_printed: "Status Printed", // This field is not in the template, but we'll keep it for now
};

const formatDate = (dateString: string | null) => {
  if (!dateString) {
    return null;
  }
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export function transformPreformattedCorData(
  data: PreformattedCorData[]
): Record<string, any>[] {
  return data.map((row) => {
    const newRow: Record<string, any> = {};
    for (const key in row) {
      const typedKey = key as keyof PreformattedCorData;
      const newHeader = headerMapping[typedKey];
      if (newHeader) {
        if (
          [
            "date_submitted",
            "approved_co_date",
            "approved_proceed_date",
            "void_date",
          ].includes(key)
        ) {
          newRow[newHeader] = formatDate(row[typedKey] as string | null);
        } else {
          newRow[newHeader] = row[typedKey];
        }
      }
    }
    return newRow;
  });
}
