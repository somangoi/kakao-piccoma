import { adaptSalesDto } from '@/entities/sales/adapter';
import type { Sales } from '@/entities/sales/model';
import type { Product } from '@/entities/product/model';
import type { JoinedRow } from '@/entities/joined/model';
import pako from 'pako';

export function decodeGzip(buffer: ArrayBuffer): string {
  try {
    // gzip 압축 해제 시도
    const decompressed = pako.inflate(buffer);
    return new TextDecoder('utf-8').decode(decompressed);
  } catch (error) {
    // 브라우저가 이미 압축해제한 경우
    return new TextDecoder('utf-8').decode(new Uint8Array(buffer));
  }
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
