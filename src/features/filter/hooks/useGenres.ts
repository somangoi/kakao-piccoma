import { useEffect, useState } from 'react';
import { useProducts } from '@/entities/product/repository';
import type { Product } from '@/entities/product/model';

const extractGenresFromProducts = (products: Product[]): string[] => {
  const genres = new Set(products.map((product) => product.genre));
  return Array.from(genres).filter(Boolean).sort();
};

export const useGenres = () => {
  const { data: products } = useProducts();
  const [genres, setGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        if (!products) {
          throw new Error('제품 데이터가 없습니다.');
        }
        const genreList = extractGenresFromProducts(products);
        setGenres(genreList);
      } catch (error) {
        console.error('장르 데이터 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGenres();
  }, [products]);

  return { genres, isLoading };
};
