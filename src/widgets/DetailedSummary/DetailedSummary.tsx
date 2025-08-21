import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import { useMemo } from 'react';
import type { JoinedRowWithDerived } from '@/entities/joined/model';
import { useTotals } from '@/shared/hooks/useTotals';
import { useGenreStats } from '@/shared/hooks/useGenreStats';

interface DetailedSummaryProps {
  filteredRows: JoinedRowWithDerived[];
}

export const DetailedSummary = ({ filteredRows }: DetailedSummaryProps) => {
  const totals = useTotals(filteredRows);
  const genreStats = useGenreStats(filteredRows);

  const topGenres = useMemo(() => {
    return Object.entries(genreStats)
      .sort(([, a], [, b]) => b.sales - a.sales)
      .slice(0, 5);
  }, [genreStats]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      sx={{ minHeight: '400px' }}
    >
      <Card elevation={0} sx={{ borderRadius: 2, flex: 1 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={'bold'} gutterBottom>
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

      <Card elevation={0} sx={{ borderRadius: 2, flex: 1 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={'bold'} gutterBottom>
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
    </Box>
  );
};
