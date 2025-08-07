import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box
} from '@mui/material';
import DialogMotionTransition from './DialogMotionTransition';

export default function CustomerDetailModal({ customer, onClose }) {
  if (!customer) return null;

  return (
    <Dialog
      open={!!customer}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      PaperProps={{ sx: { maxHeight: '85vh' } }}
      TransitionComponent={DialogMotionTransition}
      keepMounted
      BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.25)' } }}
    >
      <DialogTitle>Detalles del Cliente</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
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
