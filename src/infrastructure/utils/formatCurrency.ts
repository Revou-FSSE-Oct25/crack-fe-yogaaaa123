// ============================================================================
// Currency formatter — uses IDR (Indonesian Rupiah) by default.
// Change locale / currency as needed for the deployment target.
// ============================================================================

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return formatter.format(amount);
}
