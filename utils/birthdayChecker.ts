import { useUserStore } from '@/store/userStore';

export class BirthdayChecker {
  private static instance: BirthdayChecker;
  private checkInterval: NodeJS.Timeout | null = null;

  static getInstance(): BirthdayChecker {
    if (!BirthdayChecker.instance) {
      BirthdayChecker.instance = new BirthdayChecker();
    }
    return BirthdayChecker.instance;
  }

  startDailyCheck() {
    // Check every hour for birthday
    this.checkInterval = setInterval(() => {
      this.checkBirthday();
    }, 60 * 60 * 1000); // 1 hour

    // Also check immediately
    this.checkBirthday();
  }

  stopDailyCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private checkBirthday() {
    const userStore = useUserStore.getState();
    
    if (!userStore.birthday || !userStore.notificationPreferences.birthdayPromotions) {
      return;
    }

    const today = new Date();
    const birthdayDate = new Date(userStore.birthday);
    const currentYear = today.getFullYear();

    // Check if today is the user's birthday
    const isBirthday = today.getMonth() === birthdayDate.getMonth() && 
                      today.getDate() === birthdayDate.getDate();

    // Check if we haven't shown the notification this year
    const hasNotShownThisYear = userStore.lastBirthdayNotificationYear !== currentYear;

    if (isBirthday && hasNotShownThisYear) {
      // Trigger birthday notification
      console.log('🎉 It\'s the user\'s birthday! Triggering notification...');
      
      // This would typically trigger a notification or modal
      // The actual implementation is handled by the useBirthdayNotification hook
      return true;
    }

    return false;
  }

  // Method to manually check if today is birthday (for testing)
  isTodayBirthday(): boolean {
    return this.checkBirthday() || false;
  }

  // Method to get days until next birthday
  getDaysUntilBirthday(): number | null {
    const userStore = useUserStore.getState();
    
    if (!userStore.birthday) {
      return null;
    }

    const today = new Date();
    const birthdayDate = new Date(userStore.birthday);
    const currentYear = today.getFullYear();
    
    // Set this year's birthday
    let thisYearBirthday = new Date(currentYear, birthdayDate.getMonth(), birthdayDate.getDate());
    
    // If this year's birthday has passed, calculate for next year
    if (thisYearBirthday < today) {
      thisYearBirthday = new Date(currentYear + 1, birthdayDate.getMonth(), birthdayDate.getDate());
    }

    const timeDiff = thisYearBirthday.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff;
  }

  // Method to format birthday countdown message
  getBirthdayCountdownMessage(): string | null {
    const days = this.getDaysUntilBirthday();
    
    if (days === null) {
      return null;
    }

    if (days === 0) {
      return '🎉 Happy Birthday! Claim your free gift today!';
    } else if (days === 1) {
      return '🎂 Your birthday is tomorrow! Don\'t forget about your free gift!';
    } else if (days <= 7) {
      return `🎈 Your birthday is in ${days} days! Get ready for your free gift!`;
    } else if (days <= 30) {
      return `🎁 Your birthday is in ${days} days!`;
    }

    return null;
  }
}

// Export singleton instance
export const birthdayChecker = BirthdayChecker.getInstance();