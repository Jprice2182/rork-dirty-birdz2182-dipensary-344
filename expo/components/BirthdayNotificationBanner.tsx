import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Animated } from 'react-native';
import { PartyPopper, Gift, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { birthdayChecker } from '@/utils/birthdayChecker';

interface BirthdayNotificationBannerProps {
  onPress?: () => void;
}

export default function BirthdayNotificationBanner({ onPress }: BirthdayNotificationBannerProps) {
  const { birthday, notificationPreferences } = useUserStore();
  const [message, setMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (!birthday || !notificationPreferences.birthdayPromotions) {
      setIsVisible(false);
      return;
    }

    const countdownMessage = birthdayChecker.getBirthdayCountdownMessage();
    
    if (countdownMessage) {
      setMessage(countdownMessage);
      setIsVisible(true);
      
      // Animate in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setIsVisible(false);
    }
  }, [birthday, notificationPreferences.birthdayPromotions, fadeAnim]);

  // Update message every hour
  useEffect(() => {
    const interval = setInterval(() => {
      if (birthday && notificationPreferences.birthdayPromotions) {
        const countdownMessage = birthdayChecker.getBirthdayCountdownMessage();
        setMessage(countdownMessage);
        
        if (!countdownMessage && isVisible) {
          handleDismiss();
        }
      }
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, [birthday, notificationPreferences.birthdayPromotions, isVisible]);

  const handleDismiss = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
    });
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  if (!isVisible || !message) {
    return null;
  }

  const isBirthdayToday = birthdayChecker.getDaysUntilBirthday() === 0;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Pressable 
        style={[styles.banner, isBirthdayToday && styles.birthdayBanner]} 
        onPress={handlePress}
        android_ripple={{ color: Colors.dark.primary }}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            {isBirthdayToday ? (
              <PartyPopper size={24} color={Colors.dark.primary} />
            ) : (
              <Gift size={24} color={Colors.dark.primary} />
            )}
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.message, isBirthdayToday && styles.birthdayMessage]}>
              {message}
            </Text>
            {isBirthdayToday && (
              <Text style={styles.actionText}>Tap to claim your free 1g pre-roll!</Text>
            )}
          </View>
        </View>
        
        <Pressable 
          style={styles.dismissButton} 
          onPress={handleDismiss}
          android_ripple={{ color: Colors.dark.text, borderless: true }}
        >
          <X size={20} color={Colors.dark.subtext} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  banner: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    overflow: 'hidden',
  },
  birthdayBanner: {
    backgroundColor: `${Colors.dark.primary}20`,
    borderColor: Colors.dark.primary,
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  birthdayMessage: {
    color: Colors.dark.primary,
    fontWeight: '600',
  },
  actionText: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  dismissButton: {
    padding: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
});