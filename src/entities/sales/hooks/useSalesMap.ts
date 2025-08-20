import type { ProductSalesDaily } from '@/entities/product/model';
import { useSalesWithWorker } from '@/entities/sales/repository';
import { useMemo } from 'react';

export function useSalesMap() {
  const { data = [], ...rest } = useSalesWithWorker();

  const salesMap = useMemo(() => {
    const map = new Map<number, ProductSalesDaily[]>();
    const salesData = data as ProductSalesDaily[];
    for (const sale of salesData) {
      if (!map.has(sale.productId)) map.set(sale.productId, []);
      map.get(sale.productId)!.push(sale);
    }
    return map;
  }, [data]);

  return { data: salesMap, ...rest };
}
