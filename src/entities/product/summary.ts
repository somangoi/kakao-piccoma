import type { Product, ProductSalesDaily, ProductSummary } from './model';

export function createProductSummaryFromRange(
  product: Product,
  allSalesData: ProductSalesDaily[],
  from: Date,
  to: Date
): ProductSummary {
  const sales = allSalesData.filter((d) => d.date >= from && d.date <= to);

  const totalSales = sales.reduce((sum, s) => sum + s.totalSales, 0);
  const totalReadUser = sales.reduce((sum, s) => sum + s.totalReadUser, 0);
  const totalPaidUser = sales.reduce((sum, s) => sum + s.totalPaidUser, 0);

  const days =
    Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return {
    product,
    period: {
      days,
      startDate: sales.length > 0 ? sales[0].date : from,
      endDate: sales.length > 0 ? sales.at(-1)!.date : to,
    },
    totals: {
      totalSales,
      totalReadUser,
      totalPaidUser,
    },
    series: sales,
  };
}
