import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout.js';

// Pages
import Homepage from '../pages/Homepage';
import Loginpage from '../pages/Loginpage';
import Blog from '../pages/Blog';

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
    path: '/blog',
    element: (
      <MainLayout>
        <Blog />
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
