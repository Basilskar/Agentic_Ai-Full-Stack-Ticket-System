import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box, Chip, CircularProgress, Alert, Snackbar } from '@mui/material';
import EditUserDialog from './EditUserDialog';
import apiService from '../services/apiService';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleUpdateUser = async (userData) => {
    try {
      await apiService.updateUser(userData);
      fetchUsers();
      setSnackbar({ open: true, message: 'User updated successfully!', severity: 'success' });
      setEditDialogOpen(false);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Panel
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid item xs={12} md={6} lg={4} key={user._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {user.email}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      label={user.role} 
                      color={user.role === 'Admin' ? 'error' : user.role === 'Moderator' ? 'warning' : 'default'}
                      size="small"
                    />
                  </Box>
                  {user.skills && user.skills.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {user.skills.map((skill, index) => (
                        <Chip 
                          key={index} 
                          label={skill} 
                          variant="outlined" 
                          size="small" 
                          color="secondary"
                        />
                      ))}
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleEditUser(user)}>
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <EditUserDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        user={selectedUser}
        onUpdate={handleUpdateUser}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPanel;
