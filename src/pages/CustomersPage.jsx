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
      <Box sx={{ mt: 2 }}>
        {/* Header */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
        >
          <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>Clientes</Typography>
          <Button variant="contained" onClick={handleCreate}>Agregar Cliente</Button>
        </Box>

        {/* Lista */}
        {loading ? (
          // Skeleton mientras carga
          <List sx={{ mt: 2 }}>
            {[...Array(limit)].map((_, i) => (
              <ListItem key={i} sx={{ borderRadius: 2, mb: 1 }}>
                <Skeleton variant="text" width="40%" height={28} />
                <Skeleton variant="text" width="30%" height={20} sx={{ ml: 2 }} />
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
                divider
                onClick={() => setDetailCustomer(c)}
                sx={{
                  listStyle: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 2,
                  px: 2,
                  mb: 1,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <ListItemText
                  primary={`${c.firstName} ${c.lastName}`}
                  secondary={c.email}
                />
                <ListItemSecondaryAction>
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
              </ListItem>
            ))}
          </List>
        )}

        {/* Paginación */}
        {!loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
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

        {/* Confirmación de eliminación */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>¿Eliminar cliente?</DialogTitle>
          <DialogContent>
            ¿Estás seguro de que quieres eliminar a <strong>{customerToDelete?.firstName} {customerToDelete?.lastName}</strong>?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">Eliminar</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
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
    </PageTransition>
  );
}
