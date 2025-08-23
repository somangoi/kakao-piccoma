import { Box, Container, Paper } from '@mui/material';
import { EmptyState } from '@/shared/ui/EmptyState';
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
  const {
    data: joinedRows,
    isLoading: isJoinedRowsLoading,
    error,
  } = useJoinedRows(products);
  const filteredRows = useIndexedFilteredRows(joinedRows ?? []);

  const isLoading = isJoinedRowsLoading;

  // 공통 레이아웃 컴포넌트
  const PageLayout = ({ children }: { children: React.ReactNode }) => (
    <Container
      maxWidth="xl"
      sx={{ bgcolor: 'background', py: 3, minHeight: '100vh' }}
    >
      <Box py={2}>{children}</Box>
    </Container>
  );

  // 필터 섹션 컴포넌트
  const FilterSection = () => (
    <Paper elevation={0} sx={{ mb: 3, bgcolor: 'transparent' }}>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={3}
        alignItems={{ xs: 'stretch', md: 'center' }}
      >
        <TimeFilter />
        <GenreFilter />
      </Box>
    </Paper>
  );

  // 에러 상태
  if (error) {
    return (
      <PageLayout>
        <EmptyState
          title="데이터를 불러올 수 없습니다"
          message={`서버에서 데이터를 가져오는 중 오류가 발생했습니다: ${error}`}
          minHeight="50vh"
        />
      </PageLayout>
    );
  }

  // 빈 데이터 상태
  if (!isLoading && (!filteredRows || filteredRows.length === 0)) {
    return (
      <PageLayout>
        <FilterSection />
        <EmptyState
          title="데이터가 없습니다"
          message="현재 선택된 조건에 맞는 데이터가 존재하지 않습니다."
          minHeight="50vh"
        />
      </PageLayout>
    );
  }

  // 정상 상태
  return (
    <PageLayout>
      <FilterSection />

      {/* 요약 대시보드 */}
      <TotalSummary filteredRows={filteredRows} isLoading={isLoading} />

      {/* 상세 통계 및 차트 */}
      <Box
        display="flex"
        gap={3}
        sx={{ flexDirection: { lg: 'row' }, flexWrap: 'wrap', mb: 3 }}
      >
        <Box sx={{ flex: 1, minWidth: '300px' }}>
          <DetailedSummary filteredRows={filteredRows} isLoading={isLoading} />
        </Box>
        <Box sx={{ flex: 2, minWidth: '300px' }}>
          <LineChartSection filteredRows={filteredRows} isLoading={isLoading} />
        </Box>
      </Box>

      {/* 파이 차트 및 스택 바 차트 */}
      <Box
        display="flex"
        gap={3}
        sx={{ flexDirection: { lg: 'row' }, flexWrap: 'wrap' }}
      >
        <Box sx={{ flex: 1, minWidth: '300px' }}>
          <PieChartSection filteredRows={filteredRows} isLoading={isLoading} />
        </Box>
        <Box sx={{ flex: 1, minWidth: '300px' }}>
          <StackedBarChartSection
            filteredRows={filteredRows}
            isLoading={isLoading}
          />
        </Box>
      </Box>

      {/* 작품 테이블 */}
      <Box sx={{ mt: 3 }}>
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
          <ProductTable filteredRows={filteredRows} isLoading={isLoading} />
        </Paper>
      </Box>
    </PageLayout>
  );
};

export default DashboardPage;
