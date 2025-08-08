import { Box, Container, Typography, Card, CardContent, Button, Alert, Collapse } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

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
        // Mantén laptop igual; en móvil damos respirito
        minHeight: { xs: '100vh', md: '80vh' },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CB6E55',
        px: { xs: 2, sm: 3, md: 0 },
        py: { xs: 4, sm: 6, md: 0 },
      }}
    >
      <Box
        sx={{
          // Laptop intacto (md+); móvil ocupa ancho completo y altura automática
          width: { xs: '100%', md: '1100px' },
          height: { xs: 'auto', md: '500px' },
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#CB6E55',
          // En móvil centramos verticalmente el contenido con padding
          pb: { xs: 2, md: 0 },
        }}
      >
        {/* decorativos… */}

        <Container
          maxWidth="md"
          sx={{
            zIndex: 1,
            px: { xs: 0, sm: 2 }, // bordes pegados en móvil
          }}
        >
          {/* Alert con transición suave */}
          <Collapse in={showLogoutMessage} unmountOnExit>
            <Alert severity="success" sx={{ mb: 2 }}>
              Sesión cerrada con éxito
            </Alert>
          </Collapse>

          <MotionBox
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            sx={{ textAlign: 'center', mb: { xs: 2, sm: 2.5, md: 2 } }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                letterSpacing: 0.4,
                mb: 1,
                color: '#F7EBDD',
                // Tamaños solo para móvil; md+ conserva el look original
                fontSize: { xs: '1.9rem', sm: '2.2rem', md: 'inherit' },
                lineHeight: { xs: 1.15, md: 'inherit' },
              }}
            >
              Sistema de Reservación de Tours
            </Typography>
            <Box
              sx={{
                width: { xs: 80, sm: 100, md: 120 },
                height: 3,
                mx: 'auto',
                borderRadius: 999,
                backgroundColor: '#F2CC8F',
                mb: { xs: 2, sm: 2.5, md: 3 },
              }}
            />
          </MotionBox>

          <MotionCard
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            elevation={0}
            sx={{
              maxWidth: { xs: '100%', md: 600 }, // en móvil ocupa ancho completo
              mx: 'auto',
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.92)',
                  lineHeight: 1.6,
                  textAlign: 'center',
                  mb: !user ? { xs: 2.5, sm: 3 } : 0,
                  fontSize: { xs: '1rem', sm: '1.05rem', md: 'inherit' },
                }}
              >
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
                    fullWidth // solo ayuda en móvil; en md+ no afecta por maxWidth del card
                    sx={{
                      maxWidth: { xs: '100%', sm: 360 },
                      mx: 'auto',
                      px: 4,
                      borderRadius: 999,
                      backgroundColor: '#F2CC8F',
                      color: '#3b2a22',
                      textTransform: 'none',
                      ':hover': { backgroundColor: '#eac479' },
                    }}
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
