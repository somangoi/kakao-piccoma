import { QueryProvider, ThemeProvider } from '@/app/providers';
import DashboardPage from '@/pages/DashboardPage/DashboardPage';
import { Header } from '@/widgets/Header/Header';
import './styles/globals.css';

function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <Header />
        <DashboardPage />
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
