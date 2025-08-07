import { useState, useEffect } from 'react';
import {
  Typography, Button, Box, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import api from '../api';
import ReservationForm from '../components/ReservationForm';
import ReservationDetailModal from '../components/ReservationDetailModal';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ message: '', severity: 'info' });

  const fetchReservations = async () => {
    try {
      const res = await api.get('/reservations');
      setReservations(res.data);
    } catch (err) {
      console.error('Error al cargar reservaciones:', err);
      setSnackbar({ message: 'Error al cargar reservaciones', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCreate = () => {
    setSelectedReservation(null);
    setOpenForm(true);
  };

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setOpenForm(true);
  };

  const handleOpenDetail = (reservation) => {
    setSelectedReservation(reservation);
    setOpenDetail(true);
  };

  const handleDeleteRequest = (reservation) => {
    setReservationToDelete(reservation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/reservations/${reservationToDelete._id}`);
      setSnackbar({ message: 'Reservación eliminada correctamente', severity: 'success' });
      setDeleteDialogOpen(false);
      fetchReservations();
    } catch (err) {
      console.error('Error al eliminar reservación:', err);
      setSnackbar({ message: 'Error al eliminar reservación', severity: 'error' });
    }
  };

 const handleSubmit = async (data) => {
  try {
    if (selectedReservation) {
      const res = await api.put(`/reservations/${selectedReservation._id}`, data);
      setSnackbar({ message: 'Reservación actualizada correctamente', severity: 'success' });

      const updated = res.data;
      setSelectedReservation(prev => ({ ...prev, ...updated })); // ✅ Aquí actualizas los detalles
    } else {
      await api.post('/reservations', data);
      setSnackbar({ message: 'Reservación creada correctamente', severity: 'success' });
    }

    setOpenForm(false);
    fetchReservations();
  } catch (err) {
    console.error('Error al guardar reservación:', err);
    setSnackbar({ message: 'Error al guardar reservación', severity: 'error' });
  }
};

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Reservaciones</Typography>
      <Button variant="contained" onClick={handleCreate}>Agregar Reservación</Button>

      <List sx={{ mt: 2 }}>
        {reservations.map((r) => (
          <ListItem
            key={r._id}
            divider
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              '&:hover': { backgroundColor: '#f5f5f5' },
              cursor: 'pointer',
              borderRadius: 2,
              mb: 1,
              px: 2
            }}
            onClick={() => handleOpenDetail(r)}
          >
            <Box>
              <Typography variant="subtitle1">
                {`${r.customerId?.firstName || 'Cliente'} ${r.customerId?.lastName || ''}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tour: {r.tourId?.name || '-'}
              </Typography>
            </Box>
            <Box>
              <Button
                variant="outlined"
                size="small"
                sx={{ mr: 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(r);
                }}
              >
                Editar
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRequest(r);
                }}
              >
                Eliminar
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>



      {openForm && (
        <ReservationForm
          initialData={selectedReservation}
          onClose={() => setOpenForm(false)}
          onSubmit={handleSubmit}
        />
      )}

      {openDetail && selectedReservation && (
        <ReservationDetailModal
          reservation={selectedReservation}
          onClose={() => setOpenDetail(false)}
        />
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>¿Eliminar reservación?</DialogTitle>
        <DialogContent>
          ¿Seguro que deseas eliminar esta reservación?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbar.message}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ message: '', severity: 'info' })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ message: '', severity: 'info' })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
