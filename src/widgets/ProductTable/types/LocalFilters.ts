export interface LocalFilters {
  // 텍스트 검색
  searchText: string;
  
  // 다중 선택 필터
  statuses: ('ON_SALE' | 'ACTIVE' | 'INACTIVE')[];
  publishers: string[];
}