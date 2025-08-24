import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import type { SortingState } from '@tanstack/react-table';
import { useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Badge,
  Skeleton,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import type { JoinedRowWithDerived } from '@/entities/joined/model';
import type { LocalFilters } from './types/LocalFilters';
import { initialLocalFilters, applyLocalFilters } from './utils/localFilters';
import { FilterSection } from './components/FilterSection';
import { SortingControls } from './components/SortingControls';
import { TablePagination } from './components/TablePagination';
import { createTableColumns } from './config/columns';
import { useProductSearch } from '@/entities/product/hooks/useProductSearch';

interface ProductTableProps {
  filteredRows: JoinedRowWithDerived[];
  isLoading?: boolean;
}

export const ProductTable = ({
  filteredRows,
  isLoading,
}: ProductTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [localFilters, setLocalFilters] =
    useState<LocalFilters>(initialLocalFilters);
  const searchedRows = useProductSearch(
    filteredRows ?? [],
    localFilters.searchText
  );

  // 로컬 필터 적용
  const localFilteredRows = useMemo(() => {
    return applyLocalFilters(searchedRows, localFilters);
  }, [searchedRows, localFilters]);

  // 필터 옵션 생성 (전역 필터된 데이터 기반)
  const filterOptions = useMemo(() => {
    const statuses = [...new Set(filteredRows.map((row) => row.status))].sort();
    const publishers = [
      ...new Set(filteredRows.map((row) => row.publisher).filter(Boolean)),
    ].sort();

    return { statuses, publishers };
  }, [filteredRows]);

  const handleSortingChange = useCallback((updaterOrValue: any) => {
    setSorting((prev) => {
      const newSorting =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(prev)
          : updaterOrValue;
      return newSorting;
    });
  }, []);

  const clearAllSorting = useCallback(() => {
    setSorting([]);
  }, []);

  const clearAllLocalFilters = useCallback(() => {
    setLocalFilters(initialLocalFilters);
  }, []);

  const getSortIndex = useCallback(
    (columnId: string) => {
      return sorting.findIndex((sort) => sort.id === columnId);
    },
    [sorting]
  );

  const columns = useMemo(() => createTableColumns(), []);

  const table = useReactTable({
    data: localFilteredRows,
    columns,
    state: {
      sorting,
    },
    onSortingChange: handleSortingChange,
    enableMultiSort: true,
    enableSortingRemoval: true,
    maxMultiSortColCount: 5,
    isMultiSortEvent: () => true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            mb: 2,
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Skeleton variant="rounded" width={200} height={40} />
            <Skeleton variant="rounded" width={150} height={40} />
            <Skeleton variant="rounded" width={150} height={40} />
            <Skeleton variant="rounded" width={100} height={40} />
          </Box>
          <Skeleton variant="text" width={250} height={20} />
        </Box>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ minHeight: '650px' }}
        >
          <Table size="medium">
            <TableHead>
              <TableRow>
                {Array.from({ length: 6 }).map((_, index) => (
                  <TableCell key={index}>
                    <Skeleton variant="text" width="80%" height={24} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 10 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: 6 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton
                        variant="text"
                        width={cellIndex === 0 ? '60%' : '40%'}
                        height={20}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Skeleton variant="rounded" width={300} height={40} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" fontWeight={'bold'} gutterBottom>
        작품 정보 테이블
      </Typography>
      {/* Filter Section */}
      <FilterSection
        localFilters={localFilters}
        setLocalFilters={setLocalFilters}
        clearAllLocalFilters={clearAllLocalFilters}
        filterOptions={filterOptions}
        filteredRowsCount={filteredRows.length}
        localFilteredRowsCount={localFilteredRows.length}
      />
      <SortingControls sorting={sorting} clearAllSorting={clearAllSorting} />
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          minHeight: '650px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Table size="medium" stickyHeader sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      backgroundColor: 'theme.palette.background.paper',
                      fontWeight: 600,
                      pr: 0,
                    }}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ...(header.column.getCanSort() && {
                            cursor: 'pointer',
                          }),
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </Typography>
                        {header.column.getCanSort() && (
                          <Box
                            sx={{
                              ml: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {header.column.getIsSorted() ? (
                              <Badge
                                badgeContent={
                                  getSortIndex(header.column.id) + 1
                                }
                                color="primary"
                                sx={{
                                  '& .MuiBadge-badge': {
                                    fontSize: '0.6rem',
                                    minWidth: '16px',
                                    height: '16px',
                                  },
                                }}
                              >
                                {header.column.getIsSorted() === 'asc' ? (
                                  <ArrowUpward
                                    fontSize="small"
                                    sx={{ color: 'primary.main' }}
                                  />
                                ) : (
                                  <ArrowDownward
                                    fontSize="small"
                                    sx={{ color: 'primary.main' }}
                                  />
                                )}
                              </Badge>
                            ) : (
                              <Box sx={{ width: 20, height: 20 }} />
                            )}
                          </Box>
                        )}
                      </Box>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'grey.50',
                    },
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      sx={{
                        py: 2,
                        height: '60px',
                        verticalAlign: 'middle',
                        overflow: 'hidden',
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    color: 'text.secondary',
                    height: '600px',
                    verticalAlign: 'middle',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ mb: 1, color: 'text.secondary' }}
                  >
                    {localFilters.searchText ||
                    localFilters.statuses.length > 0 ||
                    localFilters.publishers.length > 0
                      ? '검색 결과가 없습니다'
                      : '표시할 데이터가 없습니다'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    {localFilters.searchText ||
                    localFilters.statuses.length > 0 ||
                    localFilters.publishers.length > 0
                      ? '다른 검색어나 필터 조건을 시도해보세요'
                      : '데이터를 불러오는 중이거나 조건에 맞는 항목이 없습니다'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination table={table} />
    </Box>
  );
};
