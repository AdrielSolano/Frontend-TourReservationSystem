import { Box, Container, Typography, Card, CardContent, Button, Alert, Collapse } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  useEffect(() => {
    if (location.state?.flashed === 'logout') {
      setShowLogoutMessage(true);
      // Limpia el state para que al refrescar no reaparezca
      navigate(location.pathname, { replace: true, state: {} });
      const t = setTimeout(() => setShowLogoutMessage(false), 2500);
      return () => clearTimeout(t);
    }
  }, [location, navigate]);

  return (
    <Box
      sx={{
        minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#CB6E55',
      }}
    >
      <Box
        sx={{
          height: '500px', width: '1100px', display: 'flex', alignItems: 'center',
          position: 'relative', overflow: 'hidden', backgroundColor: '#CB6E55',
        }}
      >
        {/* decorativos… */}

        <Container maxWidth="md" sx={{ zIndex: 1 }}>
          {/* Alert con transición suave */}
          <Collapse in={showLogoutMessage} unmountOnExit>
            <Alert severity="success" sx={{ mb: 2 }}>
              Sesión cerrada con éxito
            </Alert>
          </Collapse>

          <MotionBox
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            sx={{ textAlign: 'center', mb: 2 }}
          >
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: 0.4, mb: 1, color: '#F7EBDD' }}>
              Sistema de Reservación de Tours
            </Typography>
            <Box sx={{ width: 120, height: 3, mx: 'auto', borderRadius: 999, backgroundColor: '#F2CC8F', mb: 3 }} />
          </MotionBox>

          <MotionCard
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            elevation={0}
            sx={{
              maxWidth: 600, mx: 'auto', backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.92)', lineHeight: 1.6, textAlign: 'center', mb: !user ? 3 : 0 }}>
                Nuestra plataforma te ayuda a organizar <strong>tours</strong>, administrar
                <strong> clientes</strong> y llevar el control de <strong>reservaciones</strong> en un solo lugar.
                Diseñada para trabajar rápido, con información clara y una experiencia consistente. Explora el menú superior para comenzar.
              </Typography>

              {!user && (
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    size="large"
                    sx={{ px: 4, borderRadius: 999, backgroundColor: '#F2CC8F', color: '#3b2a22', textTransform: 'none', ':hover': { backgroundColor: '#eac479' } }}
                  >
                    Inicia sesión para visualizar todo
                  </Button>
                </Box>
              )}
            </CardContent>
          </MotionCard>
        </Container>
      </Box>
    </Box>
  );
}
