import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useUserStore } from '@/store/userStore';
import { birthdayNotificationService } from '@/services/birthdayNotificationService';
import { birthdayChecker } from '@/utils/birthdayChecker';

export function useBirthdayNotification() {
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const { 
    birthday, 
    checkBirthdayNotification, 
    markBirthdayNotificationShown,
    notificationPreferences 
  } = useUserStore();

  // Check for birthday on app start and when app becomes active
  useEffect(() => {
    const checkBirthday = () => {
      if (checkBirthdayNotification()) {
        setShowBirthdayModal(true);
        markBirthdayNotificationShown();
        
        // Send immediate notification if service is available
        birthdayNotificationService.sendImmediateBirthdayNotification();
      }
    };

    // Check immediately
    checkBirthday();

    // Check when app becomes active
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkBirthday();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [checkBirthdayNotification, markBirthdayNotificationShown]);

  // Initialize notification service and schedule notifications when birthday is set
  useEffect(() => {
    const initializeNotifications = async () => {
      await birthdayNotificationService.initialize();
      
      if (birthday && notificationPreferences.birthdayPromotions) {
        await birthdayNotificationService.scheduleBirthdayNotification(birthday);
      }
    };

    initializeNotifications();
    
    // Start daily birthday checking
    birthdayChecker.startDailyCheck();
    
    return () => {
      birthdayChecker.stopDailyCheck();
    };
  }, [birthday, notificationPreferences.birthdayPromotions]);

  // Daily check at midnight (for web and as backup)
  useEffect(() => {
    const checkAtMidnight = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const msUntilMidnight = tomorrow.getTime() - now.getTime();
      
      const timeoutId = setTimeout(() => {
        if (checkBirthdayNotification()) {
          setShowBirthdayModal(true);
          markBirthdayNotificationShown();
        }
        
        // Set up next day's check
        checkAtMidnight();
      }, msUntilMidnight);

      return timeoutId;
    };

    const timeoutId = checkAtMidnight();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [checkBirthdayNotification, markBirthdayNotificationShown]);

  return {
    showBirthdayModal,
    setShowBirthdayModal,
  };
}