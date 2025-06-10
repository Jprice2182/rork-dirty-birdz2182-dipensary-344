import { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import AgeVerificationModal from '@/components/AgeVerificationModal';
import Colors from '@/constants/colors';

export default function Index() {
  const router = useRouter();
  const isVerified = useUserStore(state => state.isVerified);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isVerified && !hasNavigated) {
        setShowAgeVerification(true);
      } else if (isVerified && !hasNavigated) {
        setHasNavigated(true);
        router.replace('/(tabs)');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isVerified, hasNavigated, router]);

  const handleVerification = useCallback(() => {
    setShowAgeVerification(false);
    useUserStore.getState().setVerified(true);
    setHasNavigated(true);
    router.replace('/(tabs)');
  }, [router]);

  const handleClose = useCallback(() => {
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