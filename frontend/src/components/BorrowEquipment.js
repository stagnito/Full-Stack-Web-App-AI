import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { equipment, borrowing } from '../services/api';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
} from '@mui/material';

function BorrowEquipment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipmentDetails, setEquipmentDetails] = useState(null);
  const [formData, setFormData] = useState({
    quantity: 1,
    borrow_date: '',
    return_date: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      try {
        const response = await equipment.getById(id);
        setEquipmentDetails(response.data);
      } catch (error) {
        setError('Failed to fetch equipment details');
      }
    };

    fetchEquipmentDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await borrowing.create({
        equipment_id: parseInt(id),
        quantity: parseInt(formData.quantity),
        borrow_date: formData.borrow_date,
        return_date: formData.return_date,
      });
      navigate('/requests');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit borrow request');
    }
  };

  if (!equipmentDetails) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Borrow {equipmentDetails.name}
        </Typography>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Typography gutterBottom>
            Available: {equipmentDetails.available_quantity}
          </Typography>
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            margin="normal"
            value={formData.quantity}
            onChange={handleChange}
            required
            inputProps={{
              min: 1,
              max: equipmentDetails.available_quantity,
            }}
          />
          <TextField
            fullWidth
            label="Borrow Date"
            name="borrow_date"
            type="date"
            margin="normal"
            value={formData.borrow_date}
            onChange={handleChange}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            label="Return Date"
            name="return_date"
            type="date"
            margin="normal"
            value={formData.return_date}
            onChange={handleChange}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={formData.quantity > equipmentDetails.available_quantity}
          >
            Submit Request
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default BorrowEquipment;