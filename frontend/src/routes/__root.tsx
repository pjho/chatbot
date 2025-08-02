import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import frappeTheme from '../muiTheme';
import { NotificationProvider } from '../contexts/NotificationContext';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider theme={frappeTheme}>
      <CssBaseline />
      <NotificationProvider>
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </Box>
        <TanStackRouterDevtools />
      </NotificationProvider>
    </ThemeProvider>
  );
}
