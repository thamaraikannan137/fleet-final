/**
 * App Component
 * Main application entry point with FleetProvider
 */

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { FleetProvider } from './context/FleetContext';
import Dashboard from './view/Dashboard';
import './App.css';

// Create MUI theme - Materio inspired design
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7367F0',
      light: '#9E95F5',
      dark: '#5E50EE',
      contrastText: '#fff',
    },
    secondary: {
      main: '#A8AAAE',
      light: '#CFCFCF',
      dark: '#8A8D93',
    },
    success: {
      main: '#28C76F',
      light: '#48DA89',
      dark: '#1F9D57',
    },
    error: {
      main: '#EA5455',
      light: '#EE7D7E',
      dark: '#E42728',
    },
    warning: {
      main: '#FF9F43',
      light: '#FFB976',
      dark: '#FF8510',
    },
    info: {
      main: '#00CFE8',
      light: '#1CE7FF',
      dark: '#00A1B5',
    },
    background: {
      default: '#F8F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#4B465C',
      secondary: '#6F6B7D',
      disabled: '#B4B2BC',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 6,
  },
  shadows: [
    'none',
    '0px 2px 4px 0px rgba(75, 70, 92, 0.1)',
    '0px 2px 6px 0px rgba(75, 70, 92, 0.12)',
    '0px 3px 8px 0px rgba(75, 70, 92, 0.14)',
    '0px 4px 10px 0px rgba(75, 70, 92, 0.16)',
    '0px 5px 12px 0px rgba(75, 70, 92, 0.18)',
    '0px 6px 14px 0px rgba(75, 70, 92, 0.20)',
    '0px 7px 16px 0px rgba(75, 70, 92, 0.22)',
    '0px 8px 18px 0px rgba(75, 70, 92, 0.24)',
    '0px 9px 20px 0px rgba(75, 70, 92, 0.26)',
    '0px 10px 22px 0px rgba(75, 70, 92, 0.28)',
    ...Array(14).fill('0px 10px 22px 0px rgba(75, 70, 92, 0.28)'),
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 2px 6px 0px rgba(75, 70, 92, 0.12)',
          '&:hover': {
            boxShadow: '0px 4px 10px 0px rgba(75, 70, 92, 0.16)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 20px',
        },
        contained: {
          boxShadow: '0px 2px 4px 0px rgba(115, 103, 240, 0.4)',
          '&:hover': {
            boxShadow: '0px 4px 8px 0px rgba(115, 103, 240, 0.6)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          height: 28,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 2px 4px 0px rgba(75, 70, 92, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FleetProvider>
        <Dashboard />
      </FleetProvider>
    </ThemeProvider>
  );
}

export default App;
