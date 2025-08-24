import { useMemo } from 'react';
import { ProductSearchIndex } from '@/entities/product/lib/ProductSearchIndex';
import type { JoinedRowWithDerived } from '@/entities/joined/model';

export function useProductSearch(
  joinedRows: JoinedRowWithDerived[],
  query: string
): JoinedRowWithDerived[] {
  const index = useMemo(() => {
    return new ProductSearchIndex(joinedRows);
  }, [joinedRows]);

  return useMemo(() => {
    return query.trim() ? index.search(query) : joinedRows;
  }, [index, query, joinedRows]);
}