import { QueryProvider, ThemeProvider } from '@/app/providers';
import DashboardPage from '@/pages/DashboardPage/DashboardPage';

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
