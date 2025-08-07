import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext'; // 👈 Importa el contexto

export default function HomePage() {
  const { user } = useContext(AuthContext); // 👈 Obtén el estado del usuario

  return (
    <Box sx={{ textAlign: 'center', mt: 10, animation: 'fadeIn 1s ease-in' }}>
      <Typography variant="h3" gutterBottom>
        Bienvenido al Sistema de Reservación de Tours
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Inicia sesión para gestionar tours, clientes y reservaciones
      </Typography>
      {!user && (
        <Button component={Link} to="/login" variant="contained" size="large">
          Iniciar sesión
        </Button>
      )}
    </Box>
  );
}
