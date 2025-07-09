import React from 'react';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import theme from './theme';
import { useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import AdminPanel from './components/AdminPanel';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        {user ? (
          <>
            <Navigation />
            {user.role === 'Admin' ? <AdminPanel /> : <Dashboard />}
          </>
        ) : (
          <LoginPage />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default App;
