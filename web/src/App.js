import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from './theme/theme';
import { routes } from './router/Router';
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SocketProvider>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <RouterProvider router={routes} />
        </LocalizationProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
