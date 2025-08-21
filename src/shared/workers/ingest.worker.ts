/// <reference lib="webworker" />
import { parseSalesJson, joinSalesWithProducts } from './worker-utils';
import type { Product } from '@/entities/product/model';
import type { JoinedRow } from '@/entities/joined/model';

type InMsg =
  | { type: 'gzip-chunk'; chunk: ArrayBuffer | Uint8Array }
  | { type: 'gzip-end'; products: Product[] };

type OutMsg =
  | { type: 'joined-rows'; payload: JoinedRow[] }
  | { type: 'error'; payload: string };

let chunks: Uint8Array[] = [];

self.onmessage = async (e: MessageEvent<InMsg>) => {
  const msg = e.data;

  if (msg.type === 'gzip-chunk') {
    const u8 =
      msg.chunk instanceof Uint8Array ? msg.chunk : new Uint8Array(msg.chunk);
    chunks.push(u8);
    return;
  }

  if (msg.type === 'gzip-end') {
    try {
      // 1. 전체 청크 합치기
      const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }

      // 2. 압축 해제 및 JSON 파싱
      const buffer = combined.buffer;
      const sales = parseSalesJson(buffer);

      // 3. products와 조인
      const joinedRows = joinSalesWithProducts(sales, msg.products);

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
