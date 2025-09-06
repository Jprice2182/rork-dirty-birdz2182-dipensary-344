import { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import AgeVerificationModal from '@/components/AgeVerificationModal';
import Colors from '@/constants/colors';

export default function Index() {
  const router = useRouter();
  const isVerified = useUserStore(state => state.isVerified);
  const birthday = useUserStore(state => state.birthday);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    // Check verification status and birthday requirement
    if (isVerified && birthday && !hasNavigated) {
      setHasNavigated(true);
      router.replace('/(tabs)');
      return;
    }

    // Show age verification if not verified or no birthday
    if ((!isVerified || !birthday) && !hasNavigated) {
      const timer = setTimeout(() => {
        setShowAgeVerification(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVerified, birthday, hasNavigated, router]);

  const handleVerification = useCallback(() => {
    setShowAgeVerification(false);
    useUserStore.getState().setVerified(true);
    setHasNavigated(true);
    router.replace('/(tabs)');
  }, [router]);

  const handleClose = useCallback(() => {
    setShowAgeVerification(false);
  }, []);

  // If already verified and has birthday, don't render anything while navigating
  if (isVerified && birthday && hasNavigated) {
    return null;
  }

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