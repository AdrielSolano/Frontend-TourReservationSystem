import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
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

  return (
    <>
      <CssBaseline />
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path="/customers" element={user ? <CustomersPage /> : <Navigate to="/login" />} />
          <Route path="/tours" element={user ? <ToursPage /> : <Navigate to="/login" />} />
          <Route path="/reservations" element={user ? <ReservationsPage /> : <Navigate to="/login" />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
