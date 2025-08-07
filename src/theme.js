import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E2725B', // terracota
    },
    secondary: {
      main: '#f4a261',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
