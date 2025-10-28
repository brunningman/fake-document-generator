import { faker } from "@faker-js/faker";
import type { Allowance } from "../types.js";
import {
  generateCurrencyAmount,
  generateId,
  generateSentence,
} from "./common.js";

function generateAllowance(overrides: Partial<Allowance> = {}): Allowance {
  const hasCustomerRef = faker.datatype.boolean();
  const hasContract = faker.datatype.boolean();

  return {
    allowanceName: generateSentence(3),
    customerReferenceNumber: hasCustomerRef ? generateId() : undefined,
    allowanceType: faker.helpers.arrayElement([
      "hold",
      "contingency",
      "allowance",
    ]),
    allowanceValue: parseFloat(generateCurrencyAmount().toFixed(2)),
    contract: hasContract ? generateId() : undefined,
    ...overrides,
  };
}

export function generateAllowances(count: number): Allowance[] {
  return Array.from({ length: count }, () => generateAllowance());
}
