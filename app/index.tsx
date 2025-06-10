import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import AgeVerificationModal from '@/components/AgeVerificationModal';

export default function Index() {
  const router = useRouter();
  const isVerified = useUserStore(state => state.isVerified);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [showAgeVerification, setShowAgeVerification] = useState(false);

  useEffect(() => {
    if (!isVerified) {
      setShowAgeVerification(true);
    }
  }, [isVerified]);

  const handleVerification = useCallback(() => {
    setShowAgeVerification(false);
    useUserStore.getState().setVerified(true);
  }, []);

  useEffect(() => {
    if (isVerified && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isVerified, isAuthenticated, router]);

  return (
    <AgeVerificationModal 
      isVisible={showAgeVerification}
      onClose={() => setShowAgeVerification(false)}
      onVerified={handleVerification}
    />
  );
}