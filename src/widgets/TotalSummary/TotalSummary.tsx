import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp,
  People,
  ShoppingCart,
  Category,
} from '@mui/icons-material';
import type { JoinedRowWithDerived } from '@/entities/joined/model';
import { useTotals } from '@/shared/hooks/useTotals';
import type { ReactNode } from 'react';

interface SummaryCardProps {
  icon?: ReactNode;
  value?: string;
  label?: string;
  isLoading?: boolean;
}

const SummaryCard = ({ icon, value, label, isLoading }: SummaryCardProps) => (
  <Grid sx={{ flex: 1, minWidth: '200px' }}>
    <Card
      component="article"
      elevation={0}
      sx={{ borderRadius: 2, height: '120px', width: '100%' }}
      aria-label={`${label} 통계`}
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
        <Box sx={{ flexShrink: 0 }} aria-hidden="true">
          {isLoading ? (
            <Skeleton variant="circular" width={32} height={32} />
          ) : (
            icon
          )}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" fontWeight="bold" noWrap>
            {isLoading ? <Skeleton width={80} /> : value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isLoading ? <Skeleton width={60} /> : label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  </Grid>
);

interface TotalSummaryProps {
  filteredRows: JoinedRowWithDerived[];
  isLoading?: boolean;
}

export const TotalSummary = ({
  filteredRows,
  isLoading,
}: TotalSummaryProps) => {
  const totals = useTotals(filteredRows);

  if (isLoading) {
    return (
      <Grid
        component="section"
        container
        spacing={2.5}
        sx={{ mb: 4, width: '100%', display: 'flex', flexWrap: 'wrap' }}
        aria-label="통계 요약 로딩 중"
      >
        <SummaryCard isLoading />
        <SummaryCard isLoading />
        <SummaryCard isLoading />
        <SummaryCard isLoading />
      </Grid>
    );
  }

  return (
    <Grid
      component="section"
      container
      spacing={2.5}
      sx={{ mb: 4, width: '100%', display: 'flex', flexWrap: 'wrap' }}
      aria-label="통계 요약"
    >
      <SummaryCard
        icon={<TrendingUp color="primary" sx={{ fontSize: 32 }} />}
        value={`${totals.totalSales.toLocaleString()}원`}
        label="총 매출"
      />
      <SummaryCard
        icon={<People color="primary" sx={{ fontSize: 32 }} />}
        value={`${totals.totalReadUser.toLocaleString()}명`}
        label="총 조회자수"
      />
      <SummaryCard
        icon={<ShoppingCart color="primary" sx={{ fontSize: 32 }} />}
        value={`${totals.totalPaidUser.toLocaleString()}명`}
        label="총 구매자수"
      />
      <SummaryCard
        icon={<Category color="primary" sx={{ fontSize: 32 }} />}
        value={`${totals.totalProducts.toLocaleString()}개`}
        label="필터된 작품수"
      />
    </Grid>
  );
};
