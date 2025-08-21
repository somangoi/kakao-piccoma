import { adaptSalesDto } from '@/entities/sales/adapter';
import type { Sales } from '@/entities/sales/model';
import type { Product } from '@/entities/product/model';
import type { JoinedRow } from '@/entities/joined/model';

export function decodeGzip(buffer: ArrayBuffer): string {
  return new TextDecoder('utf-8').decode(new Uint8Array(buffer));
}

export function parseSalesJson(buffer: ArrayBuffer): Sales[] {
  const decoded = decodeGzip(buffer);
  const raw = JSON.parse(decoded);

  return raw.map(adaptSalesDto);
}

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

  return products.map((product) => ({
    ...product,
    series: salesMap.get(product.id) ?? [],
  }));
}
