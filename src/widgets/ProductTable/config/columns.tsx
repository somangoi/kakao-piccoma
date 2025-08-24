import { createColumnHelper } from '@tanstack/react-table';
import { Typography, Chip, Box } from '@mui/material';
import type { JoinedRowWithDerived } from '@/entities/joined/model';
import { useState, useEffect } from 'react';

const columnHelper = createColumnHelper<JoinedRowWithDerived>();

const ImageCell = ({ imageUrl }: { imageUrl?: string }) => {
  const fallbackUrl =
    'https://challenge-cdn.real.piccoma-ext.com/fe/static/thumbnail_img.png';
  const [imgSrc, setImgSrc] = useState(fallbackUrl);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => {
        setImgSrc(imageUrl);
        setIsLoaded(true);
      };
      img.onerror = () => {
        setIsLoaded(true);
      };
      img.src = imageUrl;
    } else {
      setIsLoaded(true);
    }
  }, [imageUrl]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        overflow: 'hidden',
        borderRadius: '50%',
      }}
    >
      <img
        src={imgSrc}
        alt="Product thumbnail"
        style={{
          width: 40,
          height: 40,
          objectFit: 'cover',
          borderRadius: '50%',
          border: '1px solid #e0e0e0',
          opacity: isLoaded ? 1 : 0.7,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </Box>
  );
};

export const createTableColumns = () => [
  columnHelper.accessor('id', {
    id: 'id',
    header: 'ID',
    cell: (info) => (
      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        {info.getValue()}
      </Typography>
    ),
    size: 70,
  }),
  columnHelper.accessor('thumbUrl', {
    id: 'image',
    header: '썸네일',
    cell: (info) => <ImageCell imageUrl={info.getValue()} />,
    size: 80,
    enableSorting: false,
  }),
  columnHelper.accessor('title', {
    id: 'title',
    header: '작품명',
    cell: (info) => (
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
        }}
      >
        {info.getValue()}
      </Typography>
    ),
    size: 300,
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
      <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'right' }}>
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
  columnHelper.accessor(
    (row) => {
      return row.filteredSeries.reduce(
        (sum, sale) => sum + sale.totalPaidUser,
        0
      );
    },
    {
      id: 'totalPaidUser',
      header: '기간 내 구매자 수',
      cell: (info) => (
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, textAlign: 'right' }}
        >
          {info.getValue().toLocaleString()}명
        </Typography>
      ),
      size: 145,
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
    size: 90,
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
];
