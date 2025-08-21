import type { Product } from '../product/model';
import type { Sales } from '../sales/model';

export type JoinedRow = Product & {
  series: Sales[];
};

export type JoinedRowWithDerived = JoinedRow & {
  filteredSeries: Sales[];
  derivedTotals: {
    totalSales: number;
    totalReadUser: number;
    totalPaidUser: number;
  };
};
