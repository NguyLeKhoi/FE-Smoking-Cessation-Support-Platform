import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import AuthLayout from '../layout/AuthLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages

//auth
import Loginpage from '../pages/auth/Loginpage';
import Signuppage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import LoginSuccessPage from '../pages/auth/LoginSuccessPage';

//main
import Homepage from '../pages/main/Homepage';
import BlogDetails from '../components/blog/BlogDetails';
import ProfilePage from '../pages/main/ProfilePage';
import SmokingQuizPage from '../pages/main/SmokingQuizPage';
import MembershipPlansPage from '../pages/main/MembershipPlansPage';

//blog
import Blog from '../pages/blog/Blog';
import MyBlogPage from '../pages/blog/MyBlogPage';
import EditBlogPage from '../pages/blog/EditBlogPage';

//admin
import AdminDashboard from '../pages/admin/AdminDashboard';

import NotFoundPage from '../pages/NotFoundPage';
import LoadingPage from '../pages/LoadingPage';

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
    path: '/blog/:id',
    element: (
      <MainLayout showFooter={false} >
        <BlogDetails />
      </MainLayout>
    ),
  },
  {
    path: '/my-blog',
    element: (
      <ProtectedRoute>
        <MyBlogPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/blog/edit/:postId',
    element: (
      <ProtectedRoute>
        <MainLayout showFooter={false} showHeader={false} >
          <EditBlogPage />
        </MainLayout>
      </ProtectedRoute>
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
