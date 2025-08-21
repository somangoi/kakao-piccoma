import { useEffect } from 'react';
import { useJoinedRows } from '@/entities/joined/useJoinedRows';
import { useProducts } from '@/entities/product/repository';
import { useSyncFiltersWithUrl } from '@/features/filter/lib/useSyncFiltersWithUrl';
import { GenreFilter } from '@/features/filter/ui/GenreFilter';
import { TimeFilter } from '@/features/filter/ui/TimeFilter';

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
