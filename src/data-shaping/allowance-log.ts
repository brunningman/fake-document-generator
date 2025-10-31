import { generateBoolean } from "../data-generation/common.js";
import type { Allowance } from "../types.js";

export function shapeAllowanceData(data: Allowance[]) {
  const headers = {
    allowanceName: "Allowance Name",
    customerReferenceNumber: "Customer Reference Number",
    allowanceType: "Allowance Type",
    allowanceValue: "Allowance Value",
    contract: "Contract",
  };

  const includedColumns = Object.keys(headers) as (keyof Allowance)[];

  const shapedData = data.map((item) => ({
    allowanceName: item.allowanceName,
    customerReferenceNumber: item.customerReferenceNumber || "",
    allowanceType: item.allowanceType,
    allowanceValue: item.allowanceValue,
    contract: item.contract || "",
  }));

  return {
    headers,
    data: shapedData,
    includedColumns,
    useParenthesesForNegative: generateBoolean(),
  };
}
