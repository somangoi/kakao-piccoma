import { useQuery } from '@tanstack/react-query';
import { adaptSalesDto } from './adapter';
import type { SalesDto } from './dto';
import type { Sales } from './model';

// 웹워커 중복 실행 방지를 위한 전역 상태
let isWorkerRunning = false;

export function useSalesWithWorker() {
  return useQuery<Sales[]>({
    queryKey: ['sales-worker'],
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분간 메모리 보관
    refetchOnWindowFocus: false, // 윈도우 포커스시 재요청 방지
    queryFn: async () => {
      return new Promise((resolve, reject) => {
        // 중복 실행 방지
        if (isWorkerRunning) {
          console.log('🚫 Worker already running, skipping...');
          return;
        }

        isWorkerRunning = true;
        console.log('🚀 Starting worker...');

        const worker = new Worker(
          new URL('../../shared/workers/ingest.worker.ts', import.meta.url),
          { type: 'module' }
        );

        worker.onmessage = (e) => {
          const { type, payload } = e.data;

          if (type === 'cube-final') {
            console.log('✅ Worker completed! Processing final data');
            const text = new TextDecoder().decode(payload);
            const salesData: SalesDto[] = JSON.parse(text);
            const adaptedSales: Sales[] = salesData.map(adaptSalesDto);
            resolve(adaptedSales);
            worker.terminate();
            isWorkerRunning = false;
          }

          if (type === 'error') {
            console.error('❌ Worker error:', payload);
            reject(new Error(payload));
            worker.terminate();
            isWorkerRunning = false;
          }
        };

        worker.onerror = (error) => {
          console.error('❌ Worker onerror:', error);
          reject(error);
          worker.terminate();
          isWorkerRunning = false;
        };

        // Sales API 스트림 처리 시작 (gzip 압축)
        fetch('https://challenge-cdn.real.piccoma-ext.com/fe/api/sales')
          .then((res) => {
            if (!res.ok)
              throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            if (!res.body) throw new Error('No response body');

            // 응답 헤더 정보 확인
            console.log('🔧 Response headers:');
            console.log('Content-Type:', res.headers.get('content-type'));
            console.log(
              'Content-Encoding:',
              res.headers.get('content-encoding')
            );
            console.log('Content-Length:', res.headers.get('content-length'));

            const reader = res.body.getReader();

            const pump = async (): Promise<void> => {
              while (true) {
                const { value, done } = await reader.read();
                if (done) {
                  worker.postMessage({ type: 'gzip-end' });
                  break;
                }
                worker.postMessage({ type: 'gzip-chunk', chunk: value }, [
                  value.buffer,
                ]);
              }
            };

            return pump();
          })
          .catch((error) => {
            console.error('❌ Fetch error:', error);
            isWorkerRunning = false;
            reject(error);
          });
      });
    },
  });
}
