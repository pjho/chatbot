import { createTheme } from '@mui/material';

const frappeTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8caaee',
      dark: '#737994',
      light: '#99d1db',
      contrastText: '#c6d0f5',
    },
    secondary: {
      main: '#ca9ee6',
      dark: '#838ba7',
      light: '#f4b8e4',
    },
    background: {
      default: '#303446',
      paper: '#414559',
    },
    text: {
      primary: '#c6d0f5',
      secondary: '#b5bfe2',
    },
    error: {
      main: '#e78284',
    },
    warning: {
      main: '#e5c890',
    },
    info: {
      main: '#85c1dc',
    },
    success: {
      main: '#a6d189',
    },
    grey: {
      50: '#c6d0f5',
      100: '#b5bfe2',
      200: '#a5adce',
      300: '#949cbb',
      400: '#838ba7',
      500: '#737994',
      600: '#626880',
      700: '#51576d',
      800: '#414559',
      900: '#303446',
    },
  },
});

export default frappeTheme;
