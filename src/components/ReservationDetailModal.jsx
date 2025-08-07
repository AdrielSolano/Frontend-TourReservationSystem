import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box
} from '@mui/material';
import dayjs from 'dayjs';
import DialogMotionTransition from './DialogMotionTransition';

export default function ReservationDetailModal({ reservation, onClose }) {
  if (!reservation) return null;

  const { customerId, tourId, date, people, totalPrice, status, createdAt } = reservation;
  const calculatedPrice = totalPrice ?? (tourId?.price * people);

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      PaperProps={{ sx: { maxHeight: '85vh' } }}
      TransitionComponent={DialogMotionTransition}
      keepMounted
      BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.25)' } }}
    >
      <DialogTitle>Detalle de la Reservación</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1">
            <strong>Cliente:</strong>{' '}
            {customerId ? `${customerId.firstName} ${customerId.lastName}` : '-'}
          </Typography>

          <Typography variant="subtitle1">
            <strong>Tour:</strong>{' '}
            {tourId?.name} - ${tourId?.price}
          </Typography>

          <Typography variant="subtitle1">
            <strong>Fecha de la Reservación:</strong>{' '}
            {dayjs(date).format('DD/MM/YYYY')}
          </Typography>

          <Typography variant="subtitle1">
            <strong>Personas:</strong> {people}
          </Typography>

          <Typography variant="subtitle1">
            <strong>Precio Total:</strong> ${calculatedPrice}
          </Typography>

          <Typography variant="subtitle1">
            <strong>Estado:</strong> {status}
          </Typography>

          <Typography variant="subtitle1">
            <strong>Creado el:</strong> {dayjs(createdAt).format('DD/MM/YYYY HH:mm')}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
