import type { ProductSalesDaily } from '@/entities/product/model';
import { useSales } from '@/entities/sales/repository';
import { useMemo } from 'react';

export function useSalesMap() {
  const { data = [], ...rest } = useSales();

  const salesMap = useMemo(() => {
    const map = new Map<number, ProductSalesDaily[]>();
    for (const sale of data) {
      if (!map.has(sale.productId)) map.set(sale.productId, []);
      map.get(sale.productId)!.push(sale);
    }
    return map;
  }, [data]);

  return { data: salesMap, ...rest };
}
