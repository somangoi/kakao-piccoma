import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
} from '@mui/material';
import { ClearAll } from '@mui/icons-material';
import type { LocalFilters } from '../types/LocalFilters';
import {
  isLocalFiltersEmpty,
  getActiveLocalFiltersCount,
} from '../utils/localFilters';

interface FilterSectionProps {
  localFilters: LocalFilters;
  setLocalFilters: (filters: LocalFilters | ((prev: LocalFilters) => LocalFilters)) => void;
  clearAllLocalFilters: () => void;
  filterOptions: {
    statuses: string[];
    publishers: string[];
  };
  filteredRowsCount: number;
  localFilteredRowsCount: number;
}

export const FilterSection = ({
  localFilters,
  setLocalFilters,
  clearAllLocalFilters,
  filterOptions,
  filteredRowsCount,
  localFilteredRowsCount,
}: FilterSectionProps) => {
  return (
    <Box
      sx={{
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          필터 적용: {getActiveLocalFiltersCount(localFilters)}개 | 전체{' '}
          {filteredRowsCount}개 중 {localFilteredRowsCount}개 표시
        </Typography>
        {!isLocalFiltersEmpty(localFilters) && (
          <Tooltip title="모든 필터 초기화">
            <IconButton size="small" onClick={clearAllLocalFilters}>
              <ClearAll fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ flex: 1 }} />

      <TextField
        size="small"
        label="검색"
        placeholder="작품명, 작가명, 출판사"
        value={localFilters.searchText}
        onChange={(e) =>
          setLocalFilters((prev) => ({
            ...prev,
            searchText: e.target.value,
          }))
        }
        sx={{ minWidth: '250px' }}
      />

      <FormControl size="small" sx={{ minWidth: '150px' }}>
        <InputLabel>상태</InputLabel>
        <Select
          multiple
          value={localFilters.statuses}
          onChange={(e) =>
            setLocalFilters((prev) => ({
              ...prev,
              statuses: e.target.value as typeof localFilters.statuses,
            }))
          }
          input={<OutlinedInput label="상태" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.slice(0, 2).map((value) => (
                <Chip
                  key={value}
                  label={
                    value === 'ON_SALE'
                      ? '판매중'
                      : value === 'ACTIVE'
                        ? '활성'
                        : '비활성'
                  }
                  size="small"
                />
              ))}
              {selected.length > 2 && (
                <Chip label={`+${selected.length - 2}`} size="small" />
              )}
            </Box>
          )}
        >
          {filterOptions.statuses.map((status) => (
            <MenuItem key={status} value={status}>
              {status === 'ON_SALE'
                ? '판매중'
                : status === 'ACTIVE'
                  ? '활성'
                  : '비활성'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: '180px' }}>
        <InputLabel>출판사</InputLabel>
        <Select
          multiple
          value={localFilters.publishers}
          onChange={(e) =>
            setLocalFilters((prev) => ({
              ...prev,
              publishers: e.target.value as string[],
            }))
          }
          input={<OutlinedInput label="출판사" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.slice(0, 2).map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
              {selected.length > 2 && (
                <Chip label={`+${selected.length - 2}`} size="small" />
              )}
            </Box>
          )}
        >
          {filterOptions.publishers.map((publisher) => (
            <MenuItem key={publisher} value={publisher}>
              {publisher}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};