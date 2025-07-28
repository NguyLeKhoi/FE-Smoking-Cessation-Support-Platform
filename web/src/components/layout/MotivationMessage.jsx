import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Lottie from 'lottie-react';
import bouncingCatAnimation from '../../assets/animations/bouncing-black-cat.json';
import motivationService from '../../services/motivationService';

const MotivationService = ({ setNotifications }) => {
  const [loadingMotivation, setLoadingMotivation] = useState(false);
  const intervalId = useRef(null);

  useEffect(() => {
    // Check if user is logged in - if not, don't do anything
    const checkAuthAndSetup = () => {
      const isLoggedIn = !!localStorage.getItem('accessToken');
      if (!isLoggedIn) {
        // Clear any existing intervals and return early
        if (intervalId.current) {
          clearInterval(intervalId.current);
          intervalId.current = null;
        }
        return false;
      }
      return true;
    };

    // Initial check
    if (!checkAuthAndSetup()) return;

    const fetchMotivationMessage = async () => {
      // Check auth again before showing any toasts
      if (!checkAuthAndSetup()) return;
      const lastMotivationToastTimestamp = sessionStorage.getItem('lastMotivationToastTimestamp');
      const cachedMotivation = sessionStorage.getItem('motivationMessage');
      const twoHoursInMs = 7200000; // 2 hours
      const currentTime = new Date().getTime();

      let shouldFetch = true;
      let shouldShowToast = true;

      if (lastMotivationToastTimestamp && cachedMotivation) {
        const timeElapsed = currentTime - parseInt(lastMotivationToastTimestamp, 10);
        if (timeElapsed < twoHoursInMs) {
          shouldFetch = false;
          shouldShowToast = false; // Less than 2 hours, don't show toast
        }
      }

      if (shouldFetch) {
        setLoadingMotivation(true);
        try {
          const data = await motivationService.getMotivationMessage();
          if (data && data.data && data.data.message) {
            sessionStorage.setItem('motivationMessage', data.data.message);
            sessionStorage.setItem('lastMotivationToastTimestamp', currentTime.toString());
          }
        } catch (error) {
          console.error('Failed to fetch motivation message:', error);
        } finally {
          setLoadingMotivation(false);
        }
      }

      // Show toast if needed
      let messageText = '';
      if (shouldShowToast) {
        const fullMessage = shouldFetch
          ? (sessionStorage.getItem('motivationMessage') || '')
          : cachedMotivation;
        messageText = fullMessage;
        // Remove timestamp if present
        const timestampExtractionRegex = /(?:\s*(?:and|at)?\s*)?(\d{1,2}:\d{2}:\d{2}\s\d{1,2}\/\d{1,2}\/\d{4})$/;
        const match = fullMessage.match(timestampExtractionRegex);
        if (match) {
          messageText = fullMessage.replace(match[0], '').trim();
        }
        setNotifications((prevNotifications) => [
          { id: Date.now(), message: messageText, timestamp: '', read: false },
          ...prevNotifications,
        ]);
        toast.info(
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '8px 0' }}>
            <Lottie animationData={bouncingCatAnimation} loop autoplay style={{ width: 80, height: 80 }} />
            <div style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: 4, textAlign: 'center' }}>Zerotine Motivation Message</div>
            <span style={{ textAlign: 'center' }}>{messageText}</span>
          </div>,
          {
            autoClose: 7000,
            position: 'top-right',
            closeOnClick: true,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
            style: { background: '#fff', color: '#222', borderRadius: 10, boxShadow: '0 3px 10px rgba(0,0,0,0.08)', width: 420, minWidth: 320 },
            icon: false,
          }
        );
      }
    };
    // Initial fetch after a short delay to ensure auth state is set
    const initialDelay = 2000; // 2 seconds delay
    const initialTimer = setTimeout(() => {
      if (checkAuthAndSetup()) {
        fetchMotivationMessage();
        // Set up interval for subsequent fetches
        intervalId.current = setInterval(fetchMotivationMessage, 7200000); // 2 hours
      }
    }, initialDelay);

    // Cleanup function
    return () => {
      clearTimeout(initialTimer);
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [setNotifications]);

  return { loadingMotivation };
};

export default MotivationService;