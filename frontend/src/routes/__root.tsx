import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ThemeProvider, CssBaseline } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import frappeTheme from '../muiTheme';
import { NotificationProvider } from '../contexts/NotificationContext';
import { MainLayout } from '../components/MainLayout';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const routerState = useRouterState();
  
  const conversationId = routerState.location.pathname.startsWith('/c/')
    ? routerState.location.pathname.split('/c/')[1]
    : null;

  return (
    <ThemeProvider theme={frappeTheme}>
      <CssBaseline />
      <NotificationProvider>
        <MainLayout conversationId={conversationId}>
          <Outlet />
        </MainLayout>
        {/* <TanStackRouterDevtools /> */}
      </NotificationProvider>
    </ThemeProvider>
  );
}
