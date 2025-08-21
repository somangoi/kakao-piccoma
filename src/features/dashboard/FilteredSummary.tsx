import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import {
  TrendingUp,
  People,
  ShoppingCart,
  Category,
} from '@mui/icons-material';
import type { JoinedRowWithDerived } from '@/entities/joined/model';
import { useTotals } from '@/shared/hooks/useTotals';

interface FilteredSummaryProps {
  filteredRows: JoinedRowWithDerived[];
  isLoading?: boolean;
}

export const FilteredSummary = ({
  filteredRows,
  isLoading,
}: FilteredSummaryProps) => {
  const totals = useTotals(filteredRows);

  if (isLoading || filteredRows.length === 0) {
    return (
      <Grid
        container
        spacing={2.5}
        sx={{ mb: 4, width: '100%', display: 'flex', flexWrap: 'wrap' }}
      >
        <Card elevation={0} sx={{ p: 3, borderRadius: 2, width: '100%' }}>
          <Typography>데이터 로딩 중...</Typography>
        </Card>
      </Grid>
    );
  }

  return (
    <Grid
      container
      spacing={2.5}
      sx={{ mb: 4, width: '100%', display: 'flex', flexWrap: 'wrap' }}
    >
      <Grid sx={{ flex: 1, minWidth: '200px' }}>
        <Card
          elevation={0}
          sx={{ borderRadius: 2, height: '120px', width: '100%' }}
        >
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              height: '100%',
              p: 2,
            }}
          >
            <Box sx={{ flexShrink: 0 }}>
              <TrendingUp color="primary" sx={{ fontSize: 32 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight="bold" noWrap>
                {totals.totalSales.toLocaleString()}원
              </Typography>
              <Typography variant="body2" color="text.secondary">
                총 매출
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid sx={{ flex: 1, minWidth: '200px' }}>
        <Card
          elevation={0}
          sx={{ borderRadius: 2, height: '120px', width: '100%' }}
        >
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              height: '100%',
              p: 2,
            }}
          >
            <Box sx={{ flexShrink: 0 }}>
              <People color="primary" sx={{ fontSize: 32 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight="bold" noWrap>
                {totals.totalReadUser.toLocaleString()}명
              </Typography>
              <Typography variant="body2" color="text.secondary">
                총 조회자수
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid sx={{ flex: 1, minWidth: '200px' }}>
        <Card
          elevation={0}
          sx={{ borderRadius: 2, height: '120px', width: '100%' }}
        >
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              height: '100%',
              p: 2,
            }}
          >
            <Box sx={{ flexShrink: 0 }}>
              <ShoppingCart color="primary" sx={{ fontSize: 32 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight="bold" noWrap>
                {totals.totalPaidUser.toLocaleString()}명
              </Typography>
              <Typography variant="body2" color="text.secondary">
                총 구매자수
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid sx={{ flex: 1, minWidth: '200px' }}>
        <Card
          elevation={0}
          sx={{ borderRadius: 2, height: '120px', width: '100%' }}
        >
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              height: '100%',
              p: 2,
            }}
          >
            <Box sx={{ flexShrink: 0 }}>
              <Category color="primary" sx={{ fontSize: 32 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight="bold" noWrap>
                {totals.totalProducts.toLocaleString()}개
              </Typography>
              <Typography variant="body2" color="text.secondary">
                필터된 작품수
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
