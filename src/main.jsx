import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import theme from './theme';
import { AuthProvider } from './context/AuthContext'; // asegúrate que sea exportado como objeto con llaves

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <App />
          </LocalizationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
