import { Box, Container } from '@mui/material';

const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <Container
    component="main"
    maxWidth="xl"
    sx={{ bgcolor: 'background', py: 3, minHeight: '100vh' }}
  >
    <Box component="section" py={2}>
      {children}
    </Box>
  </Container>
);

export default PageLayout;
