import React, { useEffect } from 'react';
import Navigator from './navigation/Navigator';
import { startAutoRefresh, stopAutoRefresh, debugTokenStatus, testRefreshToken } from './service/api';
import MotivationalPopup from './components/MotivationalPopup';
import Toast from 'react-native-toast-message';
import { View, Text } from 'react-native';

const CustomToast = (props) => (
  <View style={{
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    margin: 8,
    elevation: 6,
    minWidth: 280,
    maxWidth: 420,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  }}>
    <Text style={{
      fontWeight: '900',
      fontSize: 20,
      color: 'black',
      marginBottom: 6,
      textAlign: 'center',
    }}>
      Zerotine Motivation Message
    </Text>
    <Text style={{
      color: '#222',
      fontSize: 15,
      textAlign: 'center',
      fontWeight: '500',
      lineHeight: 22,
    }}>
      {props.text1}
    </Text>
  </View>
);

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
    <>
      <MotivationalPopup />
      <Navigator />
      <Toast config={{ info: (props) => <CustomToast {...props} /> }} />
    </>
  );
}


