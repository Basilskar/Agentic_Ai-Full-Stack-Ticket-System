import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert, CircularProgress } from '@mui/material';
import apiService from '../services/apiService';

const CreateTicketDialog = ({ open, onClose, onTicketCreated }) => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiService.createTicket(formData);
      onTicketCreated();
      onClose();
      setFormData({ title: '', description: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Ticket</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus margin="dense" name="title" label="Ticket Title"
            fullWidth variant="outlined" value={formData.title}
            onChange={handleChange} required sx={{ mb: 2 }}
          />
          <TextField
            margin="dense" name="description" label="Description"
            fullWidth multiline rows={4} variant="outlined"
            value={formData.description} onChange={handleChange}
            required placeholder="Please describe your issue in detail..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Create Ticket'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateTicketDialog;
