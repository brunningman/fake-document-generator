import { faker } from "@faker-js/faker";

export function generateCompanyName(): string {
  return faker.company.name();
}

export function generateDateRecent(days: number = 30): Date {
  return faker.date.recent({ days });
}

export function generateCurrencyAmount(
  min: number = -20000,
  max: number = 50000
): number {
  return faker.number.float({ min, max });
}

export function generateSentence(wordCount: number = 5): string {
  return faker.lorem.sentence({ min: wordCount, max: wordCount + 2 });
}

export function generateId(): string {
  return faker.string.alphanumeric(8).toUpperCase();
}

export function generateBoolean(): boolean {
  return faker.datatype.boolean();
}

export function generatePersonName(): string {
  return faker.person.fullName();
}
