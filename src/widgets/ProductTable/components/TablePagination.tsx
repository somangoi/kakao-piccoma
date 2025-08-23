import { Box, Typography, Pagination } from '@mui/material';
import type { Table } from '@tanstack/react-table';
import type { JoinedRowWithDerived } from '@/entities/joined/model';

interface TablePaginationProps {
  table: Table<JoinedRowWithDerived>;
}

export const TablePagination = ({ table }: TablePaginationProps) => {
  return (
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
  );
};