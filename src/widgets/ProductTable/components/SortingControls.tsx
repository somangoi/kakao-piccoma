import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { ClearAll } from '@mui/icons-material';
import type { SortingState } from '@tanstack/react-table';

interface SortingControlsProps {
  sorting: SortingState;
  clearAllSorting: () => void;
}

export const SortingControls = ({ sorting, clearAllSorting }: SortingControlsProps) => {
  if (sorting.length === 0) return null;

  return (
    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        정렬 적용: {sorting.length}개 컬럼
      </Typography>
      <Tooltip title="모든 정렬 해제">
        <IconButton size="small" onClick={clearAllSorting}>
          <ClearAll fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};