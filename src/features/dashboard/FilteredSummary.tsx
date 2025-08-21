import { Box, Card, CardContent, Typography, Grid, Chip } from '@mui/material';
import {
  TrendingUp,
  People,
  ShoppingCart,
  Category,
} from '@mui/icons-material';
import type { JoinedRowWithDerived } from '@/entities/joined/model';
import { useMemo } from 'react';

interface FilteredSummaryProps {
  filteredRows: JoinedRowWithDerived[];
  isLoading?: boolean;
}

export const FilteredSummary = ({
  filteredRows,
  isLoading,
}: FilteredSummaryProps) => {
  // 전체 합계 계산
  const totals = useMemo(() => {
    return filteredRows.reduce(
      (acc, row) => ({
        totalSales: acc.totalSales + row.derivedTotals.totalSales,
        totalReadUser: acc.totalReadUser + row.derivedTotals.totalReadUser,
        totalPaidUser: acc.totalPaidUser + row.derivedTotals.totalPaidUser,
        totalProducts: acc.totalProducts + 1,
        totalSalesRecords: acc.totalSalesRecords + row.filteredSeries.length,
      }),
      {
        totalSales: 0,
        totalReadUser: 0,
        totalPaidUser: 0,
        totalProducts: 0,
        totalSalesRecords: 0,
      }
    );
  }, [filteredRows]);

  // 장르별 통계
  const genreStats = filteredRows.reduce(
    (acc, row) => {
      const genre = row.genre;
      if (!acc[genre]) {
        acc[genre] = { count: 0, sales: 0 };
      }
      acc[genre].count += 1;
      acc[genre].sales += row.derivedTotals.totalSales;
      return acc;
    },
    {} as Record<string, { count: number; sales: number }>
  );

  const topGenres = Object.entries(genreStats)
    .sort(([, a], [, b]) => b.sales - a.sales)
    .slice(0, 5);

  if (isLoading) {
    return (
      <Box p={3}>
        <Typography>데이터 로딩 중...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        📊 필터링된 데이터 요약
      </Typography>

      {/* 메인 지표 카드들 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <TrendingUp color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {totals.totalSales.toLocaleString()}원
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  총 매출
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <People color="success" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {totals.totalReadUser.toLocaleString()}명
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  총 조회자수
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <ShoppingCart color="warning" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {totals.totalPaidUser.toLocaleString()}명
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  총 구매자수
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Category color="info" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {totals.totalProducts.toLocaleString()}개
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  필터된 작품수
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* 부가 정보 */}
      <Grid container spacing={3}>
        <Card elevation={1}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📈 상위 장르별 매출
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {topGenres.map(([genre, stats]) => (
                <Box
                  key={genre}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Chip label={genre} size="small" />
                  <Box textAlign="right">
                    <Typography variant="body2" fontWeight="bold">
                      {stats.sales.toLocaleString()}원
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stats.count}개 작품
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card elevation={1}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📊 데이터 상세
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">매출 기록 수:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {totals.totalSalesRecords.toLocaleString()}건
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">작품당 평균 매출:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {totals.totalProducts > 0
                    ? Math.round(
                        totals.totalSales / totals.totalProducts
                      ).toLocaleString()
                    : 0}
                  원
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">구매 전환율:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {totals.totalReadUser > 0
                    ? (
                        (totals.totalPaidUser / totals.totalReadUser) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};
