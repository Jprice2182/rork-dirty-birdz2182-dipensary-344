import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useUserStore } from '@/store/userStore';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class BirthdayNotificationService {
  private static instance: BirthdayNotificationService;
  private isInitialized = false;

  static getInstance(): BirthdayNotificationService {
    if (!BirthdayNotificationService.instance) {
      BirthdayNotificationService.instance = new BirthdayNotificationService();
    }
    return BirthdayNotificationService.instance;
  }

  async initialize() {
    if (this.isInitialized || Platform.OS === 'web') {
      return;
    }

    try {
      // Request permissions for notifications
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return;
      }

      this.isInitialized = true;
      console.log('Birthday notification service initialized');
    } catch (error) {
      console.error('Failed to initialize birthday notification service:', error);
    }
  }

  async scheduleBirthdayNotification(birthday: string) {
    if (Platform.OS === 'web' || !this.isInitialized) {
      return;
    }

    try {
      // Cancel any existing birthday notifications
      await this.cancelBirthdayNotifications();

      const birthdayDate = new Date(birthday);
      const currentYear = new Date().getFullYear();
      
      // Schedule notification for this year's birthday
      const thisYearBirthday = new Date(currentYear, birthdayDate.getMonth(), birthdayDate.getDate(), 10, 0, 0);
      
      // If this year's birthday has passed, schedule for next year
      if (thisYearBirthday < new Date()) {
        thisYearBirthday.setFullYear(currentYear + 1);
      }

      // Calculate seconds until birthday
      const now = new Date();
      const secondsUntilBirthday = Math.floor((thisYearBirthday.getTime() - now.getTime()) / 1000);
      
      if (secondsUntilBirthday > 0) {
        // Schedule the notification using seconds
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🎉 Happy Birthday!',
            body: 'Claim your free 1g pre-roll birthday gift with your next Dirty Birdz2182 delivery order!',
            data: { type: 'birthday_promotion' },
          },
          trigger: {
            seconds: secondsUntilBirthday,
          } as any,
          identifier: `birthday_notification_${thisYearBirthday.getFullYear()}`,
        });
      }

      // Schedule for next year as well
      const nextYearBirthday = new Date(thisYearBirthday);
      nextYearBirthday.setFullYear(thisYearBirthday.getFullYear() + 1);
      const secondsUntilNextYear = Math.floor((nextYearBirthday.getTime() - now.getTime()) / 1000);
      
      if (secondsUntilNextYear > 0) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🎉 Happy Birthday!',
            body: 'Claim your free 1g pre-roll birthday gift with your next Dirty Birdz2182 delivery order!',
            data: { type: 'birthday_promotion' },
          },
          trigger: {
            seconds: secondsUntilNextYear,
          } as any,
          identifier: `birthday_notification_${nextYearBirthday.getFullYear()}`,
        });
      }

      console.log('Birthday notifications scheduled for:', thisYearBirthday, 'and', nextYearBirthday);
    } catch (error) {
      console.error('Failed to schedule birthday notification:', error);
    }
  }

  async cancelBirthdayNotifications() {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      // Cancel all scheduled notifications that start with 'birthday_notification'
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const birthdayNotifications = scheduledNotifications.filter(
        notification => notification.identifier.startsWith('birthday_notification')
      );
      
      for (const notification of birthdayNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
      
      console.log('Birthday notifications cancelled');
    } catch (error) {
      console.error('Failed to cancel birthday notifications:', error);
    }
  }

  checkTodayIsBirthday(): boolean {
    const userStore = useUserStore.getState();
    return userStore.checkBirthdayNotification();
  }

  async sendImmediateBirthdayNotification() {
    if (Platform.OS === 'web' || !this.isInitialized) {
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎂 It\'s Your Birthday!',
          body: 'Don\'t forget to claim your free 1g pre-roll gift today!',
          data: { type: 'birthday_promotion_reminder' },
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Failed to send immediate birthday notification:', error);
    }
  }
}

// Export singleton instance
export const birthdayNotificationService = BirthdayNotificationService.getInstance();