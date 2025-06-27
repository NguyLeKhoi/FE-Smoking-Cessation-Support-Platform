import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import motivationService from '../../services/motivationService';

const MotivationService = ({ setNotifications }) => {
  const [loadingMotivation, setLoadingMotivation] = useState(false);

  useEffect(() => {
    const fetchMotivationMessage = async () => {
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

      // Hiển thị toast nếu cần
      let messageText = '';
      if (shouldShowToast) {
        // Lấy từ API vừa fetch hoặc cache
        const fullMessage = shouldFetch
          ? (sessionStorage.getItem('motivationMessage') || '')
          : cachedMotivation;
        messageText = fullMessage;
        let timestampText = '';

        // Regex to find and extract the timestamp pattern at the very end
        const timestampExtractionRegex = /(?:\s*(?:and|at)?\s*)?(\d{1,2}:\d{2}:\d{2}\s\d{1,2}\/\d{1,2}\/\d{4})$/;
        const match = fullMessage.match(timestampExtractionRegex);

        if (match) {
          messageText = fullMessage.replace(match[0], '').trim();
        }

        // Add to notifications state for the dropdown
        setNotifications((prevNotifications) => [
          { id: Date.now(), message: messageText, timestamp: timestampText, read: false },
          ...prevNotifications,
        ]);

        toast.custom((t) => (
          <div
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: '#333',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '16px',
              maxWidth: '500px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginBottom: '8px', textAlign: 'center' }}>
              Zerotine Motivation Message
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>{messageText}</span>
            </div>
          </div>
        ), {
          duration: 7000,
          position: 'top-center',
        });
      }
    };

    fetchMotivationMessage();

    // Set up interval for subsequent fetches
    const intervalId = setInterval(fetchMotivationMessage, 7200000);

    return () => {
      clearInterval(intervalId);
    };
  }, [setNotifications]);

  return { loadingMotivation };
};

export default MotivationService;