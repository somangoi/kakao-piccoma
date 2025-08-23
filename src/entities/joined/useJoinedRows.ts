import { useEffect, useState } from 'react';
import type { JoinedRow } from './model';

import Worker from '@/shared/workers/ingest.worker?worker';
import type { Product } from '../product/model';

export function useJoinedRows(products: Product[] | undefined) {
  const [data, setData] = useState<JoinedRow[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!products) {
      return;
    }

    if (products.length === 0) {
      setData([]);
      setIsLoading(false);
      return;
    }

    const worker = new Worker();

    const fetchSalesAndPost = async () => {
      try {
        const res = await fetch(
          'https://challenge-cdn.real.piccoma-ext.com/fe/api/sales'
        );
        const reader = res.body?.getReader();
        if (!reader) throw new Error('Reader not available');

        // chunk 전송
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) worker.postMessage({ type: 'gzip-chunk', chunk: value });
        }

        // 처리 완료 신호 (products와 함께 전달)
        worker.postMessage({ type: 'gzip-end', products });
      } catch (err) {
        setError((err as Error).message);
        setIsLoading(false);
      }
    };

    worker.onmessage = (e: MessageEvent) => {
      if (e.data.type === 'joined-rows') {
        setData(e.data.payload);
        setIsLoading(false);
      } else if (e.data.type === 'error') {
        setError(e.data.payload);
        setIsLoading(false);
      }
    };

    fetchSalesAndPost();

    return () => {
      worker.terminate();
    };
  }, [products]);

  return { data, isLoading, error };
}
