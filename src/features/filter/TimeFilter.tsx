import { TextField, Stack, Typography, Tabs, Tab, Paper } from '@mui/material';
import { useFilterStore } from '@/shared/store/filter';
import { useState } from 'react';

type QuickPeriod = 'last24h' | 'lastWeek' | 'lastMonth' | 'lastYear';

const TimeFilter = () => {
  const { startDate, endDate, setFilter } = useFilterStore();
  const [selectedPeriod, setSelectedPeriod] = useState<QuickPeriod | null>(
    null
  );

  const getQuickPeriodDates = (period: QuickPeriod) => {
    const now = new Date();
    const endDate = new Date(now);
    let startDate = new Date(now);

    switch (period) {
      case 'last24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case 'lastWeek':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'lastMonth':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'lastYear':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    return { startDate, endDate };
  };

  const handlePeriodChange = (period: QuickPeriod) => {
    setSelectedPeriod(period);
    const { startDate, endDate } = getQuickPeriodDates(period);
    setFilter({ startDate, endDate });
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const date = event.target.value ? new Date(event.target.value) : undefined;
    setSelectedPeriod(null);
    setFilter({ startDate: date });
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value ? new Date(event.target.value) : undefined;
    setSelectedPeriod(null);
    setFilter({ endDate: date });
  };

  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Paper variant="outlined" sx={{ border: 'none' }}>
        <Tabs
          value={selectedPeriod || false}
          onChange={(_, newValue) => handlePeriodChange(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Last 24 hour" value="last24h" />
          <Tab label="Last weeks" value="lastWeek" />
          <Tab label="Last month" value="lastMonth" />
          <Tab label="Last year" value="lastYear" />
        </Tabs>
      </Paper>

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

export default TimeFilter;
