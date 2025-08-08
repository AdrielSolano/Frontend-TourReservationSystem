import { useState, useEffect } from 'react';
import {
  Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, List, ListItem, ListItemText, ListItemSecondaryAction,
  Pagination, Skeleton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
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

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchReservations = async (currentPage = page) => {
    try {
      setLoading(true);
      const res = await api.get(`/reservations?page=${currentPage}&limit=${limit}`);
      setReservations(res.data.data || []);
      setTotalPages(res.data.pages || res.data.totalPages || 1);
    } catch (err) {
      console.error('Error al cargar reservaciones:', err);
      setSnackbar({ message: 'Error al cargar reservaciones', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReservations(page); }, [page]);

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
      <Box sx={{ mt: 2, px: { xs: 1, sm: 0 } }}>
        {/* Header (apila en xs; igual en laptop) */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: isXs ? 'stretch' : 'center',
            mb: 1,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 }
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
            Reservaciones
          </Typography>
          <Button variant="contained" onClick={handleCreate} fullWidth={isXs}>
            Agregar Reservación
          </Button>
        </Box>

        {loading ? (
          <List sx={{ mt: 2 }}>
            {[...Array(limit)].map((_, i) => (
              <ListItem key={i} sx={{ borderRadius: 2, mb: 1, px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 1.2 } }}>
                <Box sx={{ width: '100%' }}>
                  <Skeleton variant="text" width={isXs ? '60%' : '40%'} height={28} />
                  <Skeleton variant="text" width={isXs ? '40%' : '30%'} height={20} />
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
                divider={!isXs}
                onClick={() => handleOpenDetail(r)}
                sx={{
                  listStyle: 'none',
                  display: 'flex',
                  alignItems: isXs ? 'flex-start' : 'center',
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  borderRadius: 2,
                  px: { xs: 1, sm: 2 },
                  py: { xs: 1, sm: 1.2 },
                  mb: 1,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <ListItemText
                  primary={`${r.customerId?.firstName || 'Cliente'} ${r.customerId?.lastName || ''}`}
                  secondary={`Tour: ${r.tourId?.name || '-'}`}
                  primaryTypographyProps={{ variant: 'subtitle1', noWrap: false }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                  sx={{ pr: { sm: 2 }, width: '100%' }}
                />

                {/* Acciones originales a la derecha (ocultas en xs) */}
                <ListItemSecondaryAction sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={(e) => { e.stopPropagation(); handleEdit(r); }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={(e) => { e.stopPropagation(); handleDeleteRequest(r); }}
                  >
                    Eliminar
                  </Button>
                </ListItemSecondaryAction>

                {/* Acciones SOLO móvil, debajo del texto (mismos botones) */}
                <Box
                  sx={{
                    display: { xs: 'flex', sm: 'none' },
                    width: '100%',
                    mt: 0.5,
                    gap: 1,
                    justifyContent: 'flex-end'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button size="small" variant="outlined" onClick={() => handleEdit(r)}>Editar</Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteRequest(r)}>Eliminar</Button>
                </Box>
              </ListItem>
            ))}
          </List>
        )}

        {!loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              size={isXs ? 'small' : 'medium'}
              siblingCount={isXs ? 0 : 1}
            />
          </Box>
        )}

        {openForm && (
          <ReservationForm
            initialData={selectedReservation}
            onClose={() => setOpenForm(false)}
            onSubmit={handleSubmit}
            fullScreen={isXs} 
          />
        )}

        {openDetail && selectedReservation && (
          <ReservationDetailModal
            reservation={selectedReservation}
            onClose={() => setOpenDetail(false)}
            fullScreen={isXs} 
          />
        )}

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} fullScreen={isXs}>
          <DialogTitle>¿Eliminar reservación?</DialogTitle>
          <DialogContent>
            ¿Seguro que deseas eliminar esta reservación?
          </DialogContent>
          <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2 } }}>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">Eliminar</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!snackbar.message}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ message: '', severity: 'info' })}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ message: '', severity: 'info' })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </PageTransition>
  );
}
