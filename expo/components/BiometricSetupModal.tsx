import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, Platform } from 'react-native';
import { Fingerprint, Scan, X, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

interface BiometricSetupModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function BiometricSetupModal({ visible, onClose }: BiometricSetupModalProps) {
  const [biometricInfo, setBiometricInfo] = useState<{
    available: boolean;
    biometryType: string | null;
  }>({ available: false, biometryType: null });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    checkBiometricAvailability, 
    toggleBiometrics,
    useBiometrics
  } = useAuthStore();

  useEffect(() => {
    const checkBiometrics = async () => {
      if (Platform.OS !== 'web' && visible) {
        setIsLoading(true);
        try {
          const result = await checkBiometricAvailability();
          setBiometricInfo(result);
        } catch (error) {
          console.error('Error checking biometric availability:', error);
          setBiometricInfo({ available: false, biometryType: null });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    checkBiometrics();
  }, [visible, checkBiometricAvailability]);

  const handleToggleBiometrics = async (enabled: boolean) => {
    try {
      await toggleBiometrics(enabled);
      if (!enabled) {
        onClose();
      }
    } catch (error) {
      console.error('Error toggling biometrics:', error);
    }
  };

  const getBiometricIcon = () => {
    if (Platform.OS === 'android') {
      if (biometricInfo.biometryType === 'Face Recognition') {
        return <Scan size={60} color={Colors.dark.primary} />;
      }
      return <Fingerprint size={60} color={Colors.dark.primary} />;
    } else {
      if (biometricInfo.biometryType === 'FaceID') {
        return <Scan size={60} color={Colors.dark.primary} />;
      }
      return <Fingerprint size={60} color={Colors.dark.primary} />;
    }
  };

  const getBiometricDisplayName = () => {
    if (Platform.OS === 'android') {
      return biometricInfo.biometryType || 'Biometric';
    }
    return biometricInfo.biometryType || 'Biometric';
  };

  const getBiometricDescription = () => {
    if (Platform.OS === 'android') {
      switch (biometricInfo.biometryType) {
        case 'Face Recognition':
          return 'Use your face to unlock the app quickly and securely';
        case 'Fingerprint':
          return 'Use your fingerprint to unlock the app quickly and securely';
        case 'Iris':
          return 'Use your iris to unlock the app quickly and securely';
        default:
          return 'Use biometric authentication to unlock the app quickly and securely';
      }
    } else {
      switch (biometricInfo.biometryType) {
        case 'FaceID':
          return 'Use Face ID to unlock the app quickly and securely';
        case 'TouchID':
          return 'Use Touch ID to unlock the app quickly and securely';
        default:
          return 'Use biometric authentication to unlock the app quickly and securely';
      }
    }
  };

  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Pressable 
            style={styles.closeButton} 
            onPress={onClose}
            android_ripple={{ color: Colors.dark.text, borderless: true }}
          >
            <X size={24} color={Colors.dark.text} />
          </Pressable>
          
          <View style={styles.iconContainer}>
            {getBiometricIcon()}
          </View>
          
          <Text style={styles.title}>
            {getBiometricDisplayName()} Authentication
          </Text>
          
          {isLoading ? (
            <Text style={styles.description}>
              Checking biometric availability...
            </Text>
          ) : biometricInfo.available ? (
            <>
              <Text style={styles.description}>
                {getBiometricDescription()}
              </Text>
              
              <View style={styles.optionsContainer}>
                <Pressable 
                  style={[
                    styles.optionButton,
                    useBiometrics && styles.selectedOption
                  ]}
                  onPress={() => handleToggleBiometrics(true)}
                  android_ripple={{ color: Colors.dark.primary }}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.optionText}>Enable {getBiometricDisplayName()}</Text>
                    <Text style={styles.optionDescription}>
                      Sign in quickly and securely
                    </Text>
                  </View>
                  
                  {useBiometrics && (
                    <View style={styles.checkCircle}>
                      <Check size={16} color={Colors.dark.text} />
                    </View>
                  )}
                </Pressable>
                
                <Pressable 
                  style={[
                    styles.optionButton,
                    !useBiometrics && styles.selectedOption
                  ]}
                  onPress={() => handleToggleBiometrics(false)}
                  android_ripple={{ color: Colors.dark.primary }}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.optionText}>Use Password Only</Text>
                    <Text style={styles.optionDescription}>
                      Sign in with email and password
                    </Text>
                  </View>
                  
                  {!useBiometrics && (
                    <View style={styles.checkCircle}>
                      <Check size={16} color={Colors.dark.text} />
                    </View>
                  )}
                </Pressable>
              </View>
            </>
          ) : (
            <Text style={styles.description}>
              {biometricInfo.biometryType 
                ? `${biometricInfo.biometryType} is not set up on this device. Please set it up in your device settings.`
                : 'Biometric authentication is not available on this device.'}
            </Text>
          )}
          
          <Pressable 
            style={styles.doneButton} 
            onPress={onClose}
            android_ripple={{ color: Colors.dark.text }}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: '85%',
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  iconContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    color: Colors.dark.subtext,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  selectedOption: {
    borderColor: Colors.dark.primary,
    borderWidth: 1,
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  doneButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});