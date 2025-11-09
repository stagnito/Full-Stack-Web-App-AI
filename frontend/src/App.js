import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';

import Login from './components/Login';
import Register from './components/Register';
import EquipmentList from './components/EquipmentList';
import AddEquipment from './components/AddEquipment';
import BorrowEquipment from './components/BorrowEquipment';
import BorrowingRequests from './components/BorrowingRequests';

function App() {
  // Initialize auth state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    console.log('Initial auth check:', { token });
    return !!token;
  });
  const [userRole, setUserRole] = useState(() => {
    const role = localStorage.getItem('role');
    console.log('Initial role check:', { role });
    return role || null;
  });

  // Check auth state on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      console.log('Auth state check:', { token, role });
      setIsAuthenticated(!!token);
      setUserRole(role);
    };

    // Check immediately
    checkAuth();

    // Check on storage changes
    window.addEventListener('storage', checkAuth);

    // Set up interval to periodically check (backup for navigation)
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Clear all local storage
    setIsAuthenticated(false);
    setUserRole(null);
    window.location.replace('/#/login'); // Use replace to prevent history entry
  };

  return (
    <div className="app-root fade-in">
      <Router>
        <AppBar position="static" className="topbar">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Equipment Lending System
            </Typography>
            {!isAuthenticated ? (
              <>
                <Button color="inherit" component={Link} to="/login" className="nav-btn">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register" className="nav-btn">
                  Register
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/equipment" className="nav-btn">
                  Equipment
                </Button>
                {userRole === 'admin' && (
                  <Button color="inherit" component={Link} to="/equipment/add" className="nav-btn">
                    Add Equipment
                  </Button>
                )}
                <Button color="inherit" component={Link} to="/requests" className="nav-btn">
                  Requests
                </Button>
                <Button color="inherit" onClick={handleLogout} className="nav-btn">
                  Logout
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>

        <Container>
          <Box sx={{ mt: 4 }}>
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/equipment" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  !isAuthenticated ? (
                    <Login />
                  ) : (
                    <Navigate to="/equipment" replace />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  !isAuthenticated ? <Register /> : <Navigate to="/equipment" replace />
                }
              />
              <Route
                path="/equipment"
                element={
                  isAuthenticated ? <EquipmentList /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/equipment/add"
                element={
                  isAuthenticated && userRole === 'admin' ? (
                    <AddEquipment />
                  ) : (
                    <Navigate to="/equipment" replace />
                  )
                }
              />
              <Route
                path="/borrow/:id"
                element={
                  isAuthenticated ? (
                    <BorrowEquipment />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/requests"
                element={
                  isAuthenticated ? (
                    <BorrowingRequests />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/equipment/:id/edit"
                element={
                  isAuthenticated && userRole === 'admin' ? (
                    <AddEquipment />
                  ) : (
                    <Navigate to="/equipment" replace />
                  )
                }
              />
            </Routes>
          </Box>
        </Container>
      </Router>
    </div>
  );
}

export default App;
