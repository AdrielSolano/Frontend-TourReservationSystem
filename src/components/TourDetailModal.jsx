// src/components/TourDetailModal.jsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, List, ListItem, ListItemText
} from '@mui/material';
import dayjs from 'dayjs';
import DialogMotionTransition from './DialogMotionTransition'; // 👈

export default function TourDetailModal({ tour, onClose }) {
  return (
    <Dialog
      open={Boolean(tour)}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={DialogMotionTransition}  // 👈 animación
      keepMounted
      BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.25)' } }}
    >
      <DialogTitle>Detalles del Tour</DialogTitle>
      <DialogContent>
        <Typography><strong>Nombre:</strong> {tour.name}</Typography>
        <Typography><strong>Descripción:</strong> {tour.description}</Typography>
        <Typography><strong>Duración:</strong> {tour.duration} horas</Typography>
        <Typography><strong>Precio:</strong> ${tour.price}</Typography>
        <Typography><strong>Máx. personas:</strong> {tour.maxPeople}</Typography>
        <Typography><strong>Activo:</strong> {tour.isActive ? 'Sí' : 'No'}</Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Fechas Disponibles</Typography>
        <List>
          {tour.availableDates?.length > 0 ? (
            tour.availableDates.map((date, index) => (
              <ListItem key={index}>
                <ListItemText primary={dayjs(date).format('DD/MM/YYYY')} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="Sin fechas disponibles" />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
