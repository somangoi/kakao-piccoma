import { Box, Container, Paper } from '@mui/material';
import { useJoinedRows } from '@/entities/joined/useJoinedRows';
import { useProducts } from '@/entities/product/repository';
import { useIndexedFilteredRows } from '@/entities/joined/selectors/useIndexedFilteredRows';
import { useSyncFiltersWithUrl } from '@/features/filter/lib/useSyncFiltersWithUrl';
import { GenreFilter } from '@/features/filter/ui/GenreFilter';
import { TimeFilter } from '@/features/filter/ui/TimeFilter';
import { FilteredSummary } from '@/features/dashboard/FilteredSummary';
import { DetailedStats } from '@/features/dashboard/DetailedStats';
import { SalesChart } from '@/features/dashboard/SalesChart';

const DashboardPage = () => {
  useSyncFiltersWithUrl();

  const { data: products } = useProducts();
  const { data: joinedRows } = useJoinedRows(products);
  const filteredRows = useIndexedFilteredRows(joinedRows ?? []);

  if (!products) return <div>Loading products...</div>;
  if (!joinedRows) return <div>Loading joined rows...</div>;

  return (
    <Container maxWidth="xl" sx={{ bgcolor: 'background' }}>
      <Box py={3}>
        {/* 필터 섹션 */}
        <Paper elevation={0} sx={{ mb: 3, bgcolor: 'transparent' }}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TimeFilter />
            <GenreFilter />
          </Box>
        </Paper>

        {/* 요약 대시보드 */}
        <FilteredSummary filteredRows={filteredRows} isLoading={!joinedRows} />

        {/* 상세 통계 및 차트 */}
        <Box
          display="flex"
          gap={3}
          sx={{ flexDirection: { lg: 'row' }, flexWrap: 'wrap' }}
        >
          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <DetailedStats filteredRows={filteredRows} />
          </Box>
          <Box sx={{ flex: 2, minWidth: '400px' }}>
            <SalesChart filteredRows={filteredRows} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;
