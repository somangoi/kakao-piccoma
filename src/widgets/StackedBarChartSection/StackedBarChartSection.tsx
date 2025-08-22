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

interface StackedBarChartSectionProps {
  filteredRows: JoinedRowWithDerived[];
}

type ViewMode = 'product' | 'genre' | 'publisher';

export const StackedBarChartSection = ({
  filteredRows,
}: StackedBarChartSectionProps) => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('genre');

  const chartData = useMemo(() => {
    let groupedData: Record<string, { webSales: number; appSales: number }> =
      {};

    if (viewMode === 'product') {
      filteredRows.forEach((row) => {
        const key = `${row.title} (ID: ${row.id})`; // 제목과 ID를 조합하여 고유하게 식별
        if (!groupedData[key]) {
          groupedData[key] = { webSales: 0, appSales: 0 };
        }
        row.filteredSeries.forEach((sale) => {
          groupedData[key].webSales += sale.webSales;
          groupedData[key].appSales += sale.appSales;
        });
      });
    } else if (viewMode === 'genre') {
      filteredRows.forEach((row) => {
        const key = row.genre;
        if (!groupedData[key]) {
          groupedData[key] = { webSales: 0, appSales: 0 };
        }
        row.filteredSeries.forEach((sale) => {
          groupedData[key].webSales += sale.webSales;
          groupedData[key].appSales += sale.appSales;
        });
      });
    } else if (viewMode === 'publisher') {
      filteredRows.forEach((row) => {
        const key = row.publisher ?? '기타';
        if (!groupedData[key]) {
          groupedData[key] = { webSales: 0, appSales: 0 };
        }
        row.filteredSeries.forEach((sale) => {
          groupedData[key].webSales += sale.webSales;
          groupedData[key].appSales += sale.appSales;
        });
      });
    }

    // 상위 10개 까지만 정렬
    const sortedEntries = Object.entries(groupedData)
      .map(([name, data]) => ({
        name,
        webSales: data.webSales,
        appSales: data.appSales,
        total: data.webSales + data.appSales,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    return {
      categories: sortedEntries.map((item) =>
        viewMode === 'product' && item.name.length > 8
          ? item.name.substring(0, 8) + '...'
          : item.name
      ),
      webSales: sortedEntries.map((item) => item.webSales),
      appSales: sortedEntries.map((item) => item.appSales),
      fullNames: sortedEntries.map((item) => item.name), // 툴팁용 전체 이름
    };
  }, [filteredRows, viewMode]);

  const getTitle = () => {
    switch (viewMode) {
      case 'product':
        return '매출 상위 10개 작품';
      case 'genre':
        return '매출 상위 10개 장르';
      case 'publisher':
        return '매출 상위 10개 출판사';
      default:
        return '매출 비교';
    }
  };

  const option = useMemo(
    () => ({
      title: {
        text: getTitle(),
        left: 'left',
        top: 'top',
        subtext: '총합 매출(웹+앱) 기준',
        subtextStyle: {
          color: '#666',
          fontSize: 12,
        },
        textStyle: {
          fontSize: theme.typography.h6.fontSize,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const index = params[0].dataIndex;
          const name = chartData.fullNames
            ? chartData.fullNames[index]
            : params[0].axisValue;
          let result = `${name}<br/>`;
          params.forEach((param: any) => {
            result += `${param.seriesName}: ${param.value.toLocaleString()}원<br/>`;
          });
          const total = params.reduce(
            (sum: number, param: any) => sum + param.value,
            0
          );
          result += `<strong>총합: ${total.toLocaleString()}원</strong>`;
          return result;
        },
      },
      legend: {
        data: ['웹 매출', '앱 매출'],
        right: 'right',
        top: 'top',
        orient: 'horizontal',
      },
      xAxis: {
        type: 'category',
        data: chartData.categories,
        axisLabel: {
          rotate: viewMode === 'product' ? 45 : 0,
          interval: 0,
          fontSize: 10,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => {
            if (value >= 100_000_000) {
              return `${(value / 100_000_000).toFixed(0)}억`;
            } else if (value >= 10_000) {
              return `${(value / 10_000).toFixed(0)}만`;
            } else {
              return `${value.toLocaleString()}`;
            }
          },
        },
      },
      series: [
        {
          name: '웹 매출',
          type: 'bar',
          stack: 'total',
          data: chartData.webSales,
          itemStyle: {
            color: theme.palette.success.light,
          },
        },
        {
          name: '앱 매출',
          type: 'bar',
          stack: 'total',
          data: chartData.appSales,
          itemStyle: {
            color: theme.palette.primary.light,
          },
        },
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: viewMode === 'product' ? '15%' : '3%',
        top: '17%',
        containLabel: true,
      },
    }),
    [chartData, viewMode, theme, getTitle]
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
    <Card elevation={0} sx={{ borderRadius: 2, height: '500px' }}>
      <CardContent sx={{ height: '100%', p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
          >
            <ToggleButton value="genre">장르</ToggleButton>
            <ToggleButton value="product">작품</ToggleButton>
            <ToggleButton value="publisher">출판사</ToggleButton>
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
