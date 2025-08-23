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
      component="main"
      maxWidth="xl"
      sx={{ bgcolor: 'background', py: 3, minHeight: '100vh' }}
    >
      <Box component="section" py={2}>
        {children}
      </Box>
    </Container>
  );

  // 필터 섹션 컴포넌트
  const FilterSection = () => (
    <Paper
      component="section"
      elevation={0}
      sx={{ mb: 3, bgcolor: 'transparent' }}
      aria-label="데이터 필터링"
    >
      <Box
        component="div"
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={3}
        alignItems={{ xs: 'stretch', md: 'center' }}
        aria-label="필터 컨트롤"
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
      <Box component="section" aria-label="데이터 요약">
        <TotalSummary filteredRows={filteredRows} isLoading={isLoading} />
      </Box>

      {/* 상세 통계 및 차트 */}
      <Box
        component="section"
        display="flex"
        gap={3}
        sx={{ flexDirection: { lg: 'row' }, flexWrap: 'wrap', mb: 3 }}
        aria-label="상세 통계 및 트렌드 차트"
      >
        <Box
          component="aside"
          sx={{ flex: 1, minWidth: '300px' }}
          aria-label="상세 통계"
        >
          <DetailedSummary filteredRows={filteredRows} isLoading={isLoading} />
        </Box>
        <Box
          component="section"
          sx={{ flex: 2, minWidth: '300px' }}
          aria-label="라인 차트"
        >
          <LineChartSection filteredRows={filteredRows} isLoading={isLoading} />
        </Box>
      </Box>

      {/* 파이 차트 및 스택 바 차트 */}
      <Box
        component="section"
        display="flex"
        gap={3}
        sx={{ flexDirection: { lg: 'row' }, flexWrap: 'wrap' }}
        aria-label="분포 차트"
      >
        <Box
          component="section"
          sx={{ flex: 1, minWidth: '300px' }}
          aria-label="파이 차트"
        >
          <PieChartSection filteredRows={filteredRows} isLoading={isLoading} />
        </Box>
        <Box
          component="section"
          sx={{ flex: 1, minWidth: '300px' }}
          aria-label="스택 바 차트"
        >
          <StackedBarChartSection
            filteredRows={filteredRows}
            isLoading={isLoading}
          />
        </Box>
      </Box>

      {/* 작품 테이블 */}
      <Box
        component="section"
        sx={{ mt: 3 }}
        aria-label="작품 상세 정보 테이블"
      >
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
          <ProductTable filteredRows={filteredRows} isLoading={isLoading} />
        </Paper>
      </Box>
    </PageLayout>
  );
};

export default DashboardPage;
