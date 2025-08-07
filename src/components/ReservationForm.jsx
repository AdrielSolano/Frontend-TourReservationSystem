import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, FormControl, InputLabel, Select, Box, Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../api';
import DialogMotionTransition from './DialogMotionTransition';

export default function ReservationForm({ initialData, onClose, onSubmit }) {
  const [customers, setCustomers] = useState([]);
  const [tours, setTours] = useState([]);
  const [formData, setFormData] = useState({
    customerId: '',
    tourId: '',
    date: '',
    people: 1,
    status: 'pending'
  });
  const [availableDates, setAvailableDates] = useState([]);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const resCustomers = await api.get('/customers', { params: { page: 1, limit: 1000 } });
      const customersList =
        resCustomers.data?.data?.customers ||
        resCustomers.data?.customers ||
        resCustomers.data || [];

      const resTours = await api.get('/tours/active');

      setCustomers(customersList);
      setTours(resTours.data);

      if (initialData) {
        setFormData({
          customerId: initialData.customerId?._id || '',
          tourId: initialData.tourId?._id || '',
          date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
          people: initialData.people,
          status: initialData.status || 'pending'
        });

        const selectedTour = resTours.data.find(t => t._id === initialData.tourId?._id);
        if (selectedTour) {
          setAvailableDates(selectedTour.availableDates.map(d => new Date(d).toISOString().split('T')[0]));
          setCalculatedPrice(selectedTour.price * initialData.people);
        }
      }
    };
    fetchData();
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    if (name === 'tourId') {
      const selected = tours.find(t => t._id === value);
      const dates = selected?.availableDates.map(d => new Date(d).toISOString().split('T')[0]) || [];
      setAvailableDates(dates);
      setFormData({ ...formData, tourId: value, date: '' });
      setCalculatedPrice(selected?.price * formData.people || 0);
      return;
    }

    if (name === 'people') {
      const selected = tours.find(t => t._id === formData.tourId);
      const total = selected ? selected.price * parseInt(value || 1) : 0;
      setCalculatedPrice(total);
    }

    setFormData(updated);
  };

  const handleSubmit = () => {
    if (!formData.customerId || !formData.tourId || !formData.date || !formData.people) return;

    onSubmit({
      ...formData,
      people: parseInt(formData.people),
      date: new Date(formData.date)
    });
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      PaperProps={{ sx: { maxHeight: '85vh' } }}
      TransitionComponent={DialogMotionTransition}
      keepMounted
      BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.25)' } }}
    >
      <DialogTitle>{initialData ? 'Editar Reservación' : 'Nueva Reservación'}</DialogTitle>

      <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* Cliente */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="customer-label">Cliente</InputLabel>
            <Select
              labelId="customer-label"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              label="Cliente"
              required
              MenuProps={{ PaperProps: { style: { maxHeight: 320 } } }}
            >
              {customers.map(c => (
                <MenuItem key={c._id} value={c._id}>
                  {c.firstName} {c.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Tour */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="tour-label">Tour</InputLabel>
            <Select
              labelId="tour-label"
              name="tourId"
              value={formData.tourId}
              onChange={handleChange}
              label="Tour"
              required
              MenuProps={{ PaperProps: { style: { maxHeight: 320 } } }}
            >
              {tours.map(t => (
                <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Fecha Disponible */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="date-label">Fecha Disponible</InputLabel>
            <Select
              labelId="date-label"
              name="date"
              value={formData.date}
              onChange={handleChange}
              label="Fecha Disponible"
              required
              MenuProps={{ PaperProps: { style: { maxHeight: 320 } } }}
            >
              {availableDates.map(date => (
                <MenuItem key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Número de Personas */}
          <TextField
            name="people"
            label="Número de Personas"
            type="number"
            value={formData.people}
            onChange={handleChange}
            inputProps={{ min: 1 }}
            required
            fullWidth
          />

          {/* Estado (solo edición) */}
          {initialData && (
            <FormControl fullWidth variant="outlined">
              <InputLabel id="status-label">Estado</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Estado"
              >
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="confirmed">Confirmado</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* Precio Total */}
          <Typography variant="subtitle1" mt={1}>
            Precio total: <strong>${calculatedPrice}</strong>
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
