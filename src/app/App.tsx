import { QueryProvider, ThemeProvider } from '@/app/providers';
import DashboardPage from '@/pages/DashboardPage/DashboardPage';
import './styles/globals.css';

function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <DashboardPage />
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
