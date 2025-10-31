export function formatCurrency(
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
