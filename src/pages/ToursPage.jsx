import { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import api from '../api';
import TourForm from '../components/TourForm';
import TourDetailModal from '../components/TourDetailModal';

export default function ToursPage() {
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ message: '', severity: 'info' });

  const fetchTours = async () => {
    try {
      const res = await api.get('/tours');
      setTours(res.data);
    } catch (err) {
      console.error('Error al obtener tours:', err);
      setSnackbar({ message: 'Error al obtener tours', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleCreate = () => {
    setSelectedTour(null);
    setOpenForm(true);
  };

  const handleEdit = (tour) => {
    setSelectedTour(tour);
    setOpenForm(true);
  };

  const handleDeleteRequest = (tour) => {
    setTourToDelete(tour);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/tours/${tourToDelete._id}`);
      setSnackbar({ message: 'Tour eliminado correctamente', severity: 'success' });
      setDeleteDialogOpen(false);
      fetchTours();
    } catch (err) {
      console.error('Error al eliminar tour:', err);
      setSnackbar({ message: 'Error al eliminar tour', severity: 'error' });
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedTour) {
        await api.put(`/tours/${selectedTour._id}`, data);
        setSnackbar({ message: 'Tour actualizado correctamente', severity: 'success' });
      } else {
        await api.post('/tours', data);
        setSnackbar({ message: 'Tour creado correctamente', severity: 'success' });
      }
      setOpenForm(false);
      fetchTours();
    } catch (err) {
      console.error('Error al guardar tour:', err);
      setSnackbar({ message: 'Error al guardar tour', severity: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Tours</Typography>
      <Button variant="contained" onClick={handleCreate}>Agregar Tour</Button>

      <List sx={{ mt: 2 }}>
        {tours.map((tour) => (
          <ListItem
            key={tour._id}
            divider
            button
            onClick={() => {
              setSelectedTour(tour);
              setOpenDetail(true);
            }}
          >
            <ListItemText
              primary={tour.name}
              secondary={`$${tour.price}`}
            />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                onClick={(e) => { e.stopPropagation(); handleEdit(tour); }}
                sx={{ mr: 1 }}
              >
                Editar
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={(e) => { e.stopPropagation(); handleDeleteRequest(tour); }}
              >
                Eliminar
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Formulario Tour */}
      {openForm && (
        <TourForm
          initialData={selectedTour}
          onClose={() => setOpenForm(false)}
          onSubmit={handleSubmit}
        />
      )}

      {/* Modal Detalle Tour */}
      {openDetail && selectedTour && (
        <TourDetailModal
          tour={selectedTour}
          onClose={() => {
            setOpenDetail(false);
            setSelectedTour(null);
          }}
          onUpdate={fetchTours}
        />
      )}

      {/* Confirmar eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>¿Eliminar tour?</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que quieres eliminar el tour <strong>{tourToDelete?.name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de mensajes */}
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
