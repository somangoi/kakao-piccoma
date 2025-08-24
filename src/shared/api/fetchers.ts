import type { ProductDto } from '@/entities/product/dto';

export async function fetchProducts(): Promise<ProductDto[]> {
  try {
    const res = await fetch(
      'https://challenge-cdn.real.piccoma-ext.com/fe/api/products'
    );

    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);

    const data = await res.json();

    return data;
  } catch (error) {
    console.error('❌ Products fetch error:', error);
    throw error;
  }
}
