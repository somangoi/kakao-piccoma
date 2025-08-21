import {
  Card,
  CardContent,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from '@mui/material';
import { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { JoinedRowWithDerived } from '@/entities/joined/model';
import { useGenreStats } from '@/shared/hooks/useGenreStats';

interface GenrePieChartProps {
  filteredRows: JoinedRowWithDerived[];
}

type ViewMode = 'count' | 'sales';

export const GenrePieChart = ({ filteredRows }: GenrePieChartProps) => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('count');
  const genreStats = useGenreStats(filteredRows);

  const chartData = useMemo(() => {
    const data = Object.entries(genreStats)
      .map(([genre, stats]) => ({
        name: genre,
        value: viewMode === 'count' ? stats.count : stats.sales,
      }))
      .sort((a, b) => b.value - a.value);

    return data;
  }, [genreStats, viewMode]);

  const option = useMemo(
    () => ({
      title: {
        text:
          viewMode === 'count'
            ? '🥸 장르별 작품수 비중'
            : '💰 장르별 매출 비중',
        left: 'left',
        top: 'top',
        textStyle: {
          fontSize: theme.typography.h6.fontSize,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const total = chartData.reduce((sum, item) => sum + item.value, 0);
          const percentage = ((params.value / total) * 100).toFixed(1);
          const unit = viewMode === 'count' ? '개' : '원';
          return `${params.name}<br/>${params.value.toLocaleString()}${unit} (${percentage}%)`;
        },
      },
      legend: {
        orient: 'vertical',
        right: 'right',
        top: 'center',
        textStyle: {
          fontSize: 12,
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
        },
      ],
      color: [
        '#FF6B35',
        '#F7931E',
        '#FFD23F',
        '#06FFA5',
        '#118AB2',
        '#073B4C',
        '#FFB3BA',
        '#FFDFBA',
        '#FFFFBA',
        '#BAFFC9',
        '#BAE1FF',
        '#C7CEEA',
      ],
    }),
    [chartData, viewMode, theme]
  );

  const handleViewModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode | null
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  return (
    <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent sx={{ height: '100%', p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
          >
            <ToggleButton value="count">작품수</ToggleButton>
            <ToggleButton value="sales">매출</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ height: 'calc(100% - 60px)' }}>
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
