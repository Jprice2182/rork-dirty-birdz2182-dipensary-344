import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, LogIn, UserPlus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import { AgeVerificationModal } from '@/components/AgeVerificationModal';
import appInfo from '@/constants/appInfo';

export default function Index() {
  const router = useRouter();
  const isVerified = useUserStore(state => state.isVerified);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [showAgeVerification, setShowAgeVerification] = useState(!isVerified);

  const handleVerification = useCallback(() => {
    setShowAgeVerification(false);
    useUserStore.getState().setVerified(true);
  }, []);

  // If user is verified and authenticated, go to tabs
  if (isVerified && isAuthenticated) {
    router.replace('/(tabs)');
    return null;
  }

  // If user is verified but not authenticated, show auth options
  if (isVerified && !isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?q=80&w=1000' }} 
            style={styles.logo}
          />
          <Text style={styles.appName}>{appInfo.name}</Text>
          <Text style={styles.slogan}>{appInfo.slogan}</Text>
          <Text style={styles.description}>
            Premium cannabis delivery in Atlanta. Quality products, fast delivery, exceptional service.
          </Text>
        </View>

        <View style={styles.authContainer}>
          <Text style={styles.authTitle}>Get Started</Text>
          <Text style={styles.authSubtitle}>Sign in to your account or create a new one</Text>

          <Pressable 
            style={styles.authButton}
            onPress={() => router.push('/sign-in')}
          >
            <LogIn size={20} color={Colors.dark.text} />
            <Text style={styles.authButtonText}>Sign In</Text>
          </Pressable>

          <Pressable 
            style={[styles.authButton, styles.secondaryButton]}
            onPress={() => router.push('/sign-up')}
          >
            <UserPlus size={20} color={Colors.dark.primary} />
            <Text style={[styles.authButtonText, styles.secondaryButtonText]}>Create Account</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    );
  }

  // If user is not verified, show age verification requirement
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?q=80&w=1000' }} 
          style={styles.logo}
        />
        <Text style={styles.appName}>{appInfo.name}</Text>
        <Text style={styles.slogan}>{appInfo.slogan}</Text>
        <Text style={styles.description}>
          Premium cannabis delivery in Atlanta. Quality products, fast delivery, exceptional service.
        </Text>
      </View>

      <View style={styles.verificationContainer}>
        <Calendar size={60} color={Colors.dark.primary} />
        <Text style={styles.verificationTitle}>Age Verification Required</Text>
        <Text style={styles.verificationSubtitle}>
          You must be 21 years or older to access this app
        </Text>
        
        <Pressable 
          style={styles.verifyButton}
          onPress={() => setShowAgeVerification(true)}
        >
          <Text style={styles.verifyButtonText}>Verify My Age</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This app contains content related to cannabis products which are restricted to adults 21 and older
        </Text>
      </View>

      <AgeVerificationModal 
        isVisible={showAgeVerification} 
        onClose={() => setShowAgeVerification(false)}
        onVerified={handleVerification}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  appName: {
    color: Colors.dark.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  slogan: {
    color: Colors.dark.primary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    color: Colors.dark.subtext,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  verificationContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  verificationTitle: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  verificationSubtitle: {
    color: Colors.dark.subtext,
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  verifyButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  authContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  authTitle: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  authSubtitle: {
    color: Colors.dark.subtext,
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  authButton: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.dark.primary,
  },
  authButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: Colors.dark.primary,
  },
  footer: {
    marginBottom: 40,
  },
  footerText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});