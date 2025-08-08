import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import NavBar from './components/NavBar';
import HomePage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomersPage from './pages/CustomersPage';
import ToursPage from './pages/ToursPage';
import ReservationsPage from './pages/ReservationsPage';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  return (
    <>
      <CssBaseline />
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/customers" element={user ? <CustomersPage /> : <Navigate to="/login" />} />
            <Route path="/tours" element={user ? <ToursPage /> : <Navigate to="/login" />} />
            <Route path="/reservations" element={user ? <ReservationsPage /> : <Navigate to="/login" />} />
          </Routes>
        </AnimatePresence>
      </Container>
    </>
  );
}

export default App;
