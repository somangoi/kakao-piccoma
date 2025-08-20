import type { Product } from '@/entities/product/model';

export const extractGenresFromProducts = (products: Product[]): string[] => {
  const genres = new Set(products.map((product) => product.genre));
  return Array.from(genres).filter(Boolean).sort();
};
