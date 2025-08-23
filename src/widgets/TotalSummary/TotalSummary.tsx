import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
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
  icon: ReactNode;
  value: string;
  label: string;
}

const SummaryCard = ({ icon, value, label }: SummaryCardProps) => (
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
        <Box sx={{ flexShrink: 0 }}>{icon}</Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" fontWeight="bold" noWrap>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
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
