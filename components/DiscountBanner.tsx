import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Tag, X, Sparkles, Zap } from 'lucide-react-native';
import Colors from '@/constants/colors';
import appInfo from '@/constants/appInfo';
import { useCartStore } from '@/store/cartStore';

interface DiscountBannerProps {
  onClose?: () => void;
  showEighthsPromo?: boolean;
}

export default function DiscountBanner({ onClose, showEighthsPromo = false }: DiscountBannerProps) {
  const router = useRouter();
  const { getEighthsPromotion } = useCartStore();
  const eighthsPromo = getEighthsPromotion();

  const handlePress = () => {
    if (showEighthsPromo) {
      router.push('/category/1'); // Navigate to flower category
    } else {
      router.push('/cart');
    }
  };

  const handleClose = (e: any) => {
    e.stopPropagation();
    onClose?.();
  };

  if (showEighthsPromo) {
    return (
      <View style={[styles.container, styles.eighthsContainer]}>
        <View style={styles.sparkleContainer}>
          <Zap size={16} color={Colors.dark.text} style={styles.sparkle1} />
          <Sparkles size={12} color={Colors.dark.text} style={styles.sparkle2} />
        </View>
        
        {onClose && (
          <View style={styles.closeButtonContainer}>
            <Pressable 
              style={styles.closeButton} 
              onPress={handleClose}
              hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
              accessibilityLabel="Close eighths promotion banner"
              accessibilityRole="button"
            >
              <X size={16} color={Colors.dark.text} />
            </Pressable>
          </View>
        )}
        
        <Pressable 
          style={({ pressed }) => [
            styles.mainContent,
            pressed && styles.pressed
          ]}
          onPress={handlePress}
          accessibilityLabel="Eighths promotion - buy 2 get 3rd for $1"
          accessibilityRole="button"
        >
          <View style={styles.iconContainer}>
            <Zap size={20} color={Colors.dark.text} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>⚡ {appInfo.eighthsPromotion.title}</Text>
            <Text style={styles.subtitle}>{appInfo.eighthsPromotion.subtitle}</Text>
            <Text style={styles.promoCode}>{appInfo.eighthsPromotion.description}</Text>
            {eighthsPromo.eligible && (
              <Text style={styles.activePromo}>
                🎉 Active in your cart! Saving ${eighthsPromo.savings.toFixed(2)}
              </Text>
            )}
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sparkleContainer}>
        <Sparkles size={16} color={Colors.dark.text} style={styles.sparkle1} />
        <Sparkles size={12} color={Colors.dark.text} style={styles.sparkle2} />
      </View>
      
      {onClose && (
        <View style={styles.closeButtonContainer}>
          <Pressable 
            style={styles.closeButton} 
            onPress={handleClose}
            hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
            accessibilityLabel="Close promotion banner"
            accessibilityRole="button"
          >
            <X size={16} color={Colors.dark.text} />
          </Pressable>
        </View>
      )}
      
      <Pressable 
        style={({ pressed }) => [
          styles.mainContent,
          pressed && styles.pressed
        ]}
        onPress={handlePress}
        accessibilityLabel="20% off first order promotion"
        accessibilityRole="button"
      >
        <View style={styles.iconContainer}>
          <Tag size={20} color={Colors.dark.text} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>🎉 WELCOME TO ATLANTA!</Text>
          <Text style={styles.subtitle}>20% OFF YOUR FIRST ORDER</Text>
          <Text style={styles.promoCode}>Use code "{appInfo.promoCode}" at checkout</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 16,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    padding: 18,
  },
  eighthsContainer: {
    backgroundColor: '#FF6B35', // Orange color for eighths promo
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  sparkle1: {
    position: 'absolute',
    top: 12,
    right: 50,
    opacity: 0.7,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    opacity: 0.5,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
    pointerEvents: 'box-none',
  },
  closeButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 14,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 40,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  subtitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  promoCode: {
    color: Colors.dark.text,
    fontSize: 12,
    opacity: 0.9,
    fontWeight: '500',
  },
  activePromo: {
    color: Colors.dark.text,
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 2,
    opacity: 0.95,
  },
});