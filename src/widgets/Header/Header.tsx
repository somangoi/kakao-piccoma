import { AppBar, Toolbar, Typography, Box } from '@mui/material';

export const Header = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'background.default',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            component="img"
            src="/logo.svg"
            alt="Logo"
            sx={{
              width: 32,
              height: 32,
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
            }}
          >
            Dashboard
          </Typography>
        </Box>

        {/* 중간 공간 */}
        <Box flexGrow={1} />

        {/* 오른쪽: 지원자 이름 */}
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          황소미
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
