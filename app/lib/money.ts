export function parseMoneyAmount(value: string | number): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value >= 0 ? value : null;
  }

  const normalized = value.replace(/,/g, '').replace(/[^\d.-]/g, '');
  if (!normalized || normalized === '.' || normalized === '-') return null;

  const amount = Number(normalized);
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}
