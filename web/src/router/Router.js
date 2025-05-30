import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout.js';
import AuthLayout from '../layout/AuthLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
import Homepage from '../pages/Homepage';
import Loginpage from '../pages/Loginpage';
import Blog from '../pages/Blog';
import Signuppage from '../pages/SignupPage';
import ProfilePage from '../pages/ProfilePage';

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
      <AuthLayout>
        <Loginpage />
      </AuthLayout>
    ),
  },
  {
    path: '/signup',
    element: (
      <AuthLayout>
        <Signuppage />
      </AuthLayout>
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
    path: '/profile',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <ProfilePage />
        </MainLayout>
      </ProtectedRoute>
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
