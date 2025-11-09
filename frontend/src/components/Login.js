import React, { useState, useEffect } from 'react';
import { auth } from '../services/api';
// removed unused navigate import
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
} from '@mui/material';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  // keep simple: navigation happens with window.location.replace after successful login

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Login attempt with:', formData);

    try {
      const response = await auth.login(formData);
      console.log('Login response:', response);

      if (response.data.access_token) {
        // Set authentication data
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('role', response.data.role);
        console.log('LocalStorage set:', {
          token: localStorage.getItem('token'),
          role: localStorage.getItem('role')
        });

        // Force a state update and navigate
        window.location.replace('/#/equipment');
      } else {
        console.error('Invalid response format:', response);
        setError('Server error: Invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="sm" className="centered-card fade-in">
      <Box sx={{ mt: 0 }}>
        <Typography variant="h4" gutterBottom className="card-title">
          Login
        </Typography>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            value={formData.username}
            className="form-field"
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            value={formData.password}
            className="form-field"
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            className="primary-btn"
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;