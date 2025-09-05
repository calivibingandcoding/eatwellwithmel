import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { MainLayout } from './components/navigation/MainLayout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fa7888',
    },
    secondary: {
      main: '#c27b70',
    },
    background: {
      default: '#fdf6f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Avenir Light", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
    },
  },
});

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#fdf6f5'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <MainLayout />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
