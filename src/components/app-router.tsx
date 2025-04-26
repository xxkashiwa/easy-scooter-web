import AppLayout from '@/app-layout';
import Allocation from '@/pages/all-location';
import ListAndSettings from '@/pages/all-location/list-and-settings';
import NoParkingZones from '@/pages/all-location/no-parking-zones';
import Discount from '@/pages/discount';
import Fault from '@/pages/fault';
import Home from '@/pages/home';
import DailyIncome from '@/pages/income/daily-income';
import WeeklyIncome from '@/pages/income/weekly-income';
import LoginPage from '@/pages/login';
import OrderList from '@/pages/order-list';
import useAuthStore from '@/stores/auth-store';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

const AppRouter = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // 如果用户未登录且当前路径不是登录页，则重定向到登录页
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order-list" element={<OrderList />} />
        <Route path="/fault" element={<Fault />} />
        {/* Allocation routes */}
        <Route
          path="/allocation"
          element={<Navigate to="/allocation/list-and-settings" replace />}
        />
        <Route
          path="/allocation/list-and-settings"
          element={<ListAndSettings />}
        />
        <Route
          path="/allocation/no-parking-zones"
          element={<NoParkingZones />}
        />
        <Route path="/all-location" element={<Allocation />} />{' '}
        {/* Legacy route */}
        {/* Income routes */}
        <Route
          path="/income"
          element={<Navigate to="/income/weekly-income" replace />}
        />
        <Route path="/income/weekly-income" element={<WeeklyIncome />} />
        <Route path="/income/daily-income" element={<DailyIncome />} />
        <Route path="/discount" element={<Discount />} />
        {/* Login route */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </AppLayout>
  );
};

export default AppRouter;
