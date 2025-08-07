import { useState, useEffect } from 'react';
import {
  Typography, Button, Box, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, Pagination, Skeleton
} from '@mui/material';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import api from '../api';
import ReservationForm from '../components/ReservationForm';
import ReservationDetailModal from '../components/ReservationDetailModal';

const listVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export default function ReservationsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ message: '', severity: 'info' });

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/reservations?page=${page}&limit=${limit}`);
      setReservations(res.data.data);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error('Error al cargar reservaciones:', err);
      setSnackbar({ message: 'Error al cargar reservaciones', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReservations(); }, [page]);

  const handleCreate = () => { setSelectedReservation(null); setOpenForm(true); };
  const handleEdit = (reservation) => { setSelectedReservation(reservation); setOpenForm(true); };

  const handleOpenDetail = async (reservation) => {
    try {
      const res = await api.get(`/reservations/${reservation._id}`);
      setSelectedReservation(res.data);
      setOpenDetail(true);
    } catch (err) {
      console.error('Error al obtener detalles de la reservación:', err);
      setSnackbar({ message: 'Error al obtener detalles', severity: 'error' });
    }
  };

  const handleDeleteRequest = (reservation) => { setReservationToDelete(reservation); setDeleteDialogOpen(true); };

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
        setSelectedReservation(prev => ({ ...prev, ...res.data }));
        setSnackbar({ message: 'Reservación actualizada correctamente', severity: 'success' });
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
    <PageTransition>
      <Box sx={{ mt: 2 }}>
        <Box component={motion.div} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }}
             sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>Reservaciones</Typography>
          <Button variant="contained" onClick={handleCreate}>Agregar Reservación</Button>
        </Box>

        {loading ? (
          <List sx={{ mt: 2 }}>
            {[...Array(limit)].map((_, i) => (
              <ListItem key={i} sx={{ borderRadius: 2, mb: 1 }}>
                <Box sx={{ width: '100%' }}>
                  <Skeleton variant="text" width="40%" height={28} />
                  <Skeleton variant="text" width="30%" height={20} />
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <List component={motion.ul} variants={listVariants} initial="hidden" animate="show" sx={{ mt: 2, p: 0 }}>
            {reservations.map((r) => (
              <ListItem
                key={r._id}
                component={motion.li}
                variants={itemVariants}
                divider
                sx={{
                  listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  '&:hover': { backgroundColor: '#f5f5f5' }, cursor: 'pointer', borderRadius: 2, mb: 1, px: 2
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
                  <Button variant="outlined" size="small" sx={{ mr: 1 }}
                          onClick={(e) => { e.stopPropagation(); handleEdit(r); }}>
                    Editar
                  </Button>
                  <Button variant="outlined" size="small" color="error"
                          onClick={(e) => { e.stopPropagation(); handleDeleteRequest(r); }}>
                    Eliminar
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        )}

        {!loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} color="primary" />
          </Box>
        )}

        {openForm && (
          <ReservationForm initialData={selectedReservation} onClose={() => setOpenForm(false)} onSubmit={handleSubmit} />
        )}

        {openDetail && selectedReservation && (
          <ReservationDetailModal reservation={selectedReservation} onClose={() => setOpenDetail(false)} />
        )}

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>¿Eliminar reservación?</DialogTitle>
          <DialogContent>¿Seguro que deseas eliminar esta reservación?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">Eliminar</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={!!snackbar.message} autoHideDuration={4000} onClose={() => setSnackbar({ message: '', severity: 'info' })}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ message: '', severity: 'info' })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </PageTransition>
  );
}
