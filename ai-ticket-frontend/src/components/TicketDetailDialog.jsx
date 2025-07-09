import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Grid, Chip, Paper, CircularProgress, Alert } from '@mui/material';
import apiService from '../services/apiService';

const TicketDetailDialog = ({ open, onClose, ticketId }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && ticketId) fetchTicket();
    // eslint-disable-next-line
  }, [open, ticketId]);

  const fetchTicket = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getTicket(ticketId);
      setTicket(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Ticket Details</DialogTitle>
      <DialogContent>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        )}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {ticket && (
          <Box>
            <Typography variant="h6" gutterBottom>{ticket.title}</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip label={ticket.status} color="primary" size="small" />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Priority</Typography>
                <Chip label={ticket.priority} color="warning" size="small" />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Type</Typography>
                <Chip label={ticket.ticketType} variant="outlined" size="small" />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Created</Typography>
                <Typography variant="body2">{new Date(ticket.createdAt).toLocaleString()}</Typography>
              </Grid>
            </Grid>
            <Typography variant="body2" color="text.secondary" gutterBottom>Description</Typography>
            <Typography variant="body1" paragraph>{ticket.description}</Typography>
            {ticket.requiredSkills && ticket.requiredSkills.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>Required Skills</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {ticket.requiredSkills.map((skill, index) => (
                    <Chip key={index} label={skill} size="small" color="secondary" />
                  ))}
                </Box>
              </Box>
            )}
            {ticket.assignedTo && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>Assigned To</Typography>
                <Typography variant="body1">{ticket.assignedTo.name} ({ticket.assignedTo.email})</Typography>
              </Box>
            )}
            {ticket.aiNotes && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>AI Analysis</Typography>
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body2">{ticket.aiNotes}</Typography>
                </Paper>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketDetailDialog;
