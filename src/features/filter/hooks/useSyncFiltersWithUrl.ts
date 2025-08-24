import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilterStore } from '../model/useFilterStore';

export const useSyncFiltersWithUrl = () => {
  const [params, setParams] = useSearchParams();
  const { startDate, endDate, genres, setFilter } = useFilterStore();

  useEffect(() => {
    // 1. 필터가 클라이언트 단에서 적용되면 url 에 반영
    const filterParams = new URLSearchParams();

    if (startDate) filterParams.set('startDate', startDate.toISOString());
    if (endDate) filterParams.set('endDate', endDate.toISOString());
    if (genres.length > 0) filterParams.set('genres', genres.join(','));

    setParams(filterParams);
  }, [genres, startDate, endDate]);

  useEffect(() => {
    // 2. url에 필터가 있으면 클라이언트 단에 적용(새로고침 등 대응)
    const startDateParam = params.get('startDate');
    const endDateParam = params.get('endDate');
    const genresParam = params.get('genres');

    const genresArray = genresParam ? genresParam.split(',') : [];

    setFilter({
      startDate: startDateParam ? new Date(startDateParam) : undefined,
      endDate: endDateParam ? new Date(endDateParam) : undefined,
      genres: genresArray,
    });
  }, [params, setFilter]);
};
