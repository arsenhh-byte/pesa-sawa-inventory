
/**
 * Formats a number as Kenya Shillings (KES)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculates the total value of inventory
 */
export function calculateInventoryValue(
  products: { quantity: number; buyingPrice: number }[]
): number {
  return products.reduce((total, product) => {
    return total + product.quantity * product.buyingPrice;
  }, 0);
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date instanceof Date ? date : new Date(date));
}
