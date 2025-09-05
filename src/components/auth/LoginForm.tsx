import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const LoginForm: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithCode, isLoading } = useAuth();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
  };

  const handleClinicianLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handlePatientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!accessCode) {
      setError('Please enter your access code');
      return;
    }

    try {
      await loginWithCode(accessCode);
    } catch (err) {
      setError('Invalid access code');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#fdf6f5',
        p: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'white',
          borderRadius: 2
        }}
      >
        <Box sx={{ textAlign: 'center', p: 3, pb: 0 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: 'Playfair Display',
              color: '#fa7888',
              mb: 1
            }}
          >
            Eat Well With Mel
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: '#c27b70',
              fontFamily: 'Avenir Light'
            }}
          >
            IBS Food & Symptom Tracker
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Clinician" />
            <Tab label="Patient" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleClinicianLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              helperText="Demo: mel@eatwell.com"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              helperText="Demo: password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#fa7888',
                '&:hover': {
                  backgroundColor: '#e66a7a'
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <form onSubmit={handlePatientLogin}>
            <TextField
              fullWidth
              label="Access Code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              margin="normal"
              required
              helperText="Enter the code provided by your clinician (Demo: ABC123 or XYZ789)"
              inputProps={{ maxLength: 6 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#fa7888',
                '&:hover': {
                  backgroundColor: '#e66a7a'
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Access My Account'}
            </Button>
          </form>
        </TabPanel>
      </Paper>
    </Box>
  );
};