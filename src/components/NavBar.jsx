import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  LinearProgress,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handleProtectedClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/'); 
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout?.(); 
      setTimeout(() => {
        navigate('/', { replace: true, state: { flashed: 'logout' } });
        setIsLoggingOut(false);
      }, 350);
    } catch {
      setIsLoggingOut(false);
      navigate('/', { replace: true, state: { flashed: 'logout' } });
    }
  };

  const toggleDrawer = (state) => () => setOpenDrawer(state);

  const DrawerMenu = (
    <Box
      sx={{ width: 260 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold">Tour Reservations</Typography>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleProtectedClick('/customers')}>
            <ListItemText primary="Customers" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleProtectedClick('/tours')}>
            <ListItemText primary="Tours" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleProtectedClick('/reservations')}>
            <ListItemText primary="Reservations" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
        {user ? (
          <Button fullWidth variant="outlined" onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? 'Saliendo…' : 'Logout'}
          </Button>
        ) : (
          <>
            <Button fullWidth variant="outlined" component={Link} to="/register">
              Register
            </Button>
            <Button fullWidth variant="contained" component={Link} to="/login">
              Login
            </Button>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
          {/* Izquierda: Logo / Hamburguesa */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isDesktop && (
              <IconButton
                color="inherit"
                edge="start"
                aria-label="open menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              style={{ textDecoration: 'none', color: 'inherit' }}
              sx={{ fontWeight: 'bold', '&:hover': { opacity: 0.85 } }}
            >
              Tour Reservations
            </Typography>
          </Box>

          {/* Centro: Menú (solo md+) */}
          {isDesktop && (
            <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, justifyContent: 'center' }}>
              <Button color="inherit" onClick={() => handleProtectedClick('/customers')}>
                Customers
              </Button>
              <Button color="inherit" onClick={() => handleProtectedClick('/tours')}>
                Tours
              </Button>
              <Button color="inherit" onClick={() => handleProtectedClick('/reservations')}>
                Reservations
              </Button>
            </Box>
          )}

          {/* Derecha: Auth */}
          <Box sx={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            {isDesktop ? (
              user ? (
                <Button color="inherit" onClick={handleLogout} disabled={isLoggingOut}>
                  {isLoggingOut ? 'Saliendo…' : 'Logout'}
                </Button>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/register">
                    Register
                  </Button>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
                </>
              )
            ) : (
              <></>
            )}
          </Box>
        </Toolbar>

        {/* Loader sutil bajo el AppBar mientras cierra sesión */}
        {isLoggingOut && <LinearProgress color="inherit" />}
      </AppBar>

      {/* Drawer para móvil */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={toggleDrawer(false)}
        ModalProps={{ keepMounted: true }} 
      >
        {DrawerMenu}
      </Drawer>
    </>
  );
}
