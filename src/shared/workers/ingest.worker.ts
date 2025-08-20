import type { SalesDto } from '@/entities/sales/dto';

interface Cube {
  sales: SalesDto[];
}

function initCube(): Cube {
  return { sales: [] };
}

function parseIncremental(
  salesData: SalesDto[],
  callback: (row: SalesDto) => void
): void {
  // 큰 데이터를 청크 단위로 처리
  const chunkSize = 1000;
  for (let i = 0; i < salesData.length; i += chunkSize) {
    const chunk = salesData.slice(i, i + chunkSize);
    chunk.forEach(callback);

    // 비동기적으로 처리하여 메인 스레드 블로킹 방지
    if (i % (chunkSize * 5) === 0) {
      setTimeout(() => {}, 0);
    }
  }
}

function accumulate(cube: Cube, row: SalesDto): void {
  cube.sales.push(row);
}

function maybePostPartial(cube: Cube): void {
  // 1000건마다 실제 데이터를 점진적으로 전송
  if (cube.sales.length % 1000 === 0) {
    const batchStart = Math.max(0, cube.sales.length - 1000);
    const batch = cube.sales.slice(batchStart);

    self.postMessage({
      type: 'cube-partial',
      payload: {
        batch,
        totalProcessed: cube.sales.length,
        isComplete: false,
      },
    });
  }
}

let chunks: Uint8Array[] = [];
self.onmessage = async (e) => {
  const { type, chunk } = e.data;

  if (type === 'gzip-chunk') {
    chunks.push(new Uint8Array(chunk));
  }

  if (type === 'gzip-end') {
    try {
      console.log('🔧 Processing gzip-end, chunks count:', chunks.length);

      // 모든 청크를 합쳐서 하나의 압축된 데이터로 만들기
      const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      console.log('🔧 Total compressed size:', totalLength, 'bytes');

      const combined = new Uint8Array(totalLength);
      let offset = 0;

      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }

      // 브라우저에서 이미 gzip 압축 해제된 데이터를 UTF-8로 디코딩
      const decompressed = new TextDecoder('utf-8').decode(combined);

      const salesData = JSON.parse(decompressed) as SalesDto[];

      const cube = initCube();
      parseIncremental(salesData, (row) => {
        accumulate(cube, row);
        maybePostPartial(cube);
      });

      // 마지막 배치 전송
      const finalBatch = cube.sales.slice(
        Math.floor(cube.sales.length / 1000) * 1000
      );
      if (finalBatch.length > 0) {
        self.postMessage({
          type: 'cube-partial',
          payload: {
            batch: finalBatch,
            totalProcessed: cube.sales.length,
            isComplete: false,
          },
        });
      }

      // 완료 신호
      self.postMessage({
        type: 'cube-final',
        payload: {
          totalProcessed: cube.sales.length,
          isComplete: true,
        },
      });
    } catch (error) {
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = JSON.stringify(error);
      }

      self.postMessage({
        type: 'error',
        payload: `Failed to process data: ${errorMessage}`,
      });
    } finally {
      chunks = []; // 메모리 정리
    }
  }
};
