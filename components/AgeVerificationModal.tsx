import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import Colors from '@/constants/colors';
import { useState } from 'react';

type AgeVerificationModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onVerified: () => void;
};

export function AgeVerificationModal({ isVisible, onClose, onVerified }: AgeVerificationModalProps) {
  const [isOver21, setIsOver21] = useState<boolean | null>(null);

  const handleVerification = () => {
    if (isOver21) {
      onVerified();
    }
  };

  const termsContainer = (
    <View style={styles.termsContainer}>
      <Text style={styles.termsTitle}>Terms & Privacy</Text>
      <Text style={styles.termsText}>
        By continuing, you agree to our{' '}
        <Link href="/terms" style={styles.termsLink}>Terms of Service</Link>
        {' '}and{' '}
        <Link href="/privacy" style={styles.termsLink}>Privacy Policy</Link>. 
        All your information is encrypted and we will not share your personal 
        information with anyone else. Your privacy and security are our top priority.
      </Text>
      
      <Text style={styles.encryptionText}>
        🔒 Everything is encrypted - Your data is secure
      </Text>
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Age Verification</Text>
          <Text style={styles.question}>Are you 21 or older?</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.button,
                isOver21 === true && styles.selectedButton
              ]}
              onPress={() => setIsOver21(true)}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.button,
                isOver21 === false && styles.selectedButton
              ]}
              onPress={() => setIsOver21(false)}
            >
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>

          {termsContainer}

          <TouchableOpacity 
            style={[styles.verifyButton, !isOver21 && styles.disabledButton]}
            onPress={handleVerification}
            disabled={!isOver21}
          >
            <Text style={styles.verifyButtonText}>
              {isOver21 === false ? "Sorry, you must be 21+" : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    minWidth: 100,
  },
  selectedButton: {
    backgroundColor: Colors.dark.primary,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  termsContainer: {
    marginVertical: 20,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.dark.primary,
    textDecorationLine: 'underline',
  },
  encryptionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  verifyButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});