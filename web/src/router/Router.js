import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import AuthLayout from '../layout/AuthLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import QuitPlanMainLayout from '../layout/QuitPlanMainLayout';
import AdminLayout from '../layout/AdminLayout';

//auth
import Loginpage from '../pages/auth/Loginpage';
import Signuppage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import LoginSuccessPage from '../pages/auth/LoginSuccessPage';
import RegisterCoachPage from '../pages/auth/RegisterCoachPage';

//main
import Homepage from '../pages/main/Homepage';
import BlogDetails from '../pages/blog/BlogDetails';
import SmokingQuizPage from '../pages/main/SmokingQuizPage';
import HabitCheckPage from '../pages/main/HabitCheckPage';
import PaymentSuccessPage from '../pages/main/PaymentSuccessPage';
import PaymentCancelPage from '../pages/main/PaymentCancelPage';


//profile
import ProfilePage from '../pages/profile/ProfilePage';
import MyBlogPage from '../pages/profile/MyBlogPage';
import LeaderBoardPage from '../pages/profile/LeaderBoardPage';
import SmokingHabitPage from '../pages/profile/SmokingHabitPage';
import SubscriptionPage from '../pages/main/SubscriptionPage';
import NotificationsPage from '../components/profilePage/NotificationsPage';
import VisitUserProfile from '../pages/profile/VisitUserProfile';

//achievements
import AchievementsPage from '../pages/achievements/AchivementsPage';

//membership
import MembershipPlansPage from '../pages/main/MembershipPlansPage';


//blog
import Blog from '../pages/blog/Blog';
import EditBlogPage from '../pages/blog/EditBlogPage';
import CreateBlogPage from '../pages/blog/CreateBlogPage';

//quit-plan
import QuitPlanPage from '../pages/quit-plans/QuitPlanPage';
import QuitPlanResultPage from '../pages/quit-plans/QuitPlanDetailPage';
import PhaseRecordPage from '../pages/quit-plans/PhaseRecordPage';

//coach
import CoachListPage from '../pages/coach/CoachListPage';

//chat
import ChatPage from '../pages/chat/ChatPage';

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

  //auth
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

  //blog
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
    path: '/blog/create',
    element: (
      <ProtectedRoute>
        <MainLayout showFooter={false} >
          <CreateBlogPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },

  //profile
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
    path: '/subscription',
    element: (
      <ProtectedRoute requireMembership={false}>
        <MainLayout showHeader={false} showFooter={true}>
          <SubscriptionPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/achievements',
    element: (
      <MainLayout showFooter={false} showHeader={false} >
        <AchievementsPage />
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
    path: '/leaderboard',
    element: (
      <ProtectedRoute>
        <MainLayout showHeader={false} showFooter={false}>
          <LeaderBoardPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },

  {
    path: '/my-smoking-habit',
    element: (
      <ProtectedRoute>
        <MainLayout showHeader={false} showFooter={false}>
          <SmokingHabitPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <MainLayout showHeader={false} showFooter={false}>
          <NotificationsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },



  //quiz & quit plan
  {
    path: '/smoking-quiz',
    element: (
      <AuthLayout>
        <SmokingQuizPage />
      </AuthLayout>
    ),
  },
  {
    path: '/habit-check',
    element: (
      <AuthLayout>
        <HabitCheckPage />
      </AuthLayout>
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

  //payment & membership

  {
    path: '/payment/success',
    element: <PaymentSuccessPage />,
  },
  {
    path: '/payment/cancel',
    element: <PaymentCancelPage />,
  },
  {
    path: '/membership-plans',
    element: (
      <MainLayout>
        <MembershipPlansPage />
      </MainLayout>
    ),
  },

  //coach
  {
    path: '/coaches-list',
    element: (
      <ProtectedRoute requireMembership={true}>
        <MainLayout>
          <CoachListPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },

  {
    path: '/chat-page',
    element: (
      <ProtectedRoute requireMembership={true}>
        <MainLayout showHeader={false} showFooter={false}>
          <ChatPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },

  // Admin Routes
  {
    path: '/admin/*',
    element: (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/register-coach',
    element: (
      <AuthLayout>
        <RegisterCoachPage />
      </AuthLayout>
    ),
  },
  {
    path: '*',
    element: (
      <NotFoundPage />
    ),
  },
]);
