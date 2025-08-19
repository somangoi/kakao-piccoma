import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/shared/api/fetchers';
import { queryKeys } from '@/shared/api/query-keys';
import { adaptProductDto } from './adapter';

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: async () => {
      const productDtos = await fetchProducts();
      return productDtos.map(adaptProductDto);
    },
  });
}
