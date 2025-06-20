import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import AuthLayout from '../layout/AuthLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import QuitPlanLayout from '../layout/QuitPlanLayout';

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
import MembershipPlansPage from '../pages/MembershipPlansPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoadingPage from '../pages/LoadingPage';
import AdminDashboard from '../pages/AdminDashboard';
import QuitPlanPage from '../pages/QuitPlanPages/QuitPlanPage';
import QuitPlanResultPage from '../pages/QuitPlanPages/QuitPlanResultPage';

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
        <MainLayout showHeader={false} showFooter={false}>
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
    path: '/membership-plans',
    element: (
      <MainLayout showFooter={false}>
        <MembershipPlansPage />
      </MainLayout>
    ),
  },
  {
    path: '/loading-test',
    element: (
      <AuthLayout>
        <LoadingPage />
      </AuthLayout>
    ),
  },
  {
    path: '/quit-plan',
    element: (
      <ProtectedRoute>
        <QuitPlanLayout>
          <QuitPlanPage />
        </QuitPlanLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/quit-plan/result',
    element: (
      <ProtectedRoute>
        <QuitPlanLayout>
          <QuitPlanResultPage />
        </QuitPlanLayout>
      </ProtectedRoute>
    ),
  },
  // Admin Routes
  {
    path: '/admin/*',
    element: (
      <ProtectedRoute requireAdmin={true}>
        <MainLayout>
          <AdminDashboard />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <MainLayout showHeader={false}>
        <NotFoundPage />
      </MainLayout>
    ),
  },
]);
