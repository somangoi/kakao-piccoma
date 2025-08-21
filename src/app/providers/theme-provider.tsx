import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { ReactNode } from 'react';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0E61FC',
      light: '#4A83FE',
      dark: '#0B50D4',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    warning: {
      main: '#FF5656', // 붉은 주황 (푸른색과 보색 대비)
      light: '#FF8686', // 밝은 경고
      dark: '#C52B2B', // 어두운 붉은 주황
    },
    success: {
      main: '#3DDC97', // 청록색 계열 (푸른색과 조화롭고 안정감)
      light: '#75F0BB', // 밝은 청록
      dark: '#16B07B', // 어두운 청록
    },
  },
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
