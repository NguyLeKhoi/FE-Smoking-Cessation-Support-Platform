import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import AuthLayout from '../layout/AuthLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
import Homepage from '../pages/Homepage';
import Loginpage from '../pages/Loginpage';
import Blog from '../pages/Blog';
import Signuppage from '../pages/SignupPage';
import ProfilePage from '../pages/ProfilePage';
import LoginSuccessPage from '../pages/LoginSuccessPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import SmokingQuizPage from '../pages/SmokingQuizPage';

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
    path: '/login/success',
    element: (
      <AuthLayout>
        <LoginSuccessPage />
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
        <MainLayout showFooter={false}>
          <ProfilePage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <AuthLayout>
        <ForgotPasswordPage />
      </AuthLayout>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <AuthLayout>
        <ResetPasswordPage />
      </AuthLayout>
    ),
  },
  {
    path: '/smoking-quiz',
    element: (
      <AuthLayout>
        <SmokingQuizPage />
      </AuthLayout>
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
