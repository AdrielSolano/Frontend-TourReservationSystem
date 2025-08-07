// src/components/ReservationForm.jsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, FormControl, InputLabel, Select, Box, Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../api';

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
      const resCustomers = await api.get('/customers');
      const resTours = await api.get('/tours/active');
      setCustomers(resCustomers.data.data.customers);
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
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? 'Editar Reservación' : 'Nueva Reservación'}</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          
          <FormControl fullWidth>
            <InputLabel>Cliente</InputLabel>
            <Select name="customerId" value={formData.customerId} onChange={handleChange} required>
              {customers.map(c => (
                <MenuItem key={c._id} value={c._id}>
                  {c.firstName} {c.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Tour</InputLabel>
            <Select name="tourId" value={formData.tourId} onChange={handleChange} required>
              {tours.map(t => (
                <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Fecha Disponible</InputLabel>
            <Select name="date" value={formData.date} onChange={handleChange} required>
              {availableDates.map(date => (
                <MenuItem key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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

          {initialData && (
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select name="status" value={formData.status} onChange={handleChange}>
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="confirmed">Confirmado</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
              </Select>
            </FormControl>
          )}

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
