import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import subscriptionService from '../../services/subscriptionService';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const orderCode = params.get('orderCode');
    const code = params.get('code');
    const id = params.get('id');
    const cancel = params.get('cancel');

    const handleCallback = async () => {
      try {
        await subscriptionService.paymentCallback({ status, orderCode, code, id, cancel });
        navigate('/', { replace: true });
      } catch (err) {
        navigate('/', { replace: true });
      }
    };
    handleCallback();
  }, [location, navigate]);

  return <div>Processing payment...</div>;
} 