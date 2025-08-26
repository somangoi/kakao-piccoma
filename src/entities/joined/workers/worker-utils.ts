import type { Sales } from '@/entities/sales/model';
import type { Product } from '@/entities/product/model';
import type { JoinedRow } from '@/entities/joined/model';

export function joinSalesWithProducts(
  sales: Sales[],
  products: Product[]
): JoinedRow[] {
  const salesMap = new Map<number, Sales[]>();

  for (const s of sales) {
    if (!salesMap.has(s.id)) {
      salesMap.set(s.id, []);
    }
    salesMap.get(s.id)!.push(s);
  }

  console.log('salesMap', salesMap);
  return products.map((product) => ({
    ...product,
    series: salesMap.get(product.id) ?? [],
  }));
}
