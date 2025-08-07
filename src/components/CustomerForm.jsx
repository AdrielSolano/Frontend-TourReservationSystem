import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box
} from '@mui/material';
import { useState, useEffect } from 'react';
import DialogMotionTransition from './DialogMotionTransition';

export default function CustomerForm({ initialData, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      PaperProps={{ sx: { maxHeight: '85vh' } }}
      TransitionComponent={DialogMotionTransition}
      keepMounted
      BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.25)' } }}
    >
      <DialogTitle>{initialData ? 'Editar Cliente' : 'Agregar Cliente'}</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Nombre" name="firstName" value={formData.firstName} onChange={handleChange} required />
          <TextField label="Apellido" name="lastName" value={formData.lastName} onChange={handleChange} required />
          <TextField label="Correo electrónico" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <TextField label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} />
          <TextField label="Dirección" name="address" value={formData.address} onChange={handleChange} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
