import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LoginForm } from '../LoginForm';
import { AuthProvider } from '../../../contexts/AuthContext';

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <AuthProvider>
        {component}
      </AuthProvider>
    </ThemeProvider>
  );
};

describe('LoginForm', () => {
  test('renders login form with both tabs', () => {
    renderWithProviders(<LoginForm />);
    
    expect(screen.getByText('Eat Well With Mel')).toBeInTheDocument();
    expect(screen.getByText('IBS Food & Symptom Tracker')).toBeInTheDocument();
    expect(screen.getByText('Clinician')).toBeInTheDocument();
    expect(screen.getByText('Patient')).toBeInTheDocument();
  });

  test('clinician tab shows email and password fields', () => {
    renderWithProviders(<LoginForm />);
    
    // Should default to clinician tab
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  test('patient tab shows access code field', () => {
    renderWithProviders(<LoginForm />);
    
    // Click on patient tab
    fireEvent.click(screen.getByText('Patient'));
    
    expect(screen.getByLabelText('Access Code')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Access My Account' })).toBeInTheDocument();
  });

  test('validates required fields on clinician login', async () => {
    renderWithProviders(<LoginForm />);
    
    // Try to submit without filling fields
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });
  });

  test('validates access code on patient login', async () => {
    renderWithProviders(<LoginForm />);
    
    // Click on patient tab
    fireEvent.click(screen.getByText('Patient'));
    
    // Try to submit without filling access code
    fireEvent.click(screen.getByRole('button', { name: 'Access My Account' }));
    
    await waitFor(() => {
      expect(screen.getByText('Please enter your access code')).toBeInTheDocument();
    });
  });

  test('access code input converts to uppercase', () => {
    renderWithProviders(<LoginForm />);
    
    // Click on patient tab
    fireEvent.click(screen.getByText('Patient'));
    
    const accessCodeInput = screen.getByLabelText('Access Code');
    fireEvent.change(accessCodeInput, { target: { value: 'abc123' } });
    
    expect(accessCodeInput).toHaveValue('ABC123');
  });

  test('switches between tabs correctly', () => {
    renderWithProviders(<LoginForm />);
    
    // Should start on clinician tab
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    
    // Switch to patient tab
    fireEvent.click(screen.getByText('Patient'));
    expect(screen.getByLabelText('Access Code')).toBeInTheDocument();
    
    // Switch back to clinician tab
    fireEvent.click(screen.getByText('Clinician'));
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });
});