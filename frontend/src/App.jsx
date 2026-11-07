import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import LostItems from './pages/LostItems';
import FoundItems from './pages/FoundItems';
import ReportLostItem from './pages/ReportLostItem';
import ReportFoundItem from './pages/ReportFoundItem';
import ItemDetails from './pages/ItemDetails';
import EditItem from './pages/EditItem';
import MyReports from './pages/MyReports';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import Notifications from './pages/Notifications';
import RecoveryRequests from './pages/RecoveryRequests';
import RecoveryRequestDetails from './pages/RecoveryRequestDetails';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import ItemsManagement from './pages/admin/ItemsManagement';
import RecoveryManagement from './pages/admin/RecoveryManagement';
import ReportsManagement from './pages/admin/ReportsManagement';
import AdminActivity from './pages/admin/AdminActivity';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="lost-items" element={<LostItems />} />
              <Route path="found-items" element={<FoundItems />} />
              <Route path="item/:id" element={<ItemDetails />} />
              <Route path="about" element={<About />} />

              {/* Auth Routes */}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* Protected Reporting & User Routes */}
              <Route
                path="lost-items/report"
                element={
                  <ProtectedRoute>
                    <ReportLostItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="found-items/report"
                element={
                  <ProtectedRoute>
                    <ReportFoundItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="item/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-reports"
                element={
                  <ProtectedRoute>
                    <MyReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="matches/:itemId"
                element={
                  <ProtectedRoute>
                    <Matches />
                  </ProtectedRoute>
                }
              />

              <Route
                path="notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />

              <Route
                path="recovery-requests"
                element={
                  <ProtectedRoute>
                    <RecoveryRequests />
                  </ProtectedRoute>
                }
              />

              <Route
                path="recovery-requests/:id"
                element={
                  <ProtectedRoute>
                    <RecoveryRequestDetails />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/users"
                element={
                  <AdminRoute>
                    <UsersManagement />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/items"
                element={
                  <AdminRoute>
                    <ItemsManagement />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/recovery-requests"
                element={
                  <AdminRoute>
                    <RecoveryManagement />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/reports"
                element={
                  <AdminRoute>
                    <ReportsManagement />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/activity"
                element={
                  <AdminRoute>
                    <AdminActivity />
                  </AdminRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
