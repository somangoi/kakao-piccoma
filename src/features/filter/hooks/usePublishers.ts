import type { Product } from '@/entities/product/model';
import { useProducts } from '@/entities/product/repository';
import { useEffect, useState } from 'react';

const extractPublishersFromProducts = (products: Product[]) => {
  const publishers = new Set(products.map((product) => product.publisher));
  return Array.from(publishers).filter(Boolean).sort();
};

export const usePublishers = () => {
  const { data: products } = useProducts();
  const [publishers, setPublishers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPublishers = async () => {
      try {
        if (!products) {
          throw new Error('제품 데이터가 없습니다.');
        }
        const publisherList = extractPublishersFromProducts(products);
        setPublishers(publisherList);
      } catch (error) {
        console.error('장르 데이터 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPublishers();
  }, [products]);

  return { publishers, isLoading };
};
