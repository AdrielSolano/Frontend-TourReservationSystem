import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import NavBar from '../components/NavBar';
import HomePage from './pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CustomersPage from '../pages/CustomersPage';
import ToursPage from '../pages/ToursPage';
import ReservationsPage from '../pages/ReservationsPage';
import PrivateRoute from './PrivateRoute';

export default function Router() {
  return (
    <>
      <NavBar />
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/customers" element={
            <PrivateRoute><CustomersPage /></PrivateRoute>
          } />
          <Route path="/tours" element={
            <PrivateRoute><ToursPage /></PrivateRoute>
          } />
          <Route path="/reservations" element={
            <PrivateRoute><ReservationsPage /></PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </>
  );
}
