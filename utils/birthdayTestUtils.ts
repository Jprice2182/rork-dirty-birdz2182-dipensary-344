import { useUserStore } from '@/store/userStore';

export class BirthdayTestUtils {
  /**
   * Set user's birthday to today for testing birthday notifications
   */
  static setTodayAsBirthday() {
    const today = new Date();
    const birthdayString = today.toISOString();
    
    const userStore = useUserStore.getState();
    userStore.setBirthday(birthdayString);
    
    // Reset birthday notification tracking so it shows again
    userStore.resetBirthdayPromotion();
    
    console.log('🎂 Birthday set to today for testing:', today.toLocaleDateString());
  }

  /**
   * Set user's birthday to tomorrow for testing countdown
   */
  static setTomorrowAsBirthday() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const birthdayString = tomorrow.toISOString();
    
    const userStore = useUserStore.getState();
    userStore.setBirthday(birthdayString);
    userStore.resetBirthdayPromotion();
    
    console.log('🎈 Birthday set to tomorrow for testing:', tomorrow.toLocaleDateString());
  }

  /**
   * Set user's birthday to next week for testing countdown
   */
  static setNextWeekAsBirthday() {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const birthdayString = nextWeek.toISOString();
    
    const userStore = useUserStore.getState();
    userStore.setBirthday(birthdayString);
    userStore.resetBirthdayPromotion();
    
    console.log('🎁 Birthday set to next week for testing:', nextWeek.toLocaleDateString());
  }

  /**
   * Set user's birthday to a random date in the past (for normal state)
   */
  static setRandomPastBirthday() {
    const today = new Date();
    const year = today.getFullYear() - 25; // 25 years old
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1; // Safe day range
    
    const birthday = new Date(year, month, day);
    const birthdayString = birthday.toISOString();
    
    const userStore = useUserStore.getState();
    userStore.setBirthday(birthdayString);
    userStore.resetBirthdayPromotion();
    
    console.log('📅 Birthday set to random past date for testing:', birthday.toLocaleDateString());
  }

  /**
   * Reset birthday notification tracking (allows notification to show again)
   */
  static resetBirthdayNotificationTracking() {
    const userStore = useUserStore.getState();
    userStore.resetBirthdayPromotion();
    
    console.log('🔄 Birthday notification tracking reset');
  }

  /**
   * Enable birthday notifications
   */
  static enableBirthdayNotifications() {
    const userStore = useUserStore.getState();
    userStore.updateNotificationPreference('birthdayPromotions', true);
    
    console.log('🔔 Birthday notifications enabled');
  }

  /**
   * Disable birthday notifications
   */
  static disableBirthdayNotifications() {
    const userStore = useUserStore.getState();
    userStore.updateNotificationPreference('birthdayPromotions', false);
    
    console.log('🔕 Birthday notifications disabled');
  }

  /**
   * Get current birthday info for debugging
   */
  static getBirthdayInfo() {
    const userStore = useUserStore.getState();
    const { 
      birthday, 
      lastBirthdayNotificationYear, 
      hasBirthdayPromotionThisYear,
      notificationPreferences 
    } = userStore;

    const info = {
      birthday: birthday ? new Date(birthday).toLocaleDateString() : 'Not set',
      lastNotificationYear: lastBirthdayNotificationYear,
      hasPromotionThisYear: hasBirthdayPromotionThisYear,
      notificationsEnabled: notificationPreferences.birthdayPromotions,
      shouldShowNotification: userStore.checkBirthdayNotification()
    };

    console.log('🎂 Birthday Info:', info);
    return info;
  }

  /**
   * Simulate birthday notification check
   */
  static testBirthdayCheck() {
    const userStore = useUserStore.getState();
    const shouldShow = userStore.checkBirthdayNotification();
    
    console.log('🧪 Birthday notification check result:', shouldShow);
    return shouldShow;
  }
}

// Make it available globally for easy testing in development
if (__DEV__) {
  (global as any).BirthdayTestUtils = BirthdayTestUtils;
  console.log('🧪 BirthdayTestUtils available globally for testing');
  console.log('Usage examples:');
  console.log('- BirthdayTestUtils.setTodayAsBirthday()');
  console.log('- BirthdayTestUtils.setTomorrowAsBirthday()');
  console.log('- BirthdayTestUtils.getBirthdayInfo()');
}