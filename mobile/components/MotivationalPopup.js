import { useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';
import motivationService from '../service/motivationService';

const MotivationalPopup = () => {
  const timerRef = useRef();

  useEffect(() => {
    const showMotivation = async () => {
      try {
        const res = await motivationService.getMotivationMessage();
        const message = res?.data?.message || res?.message || res?.data || 'A smoke-free life is a healthier life. You can do it!';
        Toast.show({
          type: 'info',
          text1: message,
          position: 'top',
          visibilityTime: 6000,
        });
      } catch {
        Toast.show({
          type: 'info',
          text1: 'A smoke-free life is a healthier life. You can do it!',
          position: 'top',
          visibilityTime: 6000,
        });
      }
    };

    // Hiện lần đầu khi vào app
    showMotivation();

    // Lặp lại mỗi 2 tiếng (2 * 60 * 60 * 1000 ms)
    timerRef.current = setInterval(showMotivation, 2 * 60 * 60 * 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  return null;
};

export default MotivationalPopup; 