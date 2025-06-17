import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import { fetchCurrentUser } from '../services/userService';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (requireAdmin) {
        try {
          const response = await fetchCurrentUser();
          setIsAdmin(response.data.role === 'admin');
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [requireAdmin]);

  if (loading) {
    return null; // or a loading spinner if you prefer
  }

  if (!isAuthenticated()) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  return children;
} 