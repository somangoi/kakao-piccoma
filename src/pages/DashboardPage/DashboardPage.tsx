import { useProducts } from '@/entities/product/repository';
import { useSalesMap } from '@/entities/sales/hooks/useSalesMap';
import { useSalesWithWorker } from '@/entities/sales/repository';
import { useEffect } from 'react';

const DashboardPage = () => {
  const { data: products } = useProducts();
  const { data: sales } = useSalesWithWorker();
  const { data: salesMap } = useSalesMap();

  useEffect(() => {
    console.log('🚀 Sales loaded:', sales?.length);
  }, [sales]);

  return (
    <div>
      <div>
        <h1>🧪 Test Page</h1>

        <h2>✅ Products</h2>
        <pre>{JSON.stringify(products?.slice(0, 3), null, 2)}</pre>

        <h2>✅ SalesMap</h2>
        {salesMap && (
          <pre>
            {JSON.stringify(
              Array.from(salesMap.entries()).slice(0, 1),
              null,
              2
            )}
          </pre>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
