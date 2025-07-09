import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Grid, Card, CardContent, Paper, CircularProgress, Alert, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateTicketDialog from './CreateTicketDialog';
import TicketDetailDialog from './TicketDetailDialog';
import TicketCard from './TicketCard';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { user } = useAuth();

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getTickets();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketCreated = () => {
    fetchTickets();
    setSnackbar({ open: true, message: 'Ticket created successfully! AI is processing it now.', severity: 'success' });
  };

  const handleTicketClick = (ticketId) => {
    setSelectedTicketId(ticketId);
    setDetailDialogOpen(true);
  };

  const getDashboardStats = () => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length
  });

  const stats = getDashboardStats();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">Dashboard</Typography>
        {user?.role === 'User' && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
            Create Ticket
          </Button>
        )}
      </Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography color="text.secondary" gutterBottom>Total Tickets</Typography>
            <Typography variant="h4">{stats.total}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography color="text.secondary" gutterBottom>Open</Typography>
            <Typography variant="h4" color="warning.main">{stats.open}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography color="text.secondary" gutterBottom>In Progress</Typography>
            <Typography variant="h4" color="info.main">{stats.inProgress}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography color="text.secondary" gutterBottom>Resolved</Typography>
            <Typography variant="h4" color="success.main">{stats.resolved}</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>
      <Typography variant="h5" gutterBottom>
        {user?.role === 'User' ? 'My Tickets' :
         user?.role === 'Moderator' ? 'Assigned Tickets' :
         'All Tickets'}
      </Typography>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!loading && !error && (
        <Grid container spacing={3}>
          {tickets.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">No tickets found</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.role === 'User' ? 'Create your first ticket to get started!' : 'No tickets assigned yet.'}
                </Typography>
              </Paper>
            </Grid>
          ) : (
            tickets.map((ticket) => (
              <Grid item xs={12} md={6} lg={4} key={ticket._id}>
                <TicketCard ticket={ticket} onClick={() => handleTicketClick(ticket._id)} />
              </Grid>
            ))
          )}
        </Grid>
      )}
      <CreateTicketDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} onTicketCreated={handleTicketCreated} />
      <TicketDetailDialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} ticketId={selectedTicketId} />
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

export default Dashboard;
