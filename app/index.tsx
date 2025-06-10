import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';

export default function Index() {
  const { isVerified } = useUserStore();
  const { isAuthenticated } = useAuthStore();
  
  // Always show age verification first if not verified
  if (!isVerified) {
    return <Redirect href="/(tabs)" />;
  }
  
  // If user is verified but not authenticated, redirect to sign in
  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }
  
  // If user is verified and authenticated, redirect to home
  return <Redirect href="/(tabs)" />;
}