import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CustomersPage from '../pages/CustomersPage';
import ToursPage from '../pages/ToursPage';
import ReservationsPage from '../pages/ReservationsPage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/customers" element={
        <ProtectedRoute>
          <CustomersPage />
        </ProtectedRoute>
      } />
      
      <Route path="/tours" element={
        <ProtectedRoute>
          <ToursPage />
        </ProtectedRoute>
      } />
      
      <Route path="/reservations" element={
        <ProtectedRoute>
          <ReservationsPage />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
