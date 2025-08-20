import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilterStore } from '../store/filter';

export const useSyncFiltersWithUrl = () => {
  const [params, setParams] = useSearchParams();
  const { startDate, endDate, genres, setFilter } = useFilterStore();

  useEffect(() => {
    // 1. 필터가 클라이언트 단에서 적용되면 url 에 반영
    const filterParams = new URLSearchParams();
    if (startDate) {
      filterParams.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      filterParams.set('endDate', endDate.toISOString());
    }
    if (genres.length > 0) {
      filterParams.set('genres', genres.join(','));
    }
    setParams(filterParams);
  }, [genres, startDate, endDate]);

  useEffect(() => {
    // 2. url 에 필터가 있으면 클라이언트 단에 적용(새로고침했을 때)
    const startDate = params.get('startDate');
    const endDate = params.get('endDate');
    const genresParam = params.get('genres');
    const genresArray = genresParam ? genresParam.split(',') : [];

    if (startDate || endDate || genresArray.length > 0) {
      setFilter({
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        genres: genresArray,
      });
    }
  }, [params, setFilter]);
};
