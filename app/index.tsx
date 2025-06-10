import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';

export default function Index() {
  const { isVerified } = useUserStore();
  const { isAuthenticated } = useAuthStore();
  
  // Always redirect to tabs - age verification will be handled by the global modal
  // This ensures the age verification modal shows up immediately
  return <Redirect href="/(tabs)" />;
}