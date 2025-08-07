import { AppBar, Toolbar, Typography, Button, Box, LinearProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleProtectedClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/'); // Home
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout(); // por si es async
      // Pequeño delay para que se vea la animación y no sea brusco
      setTimeout(() => {
        navigate('/', { replace: true, state: { flashed: 'logout' } });
        setIsLoggingOut(false);
      }, 350);
    } catch (e) {
      setIsLoggingOut(false);
      navigate('/', { replace: true, state: { flashed: 'logout' } });
    }
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo / Título */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexShrink: 0,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
              '&:hover': { opacity: 0.85 },
            }}
          >
            Tour Reservations
          </Typography>

          {/* Menú centrado (siempre visible) */}
          <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, justifyContent: 'center' }}>
            <Button color="inherit" onClick={() => handleProtectedClick('/customers')}>Customers</Button>
            <Button color="inherit" onClick={() => handleProtectedClick('/tours')}>Tours</Button>
            <Button color="inherit" onClick={() => handleProtectedClick('/reservations')}>Reservations</Button>
          </Box>

          {/* Auth */}
          <Box sx={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            {user ? (
              <Button color="inherit" onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? 'Saliendo…' : 'Logout'}
              </Button>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/register">Register</Button>
                <Button color="inherit" component={Link} to="/login">Login</Button>
              </>
            )}
          </Box>
        </Toolbar>
        {/* Loader sutil bajo el AppBar mientras cierra sesión */}
        {isLoggingOut && <LinearProgress color="inherit" />}
      </AppBar>
    </>
  );
}
