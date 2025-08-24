import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/query-keys';

interface UseDataRefreshOptions {
  checkInterval?: number;
}

export function useDataRefresh({
  checkInterval = 5 * 60 * 1000,
}: UseDataRefreshOptions = {}) {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [hasNewData, setHasNewData] = useState(false);
  const [etag, setEtag] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const abortRef = useRef<AbortController | null>(null);

  const checkForUpdates = async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch(
        'https://challenge-cdn.real.piccoma-ext.com/fe/api/sales',
        {
          method: 'GET',
          headers: {
            ...(etag ? { 'If-None-Match': etag } : {}),
            'Cache-Control': 'no-cache',
          },
          signal: ac.signal,
        }
      );

      if (res.status === 304) return true;
      if (!res.ok) return false;

      const newEtag = res.headers.get('etag');
      if (newEtag && newEtag !== etag) {
        setEtag(newEtag);
        return true;
      }

      // ETag 없는 경우 Last-Modified 체크
      const lm = res.headers.get('last-modified');
      if (lm) {
        return new Date(lm).getTime() > lastUpdate;
      }

      // Last-Modified 없는 경우 시간 간격으로 체크
      return Date.now() - lastUpdate > 10 * 60 * 1000;
    } catch (e: any) {
      if (e?.name === 'AbortError') return false;
      return false;
    }
  };

  const { data: hasUpdates } = useQuery({
    queryKey: queryKeys.sales.updateCheck,
    queryFn: checkForUpdates,
    refetchInterval: checkInterval,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (hasUpdates && !hasNewData) setHasNewData(true);
  }, [hasUpdates, hasNewData]);

  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: (q) =>
        q.queryKey[0] === 'sales' || q.queryKey[0] === 'products',
    });
    setHasNewData(false);
    setLastUpdate(Date.now());
  }, [queryClient]);

  const formatTime = useCallback((ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  return { hasNewData, refreshData, lastUpdate, formatTime };
}