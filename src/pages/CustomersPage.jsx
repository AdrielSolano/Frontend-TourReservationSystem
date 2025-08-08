import { useEffect, useState } from 'react';
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
  ListItemSecondaryAction,
  Pagination,
  Skeleton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import api from '../api';
import CustomerDetailModal from '../components/CustomerDetailModal';
import CustomerForm from '../components/CustomerForm';

const listVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 }
};

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [detailCustomer, setDetailCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ message: '', severity: 'info' });

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/customers?page=${page}&limit=${limit}`);
      setCustomers(res.data.data.customers);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
      setSnackbar({ message: 'Error al cargar clientes', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, [page]);

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setOpenForm(true);
  };

  const handleDeleteRequest = (customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/customers/${customerToDelete._id}`);
      setSnackbar({ message: 'Cliente eliminado correctamente', severity: 'success' });
      setDeleteDialogOpen(false);
      fetchCustomers();
    } catch (err) {
      console.error('Error al eliminar cliente:', err);
      setSnackbar({ message: 'Error al eliminar cliente', severity: 'error' });
    }
  };

  const handleCreate = () => {
    setSelectedCustomer(null);
    setOpenForm(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedCustomer) {
        await api.put(`/customers/${selectedCustomer._id}`, data);
        setSnackbar({ message: 'Cliente actualizado correctamente', severity: 'success' });
      } else {
        await api.post('/customers', data);
        setSnackbar({ message: 'Cliente creado correctamente', severity: 'success' });
      }
      setOpenForm(false);
      fetchCustomers();
    } catch (err) {
      console.error('Error al guardar:', err);
      setSnackbar({ message: 'Error al guardar cliente', severity: 'error' });
    }
  };

  return (
    <PageTransition>
      <Box sx={{ mt: 2, px: { xs: 1, sm: 0 } }}>
        {/* Header (apilado en xs, igual en laptop) */}
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
          <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>Clientes</Typography>
          <Button variant="contained" onClick={handleCreate} fullWidth={isXs}>
            Agregar Cliente
          </Button>
        </Box>

        {/* Lista */}
        {loading ? (
          <List sx={{ mt: 2 }}>
            {[...Array(limit)].map((_, i) => (
              <ListItem key={i} sx={{ borderRadius: 2, mb: 1, px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 1.2 } }}>
                <Skeleton variant="text" width={isXs ? '60%' : '40%'} height={28} />
                <Skeleton variant="text" width={isXs ? '50%' : '30%'} height={20} sx={{ ml: 2 }} />
              </ListItem>
            ))}
          </List>
        ) : (
          <List
            component={motion.ul}
            variants={listVariants}
            initial="hidden"
            animate="show"
            sx={{ mt: 2, p: 0 }}
          >
            {customers.map((c) => (
              <ListItem
                key={c._id}
                component={motion.li}
                variants={itemVariants}
                divider={!isXs}
                onClick={() => setDetailCustomer(c)}
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
                  primary={`${c.firstName} ${c.lastName}`}
                  secondary={c.email}
                  primaryTypographyProps={{ variant: 'subtitle1', noWrap: false }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                  sx={{ pr: { sm: 2 }, width: '100%' }}
                />

                {/* Acciones originales a la derecha (ocultas en xs) */}
                <ListItemSecondaryAction sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Button
                    variant="outlined"
                    onClick={(e) => { e.stopPropagation(); handleEdit(c); }}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={(e) => { e.stopPropagation(); handleDeleteRequest(c); }}
                  >
                    Eliminar
                  </Button>
                </ListItemSecondaryAction>

                {/* Acciones SOLO móvil, debajo del texto */}
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
                  <Button size="small" variant="outlined" onClick={() => handleEdit(c)}>
                    Editar
                  </Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteRequest(c)}>
                    Eliminar
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        )}

        {/* Paginación (compacta en xs) */}
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

        {/* Form */}
        {openForm && (
          <CustomerForm
            initialData={selectedCustomer}
            onClose={() => setOpenForm(false)}
            onSubmit={handleSubmit}
          />
        )}

        {/* Modal detalle */}
        {detailCustomer && (
          <CustomerDetailModal
            customer={detailCustomer}
            onClose={() => setDetailCustomer(null)}
          />
        )}

        {/* Confirmación de eliminación (fullScreen en xs) */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} fullScreen={isXs}>
          <DialogTitle>¿Eliminar cliente?</DialogTitle>
          <DialogContent>
            ¿Estás seguro de que quieres eliminar a <strong>{customerToDelete?.firstName} {customerToDelete?.lastName}</strong>?
          </DialogContent>
          <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2 } }}>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">Eliminar</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar (centrado en xs, igual que antes en sm+) */}
        <Snackbar
          open={!!snackbar.message}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ message: '', severity: 'info' })}
          anchorOrigin={{ vertical: 'bottom', horizontal: isXs ? 'center' : 'left' }}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ message: '', severity: 'info' })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </PageTransition>
  );
}
