/// <reference lib="webworker" />
export {};

type InMsg =
  | { type: 'gzip-chunk'; chunk: ArrayBuffer | Uint8Array }
  | { type: 'gzip-end' };

let chunks: Uint8Array[] = [];

self.onmessage = async (e: MessageEvent<InMsg>) => {
  const msg = e.data;

  if (msg.type === 'gzip-chunk') {
    // 수신 타입을 Uint8Array로 정규화
    const u8 =
      msg.chunk instanceof Uint8Array ? msg.chunk : new Uint8Array(msg.chunk);
    chunks.push(u8);
    return;
  }

  if (msg.type === 'gzip-end') {
    try {
      // 모든 청크를 연결하여 하나의 ArrayBuffer 생성
      const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }
      const arrayBuffer = combined.buffer;
      self.postMessage({ type: 'cube-final', payload: arrayBuffer }, [
        arrayBuffer,
      ]);
    } catch (err) {
      self.postMessage({ type: 'error', payload: serializeError(err) });
    } finally {
      chunks.length = 0; // 메모리 정리
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
