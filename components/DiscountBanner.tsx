import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Tag, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import appInfo from '@/constants/appInfo';

interface DiscountBannerProps {
  onClose?: () => void;
}

export default function DiscountBanner({ onClose }: DiscountBannerProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push('/cart');
  };

  const handleClose = (e: any) => {
    e.stopPropagation();
    onClose?.();
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={handlePress}
    >
      <View style={styles.content}>
        <Tag size={20} color={Colors.dark.text} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>20% OFF YOUR FIRST ORDER</Text>
          <Text style={styles.subtitle}>Use code "{appInfo.promoCode}" at checkout!</Text>
        </View>
      </View>
      
      {onClose && (
        <Pressable 
          style={styles.closeButton} 
          onPress={handleClose}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <X size={18} color={Colors.dark.text} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  pressed: {
    opacity: 0.9,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 32,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.dark.text,
    fontSize: 14,
    opacity: 0.9,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
});