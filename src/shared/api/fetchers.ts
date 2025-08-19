import type { ProductDto } from '@/entities/product/dto';
import type { SalesDto } from '@/entities/sales/dto';
import { inflate } from 'pako';

export async function fetchProducts(): Promise<ProductDto[]> {
  try {
    const res = await fetch(
      'https://challenge-cdn.real.piccoma-ext.com/fe/api/products'
    );

    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);

    const compressed = new Uint8Array(await res.arrayBuffer());

    // gzip 헤더 확인
    const isGzip =
      compressed.length >= 2 &&
      compressed[0] === 0x1f &&
      compressed[1] === 0x8b;

    let decompressed: string;
    if (isGzip) {
      decompressed = inflate(compressed, { to: 'string' });
    } else {
      decompressed = new TextDecoder('utf-8').decode(compressed);
    }

    const data = JSON.parse(decompressed);

    return data;
  } catch (error) {
    console.error('❌ Products fetch error:', error);
    throw error;
  }
}

export async function fetchSales(): Promise<SalesDto[]> {
  const res = await fetch(
    'https://challenge-cdn.real.piccoma-ext.com/fe/api/sales'
  );

  if (!res.ok) throw new Error(`Failed to fetch sales: ${res.status}`);

  const buf = await res.arrayBuffer();

  const compressed = new Uint8Array(buf);
  const decompressed = inflate(compressed, { to: 'string' });
  const data = JSON.parse(decompressed);

  return data;
}
