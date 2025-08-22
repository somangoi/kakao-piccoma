import { useMemo } from 'react';
import type { JoinedRowWithDerived } from '@/entities/joined/model';

export interface TotalsData {
  totalSales: number;
  totalReadUser: number;
  totalPaidUser: number;
  totalProducts: number;
  totalSalesRecords: number;
}

export const useTotals = (filteredRows: JoinedRowWithDerived[]): TotalsData => {
  return useMemo(() => {
    return filteredRows.reduce(
      (acc, row) => ({
        totalSales: acc.totalSales + row.derivedTotals.totalSales,
        totalReadUser: acc.totalReadUser + row.derivedTotals.totalReadUser,
        totalPaidUser: acc.totalPaidUser + row.derivedTotals.totalPaidUser,
        totalProducts: acc.totalProducts + 1,
        totalSalesRecords: acc.totalSalesRecords + row.filteredSeries.length,
      }),
      {
        totalSales: 0,
        totalReadUser: 0,
        totalPaidUser: 0,
        totalProducts: 0,
        totalSalesRecords: 0,
      }
    );
  }, [filteredRows]);
};