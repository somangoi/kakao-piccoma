import { Box, Typography } from '@mui/material';

interface EmptyStateProps {
  title: string;
  message: string;
  minHeight?: string;
}

export const EmptyState = ({ 
  title, 
  message, 
  minHeight = '400px' 
}: EmptyStateProps) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    sx={{ minHeight, textAlign: 'center' }}
  >
    <Typography variant="h6" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.disabled">
      {message}
    </Typography>
  </Box>
);