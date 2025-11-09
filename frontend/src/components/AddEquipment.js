import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { equipment } from '../services/api';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';

function AddEquipment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    condition: '',
    quantity: '',
  });
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEquipment = async () => {
      if (isEditMode) {
        try {
          const response = await equipment.getById(id);
          setFormData({
            name: response.data.name,
            category: response.data.category,
            condition: response.data.condition,
            quantity: response.data.quantity.toString(),
          });
        } catch (error) {
          setError('Failed to load equipment details');
          console.error('Error fetching equipment:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEquipment();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        quantity: parseInt(formData.quantity),
      };

      if (isEditMode) {
        await equipment.update(id, data);
      } else {
        await equipment.create(data);
      }
      navigate('/equipment');
    } catch (error) {
      setError(error.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'add'} equipment`);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Edit Equipment' : 'Add New Equipment'}
        </Typography>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              label="Category"
            >
              <MenuItem value="sports">Sports</MenuItem>
              <MenuItem value="lab">Lab</MenuItem>
              <MenuItem value="music">Music</MenuItem>
              <MenuItem value="camera">Camera</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Condition</InputLabel>
            <Select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
              label="Condition"
            >
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="good">Good</MenuItem>
              <MenuItem value="fair">Fair</MenuItem>
              <MenuItem value="poor">Poor</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            margin="normal"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              {isEditMode ? 'Update Equipment' : 'Add Equipment'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate('/equipment')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default AddEquipment;