import { Card, CardContent, useTheme } from '@mui/material';
import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { JoinedRowWithDerived } from '@/entities/joined/model';

interface LineChartSectionProps {
  filteredRows: JoinedRowWithDerived[];
}

export const LineChartSection = ({ filteredRows }: LineChartSectionProps) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    const salesByDate = new Map<
      string,
      { total: number; app: number; web: number }
    >();

    filteredRows.forEach((row) => {
      row.filteredSeries.forEach((sale) => {
        const dateKey = sale.date.toISOString().split('T')[0];
        const existing = salesByDate.get(dateKey) || {
          total: 0,
          app: 0,
          web: 0,
        };
        salesByDate.set(dateKey, {
          total: existing.total + sale.totalSales,
          app: existing.app + sale.appSales,
          web: existing.web + sale.webSales,
        });
      });
    });

    const sortedData = Array.from(salesByDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, sales]) => ({
        date,
        total: sales.total,
        app: sales.app,
        web: sales.web,
      }));

    return sortedData;
  }, [filteredRows]);

  const option = useMemo(
    () => ({
      title: {
        text: '📈 총 매출 추이',
        left: 'left',
        textStyle: {
          fontSize: theme.typography.h6.fontSize,
          fontWeight: 'bold',
        },
      },
      legend: {
        data: ['총 매출', '앱 매출', '웹 매출'],
        right: 'right',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          let result = `${params[0].axisValue}<br/>`;
          params.forEach((param: any) => {
            result += `${param.seriesName}: ${param.value.toLocaleString()}원<br/>`;
          });
          return result;
        },
      },
      xAxis: {
        type: 'category',
        data: chartData.map((item) => item.date),
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => `${(value / 1000000).toFixed(0)}M`,
        },
      },
      series: [
        {
          name: '총 매출',
          data: chartData.map((item) => item.total),
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: theme.palette.primary.main,
          },
        },
        {
          name: '앱 매출',
          data: chartData.map((item) => item.app),
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 2,
          },
          itemStyle: {
            color: theme.palette.success.main,
          },
        },
        {
          name: '웹 매출',
          data: chartData.map((item) => item.web),
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 2,
          },
          itemStyle: {
            color: theme.palette.warning.main,
          },
        },
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
    }),
    [chartData]
  );

  return (
    <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent sx={{ height: '100%', p: 2 }}>
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%', minHeight: '300px' }}
        />
      </CardContent>
    </Card>
  );
};
