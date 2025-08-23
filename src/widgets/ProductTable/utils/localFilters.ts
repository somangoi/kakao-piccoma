import type { JoinedRowWithDerived } from '@/entities/joined/model';
import type { LocalFilters } from '../types/LocalFilters';

export const initialLocalFilters: LocalFilters = {
  searchText: '',
  statuses: [],
  publishers: [],
};

// 필터가 비어있는지 확인하는 헬퍼 함수
export const isLocalFiltersEmpty = (filters: LocalFilters): boolean => {
  return (
    !filters.searchText &&
    filters.statuses.length === 0 &&
    filters.publishers.length === 0
  );
};

// 필터 개수를 세는 헬퍼 함수
export const getActiveLocalFiltersCount = (filters: LocalFilters): number => {
  let count = 0;

  if (filters.searchText) count++;
  if (filters.statuses.length > 0) count++;
  if (filters.publishers.length > 0) count++;

  return count;
};

export const applyLocalFilters = (
  rows: JoinedRowWithDerived[],
  filters: LocalFilters
): JoinedRowWithDerived[] => {
  return rows.filter((row) => {
    // 1. 상태 필터
    if (filters.statuses.length > 0 && !filters.statuses.includes(row.status)) {
      return false;
    }

    // 2. 출판사 필터
    if (
      filters.publishers.length > 0 &&
      !filters.publishers.includes(row.publisher)
    ) {
      return false;
    }

    return true;
  });
};
