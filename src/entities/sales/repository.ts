import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/query-keys';
import Worker from '@/shared/workers/ingest.worker?worker';
import type { Product } from '../product/model';
import type { JoinedRow } from '../joined/model';

export function useJoinedSales(products?: Product[]) {
  const productIds = products?.map((p) => p.id) ?? [];

  return useQuery({
    queryKey: queryKeys.sales.joined(productIds),
    queryFn: async (): Promise<JoinedRow[]> => {
      return new Promise((resolve, reject) => {
        const worker = new Worker();
        let resolvedOrRejected = false;

        const fetchSalesAndProcess = async () => {
          try {
            const res = await fetch(
              'https://challenge-cdn.real.piccoma-ext.com/fe/api/sales',
              { headers: { 'Accept-Encoding': 'identity' } }
            );

            if (!res.ok) {
              throw new Error(`Failed to fetch sales: ${res.status}`);
            }

            const reader = res.body?.getReader();
            if (!reader) throw new Error('Reader not available');

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) {
                worker.postMessage({ type: 'gzip-chunk', chunk: value }, [
                  value.buffer,
                ]);
              }
            }
            worker.postMessage({ type: 'gzip-end', products: products || [] });
          } catch (err) {
            reject(err);
          }
        };

        worker.onmessage = (e: MessageEvent) => {
          if (resolvedOrRejected) return;
          if (e.data.type === 'joined-rows') {
            resolvedOrRejected = true;
            resolve(e.data.payload);
            worker.terminate();
          } else if (e.data.type === 'error') {
            resolvedOrRejected = true;
            reject(new Error(e.data.payload));
            worker.terminate();
          }
        };

        worker.onerror = (error) => {
          if (!resolvedOrRejected) {
            resolvedOrRejected = true;
            reject(error);
            worker.terminate();
          }
        };

        fetchSalesAndProcess();
      });
    },
    enabled: !!products && products.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}
