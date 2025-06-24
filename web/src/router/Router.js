import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import AuthLayout from '../layout/AuthLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import QuitPlanMainLayout from '../layout/QuitPlanMainLayout';

//auth
import Loginpage from '../pages/auth/Loginpage';
import Signuppage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import LoginSuccessPage from '../pages/auth/LoginSuccessPage';

//main
import Homepage from '../pages/main/Homepage';
import Blog from '../pages/main/Blog';
import ProfilePage from '../pages/main/ProfilePage';
import SmokingQuizPage from '../pages/main/SmokingQuizPage';

//membership
import MembershipPlansPage from '../pages/main/MembershipPlansPage';

//quit-plan
import QuitPlanPage from '../pages/quit-plans/QuitPlanPage';
import QuitPlanResultPage from '../pages/quit-plans/QuitPlanResultPage';
import PhaseRecordPage from '../pages/quit-plans/PhaseRecordPage';
import PlanRecordPage from '../pages/quit-plans/PlanRecordPage';

//admin
import AdminDashboard from '../pages/admin/AdminDashboard';

//404
import NotFoundPage from '../pages/NotFoundPage';


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
      <MainLayout showFooter={false} >
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
    path: '/quit-plan',
    element: (
      <ProtectedRoute>
        <QuitPlanMainLayout>
          <QuitPlanPage />
        </QuitPlanMainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/quit-plan/:id',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <QuitPlanResultPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/quit-plan/:planId/phase/:phaseId',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <PhaseRecordPage />
        </MainLayout>
      </ProtectedRoute>
    ), 
  },
  {
    path: '/quit-plan/:planId/phase/all',
    element: (
      <ProtectedRoute>
        <MainLayout>
        <PlanRecordPage />
        </MainLayout>
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
