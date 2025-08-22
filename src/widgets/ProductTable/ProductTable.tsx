import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import type { SortingState } from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
  Pagination,
  Badge,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ArrowUpward, ArrowDownward, ClearAll } from '@mui/icons-material';
import type { JoinedRowWithDerived } from '@/entities/joined/model';

interface ProductTableProps {
  filteredRows: JoinedRowWithDerived[];
}

const columnHelper = createColumnHelper<JoinedRowWithDerived>();

export const ProductTable = ({ filteredRows }: ProductTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleSortingChange = (updaterOrValue: any) => {
    setSorting((prev) => {
      const newSorting =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(prev)
          : updaterOrValue;
      return newSorting;
    });
  };

  const clearAllSorting = () => {
    setSorting([]);
  };

  const getSortIndex = (columnId: string) => {
    return sorting.findIndex((sort) => sort.id === columnId);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        id: 'title',
        header: '작품명',
        cell: (info) => (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {info.getValue()}
          </Typography>
        ),
        size: 200,
      }),
      columnHelper.accessor('author', {
        id: 'author',
        header: '작가명',
        cell: (info) => (
          <Typography
            variant="body2"
            sx={{
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {info.getValue()}
          </Typography>
        ),
        size: 90,
      }),
      columnHelper.accessor('genre', {
        id: 'genre',
        header: '장르',
        cell: (info) => (
          <Chip
            label={info.getValue()}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          />
        ),
        size: 90,
      }),
      columnHelper.accessor('publisher', {
        id: 'publisher',
        header: '출판사',
        cell: (info) => (
          <Typography
            variant="body2"
            sx={{
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {info.getValue()}
          </Typography>
        ),
        size: 100,
      }),
      columnHelper.accessor('derivedTotals.totalSales', {
        id: 'totalSales',
        header: '기간 내 매출',
        cell: (info) => (
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, textAlign: 'right' }}
          >
            {info.getValue().toLocaleString()}원
          </Typography>
        ),
        size: 130,
      }),
      columnHelper.accessor(
        (row) => {
          return row.filteredSeries.reduce(
            (sum, sale) => sum + sale.totalReadUser,
            0
          );
        },
        {
          id: 'totalReadUser',
          header: '기간 내 조회수',
          cell: (info) => (
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, textAlign: 'right' }}
            >
              {info.getValue().toLocaleString()}명
            </Typography>
          ),
          size: 135,
        }
      ),
      columnHelper.accessor('status', {
        id: 'status',
        header: '상태',
        cell: (info) => {
          const status = info.getValue();
          const getStatusColor = (status: string) => {
            switch (status) {
              case 'ON_SALE':
                return 'success';
              case 'INACTIVE':
                return 'warning';
              case 'ACTIVE':
                return 'primary';
              default:
                return 'default';
            }
          };

          const getStatusLabel = (status: string) => {
            switch (status) {
              case 'ON_SALE':
                return '판매중';
              case 'INACTIVE':
                return '비활성';
              case 'ACTIVE':
                return '활성';
              default:
                return status;
            }
          };

          return (
            <Chip
              label={getStatusLabel(status)}
              size="small"
              color={getStatusColor(status) as any}
              variant="filled"
            />
          );
        },
        size: 100,
      }),
      columnHelper.accessor('tags', {
        id: 'tags',
        header: '태그',
        cell: (info) => (
          <Box sx={{ maxWidth: '200px' }}>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
              {info.getValue().join(', ')}
            </Typography>
          </Box>
        ),
        enableSorting: false,
        size: 180,
      }),
      columnHelper.accessor('startedAt', {
        id: 'startedAt',
        header: '판매시작일',
        cell: (info) => (
          <Typography variant="body2">
            {new Date(info.getValue())
              .toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
              .replace(/\./g, '-')
              .replace(/-\s/g, '-')
              .slice(0, -1)}
          </Typography>
        ),
        size: 140,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredRows,
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

  return (
    <Box sx={{ width: '100%' }}>
      {/* Sorting Controls */}
      {sorting.length > 0 && (
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
      )}

      <TableContainer component={Paper} elevation={0}>
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
                      <Tooltip 
                        title={header.column.getCanSort() ? "클릭: 정렬 추가/변경" : ""}
                        arrow
                        placement="top"
                      >
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
                      </Tooltip>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{' '}
          -{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getPrePaginationRowModel().rows.length
          )}{' '}
          / {table.getPrePaginationRowModel().rows.length}개
        </Typography>

        <Pagination
          count={table.getPageCount()}
          page={table.getState().pagination.pageIndex + 1}
          onChange={(_, page) => table.setPageIndex(page - 1)}
          color="primary"
          size="small"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};
