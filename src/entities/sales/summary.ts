import type { ProductSalesDaily } from '../product/model';

export function createSalesSummary(
  sales: ProductSalesDaily[],
  from: Date,
  to: Date
) {
  const filtered = sales.filter((s) => s.date >= from && s.date <= to);

  const totalSales = filtered.reduce((sum, s) => sum + s.totalSales, 0);
  const totalReadUser = filtered.reduce((sum, s) => sum + s.totalReadUser, 0);
  const totalPaidUser = filtered.reduce((sum, s) => sum + s.totalPaidUser, 0);

  return {
    period: {
      from,
      to,
      days: (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24) + 1,
    },
    totals: {
      totalSales,
      totalReadUser,
      totalPaidUser,
    },
  };
}
