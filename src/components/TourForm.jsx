// src/components/TourForm.jsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControlLabel, Checkbox,
  Grid, IconButton, List, ListItem, ListItemText
} from '@mui/material';
import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Add, Delete } from '@mui/icons-material';
import dayjs from 'dayjs';

export default function TourForm({ initialData, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    maxPeople: '',
    isActive: true,
    availableDates: []
  });

  const [newDate, setNewDate] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        duration: initialData.duration,
        price: initialData.price,
        maxPeople: initialData.maxPeople,
        isActive: initialData.isActive,
        availableDates: initialData.availableDates || []
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddDate = () => {
    if (newDate && !formData.availableDates.includes(newDate)) {
      setFormData(prev => ({
        ...prev,
        availableDates: [...prev.availableDates, newDate]
      }));
      setNewDate(null);
    }
  };

  const handleRemoveDate = (index) => {
    setFormData(prev => ({
      ...prev,
      availableDates: prev.availableDates.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? 'Editar Tour' : 'Nuevo Tour'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} direction="column" sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField label="Nombre" name="name" fullWidth value={formData.name} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Duración (horas)" name="duration" type="number" fullWidth value={formData.duration} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Descripción" name="description" fullWidth multiline rows={3} value={formData.description} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Precio" name="price" type="number" fullWidth value={formData.price} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Máx. personas" name="maxPeople" type="number" fullWidth value={formData.maxPeople} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={formData.isActive} onChange={handleChange} name="isActive" />}
              label="Activo"
            />
          </Grid>
          <Grid item xs={12}>
            <DatePicker
              label="Agregar Fecha Disponible"
              value={newDate}
              onChange={setNewDate}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button startIcon={<Add />} variant="contained" onClick={handleAddDate}>
              Agregar Fecha
            </Button>
          </Grid>
          <Grid item xs={12}>
            <List>
              {formData.availableDates.length > 0 ? (
                formData.availableDates.map((date, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={dayjs(date).format('DD/MM/YYYY')} />
                    <IconButton edge="end" onClick={() => handleRemoveDate(index)}>
                      <Delete />
                    </IconButton>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="Sin fechas disponibles" />
                </ListItem>
              )}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
