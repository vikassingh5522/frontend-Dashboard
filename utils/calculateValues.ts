export function calculateRow(
  item: {
    stock: string;
    purchasePrice: number;
    qty: number;
    exchange: string;
    sector: string;
    symbol: string;
  },
  cmp: number | null
) {
  const investment = item.purchasePrice * item.qty;
  const presentValue = cmp ? cmp * item.qty : 0;
  const gainLoss = cmp ? presentValue - investment : 0;

  return { investment, presentValue, gainLoss };
}
