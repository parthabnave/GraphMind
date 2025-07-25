import { createTheme } from '@mui/material/styles';

const blueTheme = createTheme({
  palette: {
    primary: {
      main: '#1A73E8', // Google Blue
      light: '#4285F4',
      dark: '#0F4FB3',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#EA4335', // Google Red
      light: '#F47A70',
      dark: '#C62828',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#FBC02D',
    },
    info: {
      main: '#2196F3',
    },
    success: {
      main: '#34A853', // Google Green
    },
    background: {
      default: '#F8F9FA', // Light gray background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#202124', // Dark gray for primary text
      secondary: '#5F6368', // Medium gray for secondary text
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.8rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '2.2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.8rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.2rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none', // Google buttons are not all caps
      fontWeight: 500,
    },
  },
  spacing: 8, // Default spacing unit (e.g., theme.spacing(1) = 8px)
  shape: {
    borderRadius: 8, // Consistent border radius for components
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20, // Pill-shaped buttons
          padding: '8px 24px',
          boxShadow: 'none', // Remove default shadow
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Subtle hover shadow
          },
        },
        containedPrimary: {
          backgroundColor: '#1A73E8',
          '&:hover': {
            backgroundColor: '#176CD5',
          },
        },
        outlinedPrimary: {
          borderColor: '#DADCE0',
          color: '#1A73E8',
          '&:hover': {
            backgroundColor: 'rgba(26, 115, 232, 0.04)',
            borderColor: '#1A73E8',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, // Rounded corners for input fields
            '& fieldset': {
              borderColor: '#DADCE0', // Light border
            },
            '&:hover fieldset': {
              borderColor: '#BCC0C5', // Slightly darker on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1A73E8', // Google blue on focus
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#5F6368', // Label color
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#1A73E8', // Label color on focus
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // More rounded cards
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)', // Subtle shadow
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.08)', // Subtle shadow for app bar
          backgroundColor: '#FFFFFF', // White app bar
          color: '#202124', // Dark text
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: '0 24px', // More padding for toolbar
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '24px',
          paddingRight: '24px',
        },
      },
    },
  },
});

export default blueTheme;