import { useMemo } from 'react';
import type { JoinedRowWithDerived } from '@/entities/joined/model';

export interface GenreStats {
  count: number;
  sales: number;
}

export const useGenreStats = (filteredRows: JoinedRowWithDerived[]) => {
  return useMemo(() => {
    return filteredRows.reduce(
      (acc, row) => {
        const genre = row.genre;
        if (!acc[genre]) {
          acc[genre] = { count: 0, sales: 0 };
        }
        acc[genre].count += 1;
        acc[genre].sales += row.derivedTotals.totalSales;
        return acc;
      },
      {} as Record<string, GenreStats>
    );
  }, [filteredRows]);
};