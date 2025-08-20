import { useEffect, useState } from 'react';

import { extractGenresFromProducts } from '../lib/genre-utils';
import { useProducts } from '@/entities/product/repository';

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
        console.log('장르 목록:', genreList);
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
