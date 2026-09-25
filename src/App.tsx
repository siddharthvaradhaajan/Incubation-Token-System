import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Projects from './pages/Projects';
import DailyFoodList from './pages/DailyFoodList';
import ScanToken from './pages/ScanToken';
import FoodTokens from './pages/FoodTokens';
import Reports from './pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="projects" element={<Projects />} />
          <Route path="daily-food-list" element={<DailyFoodList />} />
          <Route path="scan-token" element={<ScanToken />} />
          <Route path="food-tokens" element={<FoodTokens />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
