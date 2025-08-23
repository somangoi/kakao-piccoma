import {
  Card,
  CardContent,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  Chip,
  Button,
  Typography,
  Divider,
} from '@mui/material';
import { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { JoinedRowWithDerived } from '@/entities/joined/model';
import { useGenreStats } from '@/shared/hooks/useGenreStats';
import { useFilterStore } from '@/features/filter/model/useFilterStore';

interface PieChartSectionProps {
  filteredRows: JoinedRowWithDerived[];
}

type ViewMode = 'count' | 'sales';

export const PieChartSection = ({ filteredRows }: PieChartSectionProps) => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('count');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const genreStats = useGenreStats(filteredRows);

  const { genres: globalGenres, setFilter } = useFilterStore();
  const isGlobalFilterActive = globalGenres.length > 0;

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
        text: viewMode === 'count' ? '장르별 작품수 비중' : '장르별 매출 비중',
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
        theme.palette.warning.light,
        '#FFAD5C',
        '#FFD56F',
        theme.palette.success.light,
        '#64B5F6',
        '#4A6FA5',
        '#F3A1B8',
        '#FAD4B7',
        '#FFF4A3',
        '#BAEDBD',
        '#AEDFF7',
        '#D2D6F9',
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

  const handleApplyToGlobalFilter = () => {
    if (selectedGenres.length > 0) {
      setFilter({ genres: selectedGenres });
      setSelectedGenres([]);
    }
  };

  const handleRemoveSelectedGenre = (genre: string) => {
    setSelectedGenres((prev) => prev.filter((g) => g !== genre));
  };

  const handleClearSelection = () => {
    setSelectedGenres([]);
  };

  const onEvents = useMemo(
    () => ({
      click: (params: any) => {
        // 전역 필터가 활성화되어 있으면 클릭 비활성화
        if (isGlobalFilterActive || !params.name) return;

        const clickedGenre = params.name;
        setSelectedGenres((prev) =>
          prev.includes(clickedGenre)
            ? prev.filter((g) => g !== clickedGenre)
            : [...prev, clickedGenre]
        );
      },
    }),
    [isGlobalFilterActive]
  );

  return (
    <Card
      elevation={0}
      sx={{ borderRadius: 2, height: 'auto', minHeight: '500px' }}
    >
      <CardContent sx={{ p: 2 }}>
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

        <Box sx={{ height: '400px', mb: 2 }}>
          <ReactECharts
            option={option}
            onEvents={onEvents}
            style={{
              height: '100%',
              width: '100%',
              cursor: isGlobalFilterActive ? 'default' : 'pointer',
            }}
          />
        </Box>

        {/* 전역 필터가 비활성화되어 있을 때 표시 */}
        {!isGlobalFilterActive && (
          <>
            <Divider sx={{ my: 2 }} />
            {selectedGenres.length > 0 ? (
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: 'text.secondary' }}
                >
                  선택된 장르
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {selectedGenres.map((genre) => (
                    <Chip
                      key={genre}
                      label={genre}
                      onDelete={() => handleRemoveSelectedGenre(genre)}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleApplyToGlobalFilter}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    모든 차트에 적용
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleClearSelection}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    선택 해제
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  💡 파이차트의 장르를 클릭하여 비교하고 싶은 장르를
                  선택해보세요
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  선택한 장르들을 전체 대시보드의 필터로 적용할 수 있습니다.
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* 전역 필터가 활성화되어 있을 때 리셋 버튼 */}
        {isGlobalFilterActive && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', fontStyle: 'italic' }}
              >
                현재 장르 필터가 활성화되어 있습니다.
                <br /> 차트 내 클릭을 활성화하려면 "장르 필터 해제" 버튼을
                클릭해주세요.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setFilter({ genres: [] })}
                sx={{ fontSize: '0.75rem', flexShrink: 0 }}
              >
                장르 필터 해제
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};
