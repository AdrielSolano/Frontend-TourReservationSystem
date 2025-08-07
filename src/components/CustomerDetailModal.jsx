// src/components/CustomerDetailModal.jsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box
} from '@mui/material';

export default function CustomerDetailModal({ customer, onClose }) {
  if (!customer) return null;

  return (
    <Dialog open={!!customer} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalles del Cliente</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Typography><strong>Nombre:</strong> {customer.firstName} {customer.lastName}</Typography>
          <Typography><strong>Email:</strong> {customer.email}</Typography>
          <Typography><strong>Teléfono:</strong> {customer.phone}</Typography>
<Typography><strong>Dirección:</strong> {customer.address}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
