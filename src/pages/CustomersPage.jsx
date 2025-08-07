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
  ListItemSecondaryAction
} from '@mui/material';
import api from '../api';
import CustomerDetailModal from '../components/CustomerDetailModal';
import CustomerForm from '../components/CustomerForm';

export default function CustomersPage() {
  const [detailCustomer, setDetailCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ message: '', severity: 'info' });

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data.data.customers);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
      setSnackbar({ message: 'Error al cargar clientes', severity: 'error' });
    }
  };

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

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Clientes</Typography>
      <Button variant="contained" onClick={handleCreate}>Agregar Cliente</Button>

      <List sx={{ mt: 2 }}>
        {customers.map((c) => (
          <ListItem
            key={c._id}
            divider
            button
            onClick={() => setDetailCustomer(c)} // 👈 abrir modal al hacer clic
          >
            <ListItemText
              primary={`${c.firstName} ${c.lastName}`}
              secondary={c.email}
            />
            <ListItemSecondaryAction>
              <Button variant="outlined" onClick={(e) => { e.stopPropagation(); handleEdit(c); }} sx={{ mr: 1 }}>Editar</Button>
              <Button variant="outlined" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteRequest(c); }}>Eliminar</Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {openForm && (
        <CustomerForm
          initialData={selectedCustomer}
          onClose={() => setOpenForm(false)}
          onSubmit={handleSubmit}
        />
      )}

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

      <Snackbar
        open={!!snackbar.message}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ message: '', severity: 'info' })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ message: '', severity: 'info' })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {detailCustomer && (
        <CustomerDetailModal
          customer={detailCustomer}
          onClose={() => setDetailCustomer(null)}
        />
      )}
    </Box>
  );
}
