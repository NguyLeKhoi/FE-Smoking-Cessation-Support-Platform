import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import { fetchCurrentUser } from '../services/userService';
import { toast } from 'react-toastify';
import LoadingPage from '../pages/LoadingPage';

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requireMembership = false 
}) {
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);
  const [userData, setUserData] = React.useState({
    isAdmin: false,
    isMember: false
  });

  React.useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetchCurrentUser();
        const user = response.data?.data || response.data || {};
        
        setUserData({
          isAdmin: user.role === 'admin',
          isMember: user.isMember === true || user.role === 'coach'
        });
      } catch (error) {
        console.error('Error checking user status:', error);
        toast.error('Can not check user status');
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [requireAdmin, requireMembership]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated()) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !userData.isAdmin) {
    // Redirect to home if not admin
    toast.error('You do not have permission to this page');
    return <Navigate to="/" replace />;
  }

  if (requireMembership && !userData.isMember && userData.role !== 'coach') {
    // Redirect to subscription page if membership is required, user is not a coach, and not a member
    toast.error('Please subscribe to a membership plan to access this feature');
    return <Navigate to="/membership-plans" replace />;
  }

  return children;
}