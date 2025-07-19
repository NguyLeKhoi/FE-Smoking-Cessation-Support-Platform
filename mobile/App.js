import React, { useEffect } from 'react';
import Navigator from './navigation/Navigator';
import { startAutoRefresh, stopAutoRefresh, debugTokenStatus, testRefreshToken } from './service/api';

export default function App() {
  useEffect(() => {
    // Initialize auto refresh token on app start with a small delay
    // to ensure AsyncStorage is ready
    const initializeApp = async () => {
      try {
        // Debug token status
        await debugTokenStatus();
        
        // Test refresh token functionality
        await testRefreshToken();
        
        await startAutoRefresh();
      } catch (error) {
        // Silent error handling
      }
    };

    // Small delay to ensure AsyncStorage is ready
    const timer = setTimeout(initializeApp, 100);
    
    // Cleanup on app unmount
    return () => {
      clearTimeout(timer);
      stopAutoRefresh();
    };
  }, []);

  return (
    <Navigator/>
  );
}


