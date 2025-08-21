import { useJoinedRows } from '@/entities/joined/useJoinedRows';
import { useProducts } from '@/entities/product/repository';
import GenreFilter from '@/features/filter/GenreFilter';
import TimeFilter from '@/features/filter/TimeFilter';
import { useSyncFiltersWithUrl } from '@/shared/hooks/useSyncFiltersWithUrl';
import { useEffect } from 'react';

const DashboardPage = () => {
  useSyncFiltersWithUrl();

  const { data: products } = useProducts();
  const { data: joinedRows } = useJoinedRows(products);

  useEffect(() => {
    if (joinedRows) {
      console.log('Joined Rows:', joinedRows.slice(0, 3));
    }
  }, [joinedRows]);

  if (!products) return <div>Loading products...</div>;
  if (!joinedRows) return <div>Loading joined rows...</div>;

  return (
    <div>
      <div>
        <TimeFilter />
        <br />
        <GenreFilter />
        <h1>🧪 Test Page</h1>

        <h2>✅ Products</h2>
        <pre>{JSON.stringify(products?.slice(0, 3), null, 2)}</pre>
      </div>
    </div>
  );
};

export default DashboardPage;
