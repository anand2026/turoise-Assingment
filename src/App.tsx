import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './core/components/Layout';
import { DashboardPage } from './features/dashboard/presentation/pages/DashboardPage';
import { DeviceListPage } from './features/devices/presentation/pages/DeviceListPage';
import { DeviceEditPage } from './features/devices/presentation/pages/DeviceEditPage';
import { StockManagementPage } from './features/stock/presentation/pages/StockManagementPage';
import { StockOverviewPage } from './features/stock/presentation/pages/StockOverviewPage';
import { OffersManagementPage } from './features/offers/presentation/pages/OffersManagementPage';
import { EmployeeAppView } from './features/employee/presentation/pages/EmployeeAppView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Supplier Portal */}
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="devices" element={<DeviceListPage />} />
          <Route path="devices/new" element={<DeviceEditPage />} />
          <Route path="devices/:id/edit" element={<DeviceEditPage />} />
          <Route path="devices/:id/stock" element={<StockManagementPage />} />
          <Route path="devices/:id/offers" element={<OffersManagementPage />} />
          <Route path="stock" element={<StockOverviewPage />} />
        </Route>

        {/* Employee App (standalone, no sidebar) */}
        <Route path="/employee-app" element={<EmployeeAppView />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
