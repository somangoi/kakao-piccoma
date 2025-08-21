import { useFilterStore } from '@/features/filter/model/useFilterStore';
import { useMemo } from 'react';
import type { JoinedRow, JoinedRowWithDerived } from '../model';
import type { Sales } from '@/entities/sales/model';

class SalesDataIndex {
  private productIndex = new Map<number, JoinedRow>();
  private genreIndex = new Map<string, JoinedRow[]>();
  private dateIndex = new Map<
    string,
    Array<{ sale: Sales; productId: number }>
  >();

  constructor(joinedRows: JoinedRow[]) {
    this.buildIndexes(joinedRows);
  }

  private buildIndexes(joinedRows: JoinedRow[]) {
    for (const row of joinedRows) {
      // 1. 제품별 인덱스
      this.productIndex.set(row.id, row);

      // 2. 장르별 인덱스
      if (!this.genreIndex.has(row.genre)) {
        this.genreIndex.set(row.genre, []);
      }
      this.genreIndex.get(row.genre)!.push(row);

      // 3. 날짜별 인덱스
      for (const sale of row.series) {
        const dateKey = this.getDateKey(sale.date);
        if (!this.dateIndex.has(dateKey)) {
          this.dateIndex.set(dateKey, []);
        }
        this.dateIndex.get(dateKey)!.push({ sale, productId: row.id });
      }
    }
  }

  private getDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // 장르별 제품 조회
  getProductsByGenres(genres: string[]): JoinedRow[] {
    if (genres.length === 0) {
      return Array.from(this.productIndex.values());
    }

    const result: JoinedRow[] = [];
    const seen = new Set<number>();

    for (const genre of genres) {
      const products = this.genreIndex.get(genre) || [];
      for (const product of products) {
        if (!seen.has(product.id)) {
          seen.add(product.id);
          result.push(product);
        }
      }
    }

    return result;
  }

  // 날짜 범위별 매출 조회
  getSalesByDateRange(startDate: Date, endDate: Date): Map<number, Sales[]> {
    const start = this.getDateKey(startDate);
    const end = this.getDateKey(endDate);
    const salesByProduct = new Map<number, Sales[]>();

    for (const [dateKey, salesData] of this.dateIndex) {
      if (dateKey >= start && dateKey <= end) {
        for (const { sale, productId } of salesData) {
          if (!salesByProduct.has(productId)) {
            salesByProduct.set(productId, []);
          }
          salesByProduct.get(productId)!.push(sale);
        }
      }
    }

    return salesByProduct;
  }

  // 모든 매출 데이터 조회 (날짜 필터 없음)
  getAllSales(): Map<number, Sales[]> {
    const salesByProduct = new Map<number, Sales[]>();

    for (const product of this.productIndex.values()) {
      salesByProduct.set(product.id, product.series);
    }

    return salesByProduct;
  }
}

// 합계 계산 함수
function calculateTotals(sales: Sales[]) {
  return sales.reduce(
    (acc, sale) => ({
      totalSales: acc.totalSales + sale.totalSales,
      totalReadUser: acc.totalReadUser + sale.totalReadUser,
      totalPaidUser: acc.totalPaidUser + sale.totalPaidUser,
    }),
    { totalSales: 0, totalReadUser: 0, totalPaidUser: 0 }
  );
}

export const useIndexedFilteredRows = (
  joinedRows: JoinedRow[]
): JoinedRowWithDerived[] => {
  const { startDate, endDate, genres } = useFilterStore();

  // 1. 인덱스 생성 (joinedRows가 변경될 때만)
  const dataIndex = useMemo(() => {
    if (joinedRows.length === 0) return null;
    return new SalesDataIndex(joinedRows);
  }, [joinedRows]);

  // 2. 필터링 및 집계 (필터가 변경될 때만)
  return useMemo(() => {
    if (!dataIndex) return [];

    // Step 1: 장르별 제품 필터링
    const filteredProducts = dataIndex.getProductsByGenres(genres);

    // Step 2: 날짜별 매출 데이터 조회
    const salesByProduct =
      startDate && endDate
        ? dataIndex.getSalesByDateRange(startDate, endDate)
        : dataIndex.getAllSales();

    // Step 3: 결과 조합
    const result = filteredProducts.map((product) => {
      const filteredSeries = salesByProduct.get(product.id) || [];
      const derivedTotals = calculateTotals(filteredSeries);

      return {
        ...product,
        filteredSeries,
        derivedTotals,
      };
    });

    return result;
  }, [dataIndex, startDate, endDate, genres]);
};
