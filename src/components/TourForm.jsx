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
import DialogMotionTransition from './DialogMotionTransition';

export default function TourForm({ initialData, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    maxPeople: '',
    isActive: true,
  });

  // Fechas como objetos dayjs para render/validación
  const [availableDates, setAvailableDates] = useState([]);
  const [newDate, setNewDate] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        duration: initialData.duration || '',
        price: initialData.price || '',
        maxPeople: initialData.maxPeople || '',
        isActive: initialData.isActive ?? true,
      });

      // Normaliza fechas existentes a dayjs
      const dates = Array.isArray(initialData.availableDates)
        ? initialData.availableDates.map(d => dayjs(d))
        : [];
      setAvailableDates(dates);
    } else {
      setAvailableDates([]);
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
    if (!newDate) return;

    const today = dayjs().startOf('day');
    // Bloquea pasado
    if (newDate.startOf('day').isBefore(today)) return;

    // Evita duplicados por día
    const exists = availableDates.some(d => d.isSame(newDate, 'day'));
    if (exists) return;

    setAvailableDates(prev => [...prev, newDate.startOf('day')]);
    setNewDate(null);
  };

  const handleRemoveDate = (index) => {
    setAvailableDates(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validación rápida
    if (!formData.name?.trim()) return;
    if (!String(formData.price).length || Number(formData.price) < 0) return;

    // Convierte a ISO antes de enviar al backend
    const payload = {
      ...formData,
      duration: formData.duration ? Number(formData.duration) : undefined,
      price: formData.price ? Number(formData.price) : undefined,
      maxPeople: formData.maxPeople ? Number(formData.maxPeople) : undefined,
      availableDates: availableDates.map(d => d.toDate().toISOString()),
    };
    await onSubmit(payload);
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"                               // 👈 scroll interno en el contenido
      PaperProps={{ sx: { maxHeight: '85vh' } }}   // 👈 limita la altura total del modal
      TransitionComponent={DialogMotionTransition} // 👈 animación
      keepMounted
      BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.25)' } }}
    >
      <DialogTitle>{initialData ? 'Editar Tour' : 'Nuevo Tour'}</DialogTitle>

      <DialogContent
        dividers
        sx={{ maxHeight: '70vh', overflowY: 'auto' }} // 👈 área scrolleable
      >
        <Grid container spacing={2} direction="column" sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Duración (horas)"
              name="duration"
              type="number"
              fullWidth
              value={formData.duration}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Descripción"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Precio"
              name="price"
              type="number"
              fullWidth
              value={formData.price}
              onChange={handleChange}
              inputProps={{ min: 0, step: '0.01' }}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Máx. personas"
              name="maxPeople"
              type="number"
              fullWidth
              value={formData.maxPeople}
              onChange={handleChange}
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={formData.isActive} onChange={handleChange} name="isActive" />}
              label="Activo"
            />
          </Grid>

          {/* DatePicker con bloqueo de pasado */}
          <Grid item xs={12}>
            <DatePicker
              label="Agregar Fecha Disponible"
              value={newDate}
              onChange={(val) => setNewDate(val ? dayjs(val) : null)}
              disablePast
              minDate={dayjs().startOf('day')}
              slotProps={{
                textField: { fullWidth: true },
                // ayuda si el popper se corta por el scroll/overflow:
                popper: { placement: 'bottom-start' }
              }}
              disablePortal // evita portales que a veces se superponen raro con Dialog
            />
          </Grid>

          <Grid item xs={12}>
            <Button startIcon={<Add />} variant="contained" onClick={handleAddDate}>
              Agregar Fecha
            </Button>
          </Grid>

          <Grid item xs={12}>
            <List>
              {availableDates.length > 0 ? (
                availableDates
                  .slice() // evita mutación al ordenar
                  .sort((a, b) => a.valueOf() - b.valueOf())
                  .map((date, index) => (
                    <ListItem
                      key={`${date.valueOf()}-${index}`}
                      secondaryAction={
                        <IconButton edge="end" onClick={() => handleRemoveDate(index)}>
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={dayjs(date).format('DD/MM/YYYY')} />
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
