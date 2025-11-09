import React, { useState, useEffect } from 'react';
import { borrowing } from '../services/api';
import {
  Container,
  Box,
  Typography,
  Button,
} from '@mui/material';

function BorrowingRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await borrowing.getRequests();
      setRequests(response.data);
    } catch (error) {
      setError('Failed to fetch requests');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await borrowing.updateStatus(id, status);
      fetchRequests();
    } catch (error) {
      setError('Failed to update request status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Borrowing Requests
        </Typography>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <div style={{
            backgroundColor: 'white',
            border: '1px solid rgba(224, 224, 224, 1)',
            borderRadius: '4px',
            overflowX: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '800px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Equipment</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Quantity</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Borrow Date</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Return Date</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Status</th>
                  {(userRole === 'admin' || userRole === 'staff') && (
                    <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} style={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <td style={{ padding: '16px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>{request.equipment_name}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>{request.quantity}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>{formatDate(request.borrow_date)}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>{formatDate(request.return_date)}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>{request.status}</td>
                    {(userRole === 'admin' || userRole === 'staff') && (
                      <td style={{ padding: '16px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                        {request.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleStatusUpdate(request.id, 'approved')}
                              color="primary"
                              size="small"
                              sx={{ mr: 1 }}
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleStatusUpdate(request.id, 'rejected')}
                              color="error"
                              size="small"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <Button
                            onClick={() => handleStatusUpdate(request.id, 'returned')}
                            color="success"
                            size="small"
                          >
                            Mark Returned
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </Box>
    </Container>
  );
}

export default BorrowingRequests;