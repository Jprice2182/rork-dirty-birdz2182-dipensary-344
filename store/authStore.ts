import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export interface AuthState {
  isAuthenticated: boolean;
  email: string;
  password: string;
  useBiometrics: boolean;
  hasSetupBiometrics: boolean;
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  authenticateWithBiometrics: () => Promise<boolean>;
  toggleBiometrics: (enabled: boolean) => void;
  checkBiometricAvailability: () => Promise<{
    available: boolean;
    biometryType: string | null;
  }>;
  deleteAccount: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      email: '',
      password: '',
      useBiometrics: false,
      hasSetupBiometrics: false,
      
      signIn: async (email: string, password: string) => {
        // In a real app, you would validate credentials against a backend
        // For this demo, we'll accept any non-empty email/password
        if (email.trim() && password.trim()) {
          set({ 
            isAuthenticated: true,
            email,
            password
          });
          return true;
        }
        return false;
      },
      
      signOut: () => {
        set({ 
          isAuthenticated: false,
          email: '',
          password: ''
        });
      },
      
      authenticateWithBiometrics: async () => {
        if (Platform.OS === 'web') {
          // Biometrics not supported on web
          return false;
        }
        
        try {
          const { available } = await get().checkBiometricAvailability();
          
          if (!available) {
            return false;
          }
          
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Authenticate to continue",
            fallbackLabel: "Use password",
            disableDeviceFallback: false,
            ...(Platform.OS === 'android' && {
              cancelLabel: "Cancel",
              subtitle: "Use your biometric to sign in",
            }),
          });
          
          if (result.success) {
            set({ isAuthenticated: true });
            return true;
          }
          
          return false;
        } catch (error) {
          console.error("Biometric authentication error:", error);
          return false;
        }
      },
      
      toggleBiometrics: (enabled: boolean) => {
        set({ 
          useBiometrics: enabled,
          hasSetupBiometrics: enabled ? true : get().hasSetupBiometrics
        });
      },
      
      checkBiometricAvailability: async () => {
        if (Platform.OS === 'web') {
          return { available: false, biometryType: null };
        }
        
        try {
          const hasHardware = await LocalAuthentication.hasHardwareAsync();
          const isEnrolled = await LocalAuthentication.isEnrolledAsync();
          const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
          
          let biometryType = null;
          
          if (Platform.OS === 'android') {
            // Android-specific biometric type detection
            if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
              biometryType = 'Face Recognition';
            } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
              biometryType = 'Fingerprint';
            } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
              biometryType = 'Iris';
            }
          } else {
            // iOS-specific biometric type detection
            if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
              biometryType = 'FaceID';
            } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
              biometryType = 'TouchID';
            }
          }
          
          return {
            available: hasHardware && isEnrolled,
            biometryType
          };
        } catch (error) {
          console.error("Error checking biometric availability:", error);
          return { available: false, biometryType: null };
        }
      },
      
      deleteAccount: () => {
        set({
          isAuthenticated: false,
          email: '',
          password: '',
          useBiometrics: false,
          hasSetupBiometrics: false
        });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);