import React, { useState, useEffect } from 'react';
import { equipment } from '../services/api';
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

function EquipmentList() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    let mounted = true;

    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await equipment.getAll(category ? { category } : {});
        if (mounted) {
          setEquipmentList(response.data);
        }
      } catch (error) {
        if (mounted) {
          setError('Failed to load equipment. Please try again.');
          console.error('Error fetching equipment:', error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchEquipment();

    return () => {
      mounted = false;
    };
  }, [category]);

  const filteredEquipment = equipmentList.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Equipment List
        </Typography>
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            label="Search equipment"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
            size="small"
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="sports">Sports</MenuItem>
              <MenuItem value="lab">Lab</MenuItem>
              <MenuItem value="music">Music</MenuItem>
              <MenuItem value="camera">Camera</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <Typography>Loading equipment...</Typography>
          </Box>
        )}

        {error && (
          <Box
            display="flex"
            justifyContent="center"
            my={4}
            p={2}
            bgcolor="error.light"
            color="error.contrastText"
            borderRadius={1}
          >
            <Typography>{error}</Typography>
          </Box>
        )}

        {!loading && !error && filteredEquipment.length === 0 && (
          <Box display="flex" justifyContent="center" my={4}>
            <Typography>No equipment found.</Typography>
          </Box>
        )}

        {!loading && !error && (
          <div className="table-wrap">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Condition</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td>{item.name}</td>
                    <td className="muted">{item.category}</td>
                    <td>{item.condition}</td>
                    <td>{item.available_quantity} / {item.quantity}</td>
                    <td>
                      <div className="actions">
                        {userRole === 'student' && item.available_quantity > 0 && (
                          <Button
                            variant="contained"
                            color="primary"
                            href={`/#/borrow/${item.id}`}
                            size="small"
                            className="action-btn primary-btn"
                          >
                            Borrow
                          </Button>
                        )}
                        {userRole === 'admin' && (
                          <Button
                            variant="contained"
                            color="secondary"
                            href={`/#/equipment/${item.id}/edit`}
                            size="small"
                            className="action-btn secondary-btn"
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Box>
    </Container>
  );
}

export default EquipmentList;