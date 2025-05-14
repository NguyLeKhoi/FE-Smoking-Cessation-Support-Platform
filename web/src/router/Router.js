import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout.js';

// Pages
import Homepage from '../pages/Homepage';
import Loginpage from '../pages/Loginpage';

export const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout>
        <Homepage />
      </MainLayout>
    ),
  },
  {
    path: '/login',
    element: (
      <MainLayout showHeader={false} showFooter={false}>
        <Loginpage />
      </MainLayout>
    ),
  },
  {
    path: '*',
    element: (
      <MainLayout showHeader={false}>
        <div>404 Not Found</div>
      </MainLayout>
    ),
  },
]);
