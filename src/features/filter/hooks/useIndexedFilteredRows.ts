import { useFilterStore } from '@/features/filter/model/useFilterStore';
import { useMemo } from 'react';
import type { JoinedRow, JoinedRowWithDerived } from '@/entities/joined/model';
import type { Sales } from '@/entities/sales/model';
import { SalesDataIndex } from '@/entities/joined/lib/SalesDataIndex';

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
  const { startDate, endDate, genres, publishers } = useFilterStore();

  // 1. 인덱스 생성 (joinedRows가 변경될 때만)
  const dataIndex = useMemo(() => {
    if (joinedRows.length === 0) return null;
    return new SalesDataIndex(joinedRows);
  }, [joinedRows]);

  // 2. 필터링 및 집계 (필터가 변경될 때만)
  return useMemo(() => {
    if (!dataIndex) return [];

    // Step 1: 장르별 제품 필터링
    const filteredProductsByGenre = dataIndex.getProductsByGenres(genres);

    // Step 2: 퍼블리셔별 제품 필터링 (퍼블리셔가 선택되지 않았으면 모든 제품 포함)
    const filteredProductsByPublisher =
      dataIndex.getProductsByPublishers(publishers);

    // Step 4: 교집합 필터링
    const filteredProducts = filteredProductsByGenre.filter((product) =>
      filteredProductsByPublisher.includes(product)
    );

    // Step 3: 날짜별 매출 데이터 조회
    const salesByProduct =
      startDate && endDate
        ? dataIndex.getSalesByDateRange(startDate, endDate)
        : dataIndex.getAllSales();

    // Step 4: 결과 조합
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
  }, [dataIndex, startDate, endDate, genres, publishers]);
};
