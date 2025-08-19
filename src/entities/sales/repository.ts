import { useQuery } from '@tanstack/react-query';
import { fetchSales } from '@/shared/api/fetchers';
import { queryKeys } from '@/shared/api/query-keys';
import { adaptSalesDto } from './adapter';

export function useSales() {
  return useQuery({
    queryKey: queryKeys.sales.all,
    queryFn: async () => {
      const salesDtos = await fetchSales();
      return salesDtos.map(adaptSalesDto);
    },
  });
}
