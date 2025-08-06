import { useState, useEffect, useContext } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Box, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  IconButton,
  Chip
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

export default function ToursPage() {

  const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

  const [tours, setTours] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTour, setCurrentTour] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    availableDates: [],
    maxPeople: '',
    isActive: true
  });
  const [newDate, setNewDate] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchTours();
    }
  }, [user]);

  const fetchTours = async () => {
    try {
      const response = await api.get('/tours');
      setTours(response.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  const handleOpenDialog = (tour = null) => {
    setCurrentTour(tour);
    setFormData(
      tour || {
        name: '',
        description: '',
        duration: '',
        price: '',
        availableDates: [],
        maxPeople: '',
        isActive: true
      }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTour(null);
    setNewDate(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddDate = () => {
    if (newDate) {
      setFormData({
        ...formData,
        availableDates: [...formData.availableDates, newDate],
      });
      setNewDate(null);
    }
  };

  const handleRemoveDate = (dateToRemove) => {
    setFormData({
      ...formData,
      availableDates: formData.availableDates.filter(date => date !== dateToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTour) {
        await api.put(`/tours/${currentTour._id}`, formData);
      } else {
        await api.post('/tours', formData);
      }
      fetchTours();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving tour:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tours/${id}`);
      fetchTours();
    } catch (error) {
      console.error('Error deleting tour:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Tours</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => handleOpenDialog()}
        >
          Add Tour
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tours.map((tour) => (
              <TableRow key={tour._id}>
                <TableCell>{tour.name}</TableCell>
                <TableCell>{tour.description.substring(0, 50)}...</TableCell>
                <TableCell>{tour.duration} hours</TableCell>
                <TableCell>${tour.price}</TableCell>
                <TableCell>
                  <Chip 
                    label={tour.isActive ? 'Active' : 'Inactive'} 
                    color={tour.isActive ? 'success' : 'error'} 
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(tour)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(tour._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentTour ? 'Edit Tour' : 'Add New Tour'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Tour Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              margin="normal"
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                margin="normal"
                label="Duration (hours)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                required
                sx={{ flex: 1 }}
              />
              <TextField
                margin="normal"
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                sx={{ flex: 1 }}
              />
              <TextField
                margin="normal"
                label="Max People"
                name="maxPeople"
                type="number"
                value={formData.maxPeople}
                onChange={handleChange}
                required
                sx={{ flex: 1 }}
              />
            </Box>
            
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Available Dates</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Add Available Date"
                  value={newDate}
                  onChange={setNewDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <Button variant="outlined" onClick={handleAddDate}>
                Add Date
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {formData.availableDates.map((date, index) => (
                <Chip
                  key={index}
                  label={new Date(date).toLocaleDateString()}
                  onDelete={() => handleRemoveDate(date)}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {currentTour ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}