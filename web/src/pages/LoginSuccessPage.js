import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');

    if (accessToken) {
      // Store the access token (e.g., in localStorage)
      localStorage.setItem('accessToken', accessToken);
      console.log('Access token stored:', accessToken);

      // Redirect to the homepage
      navigate('/', { replace: true });
    } else {
      // Handle case where access token is not found (e.g., show an error or redirect to login)
      console.error('No access token found in URL.');
      navigate('/login', { replace: true }); // Redirect back to login
    }
  }, [navigate, location]);

  // You can render a loading message or spinner while processing
  return (
    <div>
      <p>Processing login...</p>
    </div>
  );
} 