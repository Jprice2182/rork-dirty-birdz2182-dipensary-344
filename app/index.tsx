import { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import AgeVerificationModal from '@/components/AgeVerificationModal';
import Colors from '@/constants/colors';

export default function Index() {
  const router = useRouter();
  const isVerified = useUserStore(state => state.isVerified);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [showAgeVerification, setShowAgeVerification] = useState(false);

  useEffect(() => {
    console.log('Index: isVerified =', isVerified, 'isAuthenticated =', isAuthenticated);
    
    if (!isVerified) {
      setShowAgeVerification(true);
    } else if (isVerified && isAuthenticated) {
      // Navigate to tabs after verification
      console.log('Index: Navigating to tabs');
      router.replace('/(tabs)');
    }
  }, [isVerified, isAuthenticated, router]);

  const handleVerification = useCallback(() => {
    console.log('Index: Age verification completed');
    setShowAgeVerification(false);
    useUserStore.getState().setVerified(true);
    
    // Navigate to tabs immediately after verification
    setTimeout(() => {
      console.log('Index: Navigating to tabs after verification');
      router.replace('/(tabs)');
    }, 100);
  }, [router]);

  const handleClose = useCallback(() => {
    console.log('Index: Age verification modal closed without verification');
    setShowAgeVerification(false);
  }, []);

  return (
    <View style={styles.container}>
      <AgeVerificationModal 
        isVisible={showAgeVerification}
        onClose={handleClose}
        onVerified={handleVerification}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
});