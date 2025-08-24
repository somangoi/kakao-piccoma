import { useProducts } from '../product/repository';
import { useJoinedSales } from '../sales/repository';

export function useJoinedRows() {
  const {
    data: products,
    isLoading: isProductsLoading,
    error: productsError,
  } = useProducts();

  const {
    data: joinedRows,
    isLoading: isSalesLoading,
    error: salesError,
  } = useJoinedSales(products);

  const isLoading = isProductsLoading || isSalesLoading;
  const error = productsError?.message || salesError?.message || null;

  return {
    data: joinedRows,
    isLoading,
    error,
  };
}
