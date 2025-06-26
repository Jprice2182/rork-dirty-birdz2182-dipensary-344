import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Image, ActivityIndicator, Platform, BackHandler } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Mail, Lock, Fingerprint, Scan } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import appInfo from '@/constants/appInfo';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [biometricInfo, setBiometricInfo] = useState<{
    available: boolean;
    biometryType: string | null;
  }>({ available: false, biometryType: null });
  
  const { 
    signIn, 
    authenticateWithBiometrics, 
    checkBiometricAvailability,
    useBiometrics
  } = useAuthStore();
  
  const { isVerified } = useUserStore();

  // Redirect if not verified - must verify age first
  useEffect(() => {
    if (!isVerified) {
      router.replace('/');
      return;
    }
  }, [isVerified, router]);

  // Android back button handling
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backAction = () => {
        if (!isVerified) {
          router.replace('/');
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }
  }, [isVerified, router]);

  useEffect(() => {
    const checkBiometrics = async () => {
      if (Platform.OS !== 'web') {
        try {
          const result = await checkBiometricAvailability();
          setBiometricInfo(result);
        } catch (error) {
          console.error('Error checking biometric availability:', error);
          setBiometricInfo({ available: false, biometryType: null });
        }
      }
    };
    
    checkBiometrics();
  }, [checkBiometricAvailability]);

  const handleSignIn = async () => {
    if (isLoading) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      const success = await signIn(email.trim(), password);
      
      if (success) {
        router.replace('/(tabs)');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during sign in');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    if (isLoading) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      const success = await authenticateWithBiometrics();
      
      if (success) {
        router.replace('/(tabs)');
      } else {
        setError('Biometric authentication failed');
      }
    } catch (err) {
      setError('An error occurred during biometric authentication');
      console.error('Biometric auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getBiometricIcon = () => {
    if (Platform.OS === 'android') {
      if (biometricInfo.biometryType === 'Face Recognition') {
        return <Scan size={24} color={Colors.dark.text} />;
      }
      return <Fingerprint size={24} color={Colors.dark.text} />;
    } else {
      if (biometricInfo.biometryType === 'FaceID') {
        return <Scan size={24} color={Colors.dark.text} />;
      }
      return <Fingerprint size={24} color={Colors.dark.text} />;
    }
  };

  const getBiometricDisplayName = () => {
    return biometricInfo.biometryType || 'Biometric';
  };

  const isFormValid = email.trim().length > 0 && password.trim().length > 0;
  const showBiometricButton = Platform.OS !== 'web' && biometricInfo.available && useBiometrics;

  // Don't render if not verified - age verification required first
  if (!isVerified) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?q=80&w=1000' }} 
          style={styles.logo}
        />
        <Text style={styles.appName}>{appInfo.name}</Text>
        <Text style={styles.slogan}>{appInfo.slogan}</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign In</Text>
        
        <View style={styles.inputContainer}>
          <Mail size={20} color={Colors.dark.subtext} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.dark.subtext}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            editable={!isLoading}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Lock size={20} color={Colors.dark.subtext} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.dark.subtext}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
            onSubmitEditing={handleSignIn}
          />
        </View>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <Pressable 
          style={[
            styles.signInButton, 
            (!isFormValid || isLoading) && styles.disabledButton
          ]}
          onPress={handleSignIn}
          disabled={!isFormValid || isLoading}
          android_ripple={{ color: Colors.dark.text }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.dark.text} />
          ) : (
            <Text style={styles.signInButtonText}>Sign In</Text>
          )}
        </Pressable>
        
        {showBiometricButton && (
          <Pressable 
            style={[styles.biometricButton, isLoading && styles.disabledButton]}
            onPress={handleBiometricAuth}
            disabled={isLoading}
            android_ripple={{ color: Colors.dark.primary }}
          >
            {getBiometricIcon()}
            <Text style={styles.biometricButtonText}>
              Sign in with {getBiometricDisplayName()}
            </Text>
          </Pressable>
        )}
        
        <View style={styles.linksContainer}>
          <Link href="/sign-up" asChild>
            <Pressable 
              disabled={isLoading}
              android_ripple={{ color: Colors.dark.primary, borderless: true }}
              style={styles.linkButton}
            >
              <Text style={[styles.linkText, isLoading && styles.disabledText]}>
                Create Account
              </Text>
            </Pressable>
          </Link>
          
          <Link href="/forgot-password" asChild>
            <Pressable 
              disabled={isLoading}
              android_ripple={{ color: Colors.dark.primary, borderless: true }}
              style={styles.linkButton}
            >
              <Text style={[styles.linkText, isLoading && styles.disabledText]}>
                Forgot Password?
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
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
    marginTop: Platform.OS === 'android' ? 60 : 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  appName: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  slogan: {
    color: Colors.dark.primary,
    fontSize: 16,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    ...(Platform.OS === 'android' && {
      elevation: 1,
    }),
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    color: Colors.dark.text,
    fontSize: 16,
    ...(Platform.OS === 'android' && {
      paddingVertical: 16,
    }),
  },
  errorText: {
    color: Colors.dark.error,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  signInButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    ...(Platform.OS === 'android' && {
      elevation: 2,
    }),
  },
  disabledButton: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  biometricButton: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    overflow: 'hidden',
    ...(Platform.OS === 'android' && {
      elevation: 1,
    }),
  },
  biometricButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    marginLeft: 12,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  linkButton: {
    padding: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  linkText: {
    color: Colors.dark.primary,
    fontSize: 14,
  },
  disabledText: {
    opacity: 0.6,
  },
  footer: {
    marginBottom: Platform.OS === 'android' ? 32 : 24,
  },
  footerText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});