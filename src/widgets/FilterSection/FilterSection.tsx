import { Box, Paper } from '@mui/material';
import { GenreFilter } from '@/features/filter/ui/GenreFilter';
import { TimeFilter } from '@/features/filter/ui/TimeFilter';

const FilterSection = () => (
  <Paper
    component="section"
    elevation={0}
    sx={{ mb: 3, bgcolor: 'transparent' }}
    aria-label="데이터 필터링"
  >
    <Box
      component="div"
      display="flex"
      flexDirection={{ xs: 'column', md: 'row' }}
      gap={3}
      alignItems={{ xs: 'stretch', md: 'center' }}
      aria-label="필터 컨트롤"
    >
      <TimeFilter />
      <GenreFilter />
    </Box>
  </Paper>
);

export default FilterSection;
