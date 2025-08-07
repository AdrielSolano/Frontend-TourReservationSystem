import { useState, useEffect } from 'react';
import {
  Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, List, ListItem, ListItemText, ListItemSecondaryAction,
  Pagination, Skeleton
} from '@mui/material';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import api from '../api';
import TourForm from '../components/TourForm';
import TourDetailModal from '../components/TourDetailModal';

const listVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export default function ToursPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedTour, setSelectedTour] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ message: '', severity: 'info' });

  const fetchTours = async (currentPage = page) => {
    try {
      setLoading(true);
      const res = await api.get('/tours', { params: { page: currentPage, limit } });
      setTours(res.data.data.tours);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Error al obtener tours:', err);
      setSnackbar({ message: 'Error al obtener tours', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTours(page); }, [page]);

  const handleCreate = () => { setSelectedTour(null); setOpenForm(true); };
  const handleEdit = (tour) => { setSelectedTour(tour); setOpenForm(true); };
  const handleDeleteRequest = (tour) => { setTourToDelete(tour); setDeleteDialogOpen(true); };

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
    <PageTransition>
      <Box sx={{ mt: 2 }}>
        <Box component={motion.div} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }}
             sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>Tours</Typography>
          <Button variant="contained" onClick={handleCreate}>Agregar Tour</Button>
        </Box>

        {loading ? (
          <List sx={{ mt: 2 }}>
            {[...Array(limit)].map((_, i) => (
              <ListItem key={i} sx={{ borderRadius: 2, mb: 1 }}>
                <Box sx={{ width: '100%' }}>
                  <Skeleton variant="text" width="35%" height={28} />
                  <Skeleton variant="text" width="20%" height={20} />
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <List component={motion.ul} variants={listVariants} initial="hidden" animate="show" sx={{ mt: 2, p: 0 }}>
            {tours.map((tour) => (
              <ListItem
                key={tour._id}
                component={motion.li}
                variants={itemVariants}
                divider
                onClick={() => { setSelectedTour(tour); setOpenDetail(true); }}
                sx={{ listStyle: 'none', display: 'flex', alignItems: 'center', borderRadius: 2, px: 2, mb: 1, cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                <ListItemText primary={tour.name} secondary={`$${tour.price}`} />
                <ListItemSecondaryAction>
                  <Button variant="outlined" onClick={(e) => { e.stopPropagation(); handleEdit(tour); }} sx={{ mr: 1 }}>Editar</Button>
                  <Button variant="outlined" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteRequest(tour); }}>Eliminar</Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}

        {!loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} color="primary" />
          </Box>
        )}

        {openForm && (
          <TourForm initialData={selectedTour} onClose={() => setOpenForm(false)} onSubmit={handleSubmit} />
        )}

        {openDetail && selectedTour && (
          <TourDetailModal tour={selectedTour} onClose={() => { setOpenDetail(false); setSelectedTour(null); }} onUpdate={fetchTours} />
        )}

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>¿Eliminar tour?</DialogTitle>
          <DialogContent>¿Estás seguro de que quieres eliminar el tour <strong>{tourToDelete?.name}</strong>?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">Eliminar</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={!!snackbar.message} autoHideDuration={4000} onClose={() => setSnackbar({ message: '', severity: 'info' })}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ message: '', severity: 'info' })}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </PageTransition>
  );
}
