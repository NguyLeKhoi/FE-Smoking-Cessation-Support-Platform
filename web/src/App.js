import { RouterProvider } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { routes } from './router/Router';

function App() {
  return (
    <>
      <CssBaseline />
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
