import { Button, Box, Typography } from '@mui/material';
import { Update as UpdateIcon } from '@mui/icons-material';
import { useDataRefresh } from './utils/useDataRefresh';

interface DataRefreshWidgetProps {
  className?: string;
}

export function DataRefreshWidget({ className }: DataRefreshWidgetProps) {
  const { hasNewData, refreshData, lastUpdate, formatTime } = useDataRefresh();

  return (
    <Box
      className={className}
      display="flex"
      alignItems="center"
      gap={2}
      sx={{
        borderRadius: 1,
        bgcolor: hasNewData ? 'action.hover' : 'transparent',
        transition: 'background-color 0.3s ease',
        pb: 1,
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ whiteSpace: 'nowrap' }}
        >
          마지막 업데이트: {formatTime(lastUpdate)}
        </Typography>
      </Box>
      {hasNewData && (
        <Button
          onClick={refreshData}
          variant="outlined"
          size="small"
          startIcon={<UpdateIcon />}
          sx={{
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            },
          }}
        >
          새로운 데이터 업데이트
        </Button>
      )}
    </Box>
  );
}
