import { TextField, Stack, Typography } from '@mui/material';
import { useFilterStore } from '../model/useFilterStore';

export const TimeFilter = () => {
  const { startDate, endDate, setFilter } = useFilterStore();

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const date = event.target.value ? new Date(event.target.value) : undefined;
    setFilter({ startDate: date });
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value ? new Date(event.target.value) : undefined;
    setFilter({ endDate: date });
  };

  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          label="시작일"
          type="date"
          size="small"
          value={formatDateForInput(startDate)}
          onChange={handleStartDateChange}
        />
        <Typography variant="body2" color="text.secondary">
          -
        </Typography>
        <TextField
          label="종료일"
          type="date"
          size="small"
          value={formatDateForInput(endDate)}
          onChange={handleEndDateChange}
        />
      </Stack>
    </Stack>
  );
};
