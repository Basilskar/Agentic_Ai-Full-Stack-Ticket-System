import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'User' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let response;
      if (isLogin) {
        response = await apiService.login({ email: formData.email, password: formData.password });
      } else {
        response = await apiService.signup(formData);
      }
      login(response.token, response.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
          {isLogin ? 'Welcome back to Ticket Management' : 'Create your account'}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <TextField
              fullWidth label="Full Name" name="name" value={formData.name}
              onChange={handleChange} margin="normal" required
            />
          )}
          <TextField
            fullWidth label="Email" name="email" type="email"
            value={formData.email} onChange={handleChange} margin="normal" required
          />
          <TextField
            fullWidth label="Password" name="password" type="password"
            value={formData.password} onChange={handleChange} margin="normal" required
          />
          {!isLogin && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select name="role" value={formData.role} onChange={handleChange} label="Role">
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Moderator">Moderator</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (isLogin ? 'Sign In' : 'Sign Up')}
          </Button>
          <Button fullWidth variant="text" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
