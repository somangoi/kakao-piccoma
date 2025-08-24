import { Box, Typography, Button } from '@mui/material';
import type { SortingState } from '@tanstack/react-table';

interface SortingControlsProps {
  sorting: SortingState;
  clearAllSorting: () => void;
}

export const SortingControls = ({
  sorting,
  clearAllSorting,
}: SortingControlsProps) => {
  return (
    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      {sorting.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          정렬을 적용하려면 컬럼 헤더를 클릭하세요
        </Typography>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary">
            정렬 적용: {sorting.length}개 컬럼
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={clearAllSorting}
            sx={{ fontSize: '0.75rem', flexShrink: 0 }}
          >
            정렬 초기화
          </Button>
        </>
      )}
    </Box>
  );
};
