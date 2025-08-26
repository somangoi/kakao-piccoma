/// <reference lib="webworker" />
import { joinSalesWithProducts } from './worker-utils';
import type { Product } from '@/entities/product/model';
import type { JoinedRow } from '@/entities/joined/model';
import { adaptSalesDto } from '@/entities/sales/adapter';

type InMsg =
  | { type: 'stream-chunk'; chunk: ArrayBuffer | Uint8Array }
  | { type: 'stream-end'; products: Product[] };

type OutMsg =
  | { type: 'joined-rows'; payload: JoinedRow[] }
  | { type: 'error'; payload: string };

let chunks: Uint8Array[] = [];

self.onmessage = async (e: MessageEvent<InMsg>) => {
  const msg = e.data;

  if (msg.type === 'stream-chunk') {
    const u8 =
      msg.chunk instanceof Uint8Array ? msg.chunk : new Uint8Array(msg.chunk);
    chunks.push(u8);
    return;
  }

  if (msg.type === 'stream-end') {
    try {
      // 1. 청크들을 문자열로 연결
      const fullText = chunks
        .map((chunk) => new TextDecoder().decode(chunk))
        .join('');

      // 2. JSON 파싱 및 DTO 변환
      const sales = JSON.parse(fullText);
      const paredSales = sales.map(adaptSalesDto);

      // 3. products와 조인
      const joinedRows = joinSalesWithProducts(paredSales, msg.products);

      // 4. 결과 전송
      const out: OutMsg = { type: 'joined-rows', payload: joinedRows };
      self.postMessage(out);
    } catch (err) {
      self.postMessage({ type: 'error', payload: serializeError(err) });
    } finally {
      chunks = [];
    }
  }
};

function serializeError(e: unknown): string {
  if (e instanceof Error) return `${e.name}: ${e.message}`;
  if (typeof e === 'string') return e;
  try {
    return JSON.stringify(e);
  } catch {
    return 'Unknown error';
  }
}
