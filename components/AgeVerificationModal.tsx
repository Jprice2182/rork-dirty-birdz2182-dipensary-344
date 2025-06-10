import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { Link } from 'expo-router';
import Colors from '@/constants/colors';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import appInfo from '@/constants/appInfo';

type AgeVerificationModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onVerified: () => void;
};

export function AgeVerificationModal({ isVisible, onClose, onVerified }: AgeVerificationModalProps) {
  const [birthDate, setBirthDate] = useState<Date>(new Date(2000, 0, 1));
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [error, setError] = useState('');

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || birthDate;
    setShowPicker(Platform.OS === 'ios');
    setBirthDate(currentDate);
    setError('');
  };

  const handleVerification = () => {
    const age = calculateAge(birthDate);
    
    if (age < appInfo.minAge) {
      setError(`Sorry, you must be ${appInfo.minAge} or older to use this app`);
      return;
    }
    
    if (age > 100) {
      setError('Please enter a valid birth date');
      return;
    }
    
    onVerified();
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };

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
          <Text style={styles.question}>
            Please enter your date of birth to verify your age
          </Text>

          {Platform.OS === 'ios' ? (
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                testID="dateTimePicker"
                value={birthDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            </View>
          ) : (
            <>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={showDatepicker}
              >
                <Text style={styles.dateButtonText}>
                  {format(birthDate, 'MMMM d, yyyy')}
                </Text>
              </TouchableOpacity>

              {showPicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={birthDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                />
              )}
            </>
          )}

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

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

          <TouchableOpacity 
            style={styles.verifyButton}
            onPress={handleVerification}
          >
            <Text style={styles.verifyButtonText}>Verify Age</Text>
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
    backgroundColor: Colors.dark.card,
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
    color: Colors.dark.text,
  },
  question: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.dark.text,
  },
  datePickerContainer: {
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  dateButton: {
    backgroundColor: Colors.dark.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 18,
    color: Colors.dark.text,
    fontWeight: '600',
  },
  errorText: {
    color: Colors.dark.error,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  termsContainer: {
    marginVertical: 20,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: Colors.dark.text,
  },
  termsText: {
    fontSize: 14,
    color: Colors.dark.subtext,
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.dark.primary,
    textDecorationLine: 'underline',
  },
  encryptionText: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginTop: 10,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  verifyButtonText: {
    color: Colors.dark.text,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});