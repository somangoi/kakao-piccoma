import { Box, Container, Paper } from '@mui/material';
import { useJoinedRows } from '@/entities/joined/useJoinedRows';
import { useProducts } from '@/entities/product/repository';
import { useIndexedFilteredRows } from '@/entities/joined/selectors/useIndexedFilteredRows';
import { useSyncFiltersWithUrl } from '@/features/filter/lib/useSyncFiltersWithUrl';
import { GenreFilter } from '@/features/filter/ui/GenreFilter';
import { TimeFilter } from '@/features/filter/ui/TimeFilter';
import { TotalSummary } from '@/widgets/TotalSummary/TotalSummary';
import { DetailedSummary } from '@/widgets/DetailedSummary/DetailedSummary';
import { LineChartSection } from '@/widgets/LineChartSection/LineChartSection';
import { PieChartSection } from '@/widgets/PieChartSection/PieChartSection';
import { StackedBarChartSection } from '@/widgets/StackedBarChartSection/StackedBarChartSection';
import { ProductTable } from '@/widgets/ProductTable/ProductTable';

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
        <TotalSummary filteredRows={filteredRows} isLoading={!joinedRows} />

        {/* 상세 통계 및 차트 */}
        <Box
          display="flex"
          gap={3}
          sx={{ flexDirection: { lg: 'row' }, flexWrap: 'wrap', mb: 3 }}
        >
          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <DetailedSummary filteredRows={filteredRows} />
          </Box>
          <Box sx={{ flex: 2, minWidth: '300px' }}>
            <LineChartSection filteredRows={filteredRows} />
          </Box>
        </Box>

        {/* 파이 차트 및 스택 바 차트 */}
        <Box
          display="flex"
          gap={3}
          sx={{ flexDirection: { lg: 'row' }, flexWrap: 'wrap' }}
        >
          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <PieChartSection filteredRows={filteredRows} />
          </Box>
          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <StackedBarChartSection filteredRows={filteredRows} />
          </Box>
        </Box>

        {/* 작품 테이블 */}
        <Box sx={{ mt: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
            {/* 작품 목록 컴포넌트 추가 */}
            <ProductTable filteredRows={filteredRows} />
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;
