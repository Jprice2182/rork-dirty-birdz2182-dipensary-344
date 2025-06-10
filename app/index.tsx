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
    console.log('Index: isVerified =', isVerified, 'hasNavigated =', hasNavigated);
    
    if (!isVerified && !hasNavigated) {
      console.log('Index: Showing age verification modal');
      setShowAgeVerification(true);
    } else if (isVerified && !hasNavigated) {
      console.log('Index: User is verified, navigating to tabs');
      setHasNavigated(true);
      router.replace('/(tabs)');
    }
  }, [isVerified, hasNavigated, router]);

  const handleVerification = useCallback(() => {
    console.log('Index: Age verification completed');
    setShowAgeVerification(false);
    
    // Set verified in store
    useUserStore.getState().setVerified(true);
    
    // Navigate immediately
    console.log('Index: Navigating to tabs after verification');
    setHasNavigated(true);
    router.replace('/(tabs)');
  }, [router]);

  const handleClose = useCallback(() => {
    console.log('Index: Age verification modal closed without verification');
    setShowAgeVerification(false);
  }, []);

  // Don't render anything if we've already navigated
  if (hasNavigated) {
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