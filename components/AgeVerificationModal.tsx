import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, TextInput, Alert } from 'react-native';
import Colors from '@/constants/colors';
import appInfo from '@/constants/appInfo';
import { useUserStore } from '@/store/userStore';

interface AgeVerificationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function AgeVerificationModal({ isVisible, onClose, onVerified }: AgeVerificationModalProps) {
  const [birthday, setBirthday] = useState('');
  const [showBirthdayInput, setShowBirthdayInput] = useState(false);
  const setBirthdayInStore = useUserStore(state => state.setBirthday);

  const handleYes = () => {
    setShowBirthdayInput(true);
  };

  const handleNo = () => {
    onClose();
  };

  const validateAge = (birthdayString: string): boolean => {
    if (!birthdayString) return false;
    
    const birthDate = new Date(birthdayString);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= appInfo.minAge;
    }
    
    return age >= appInfo.minAge;
  };

  const handleBirthdaySubmit = () => {
    if (!birthday.trim()) {
      Alert.alert('Birthday Required', 'Please enter your birthday to continue.');
      return;
    }

    if (!validateAge(birthday)) {
      Alert.alert(
        'Age Verification Failed', 
        `You must be ${appInfo.minAge} or older to use this app.`
      );
      return;
    }

    setBirthdayInStore(birthday);
    onVerified();
  };

  const handleBackToBirthday = () => {
    setShowBirthdayInput(false);
    setBirthday('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {!showBirthdayInput ? (
            <>
              <Text style={styles.title}>Age Verification Required</Text>
              <Text style={styles.subtitle}>
                You must be {appInfo.minAge} or older to use this app.
              </Text>
              <Text style={styles.question}>
                Are you {appInfo.minAge} years of age or older?
              </Text>

              <View style={styles.buttonContainer}>
                <Pressable style={styles.noButton} onPress={handleNo}>
                  <Text style={styles.noButtonText}>No</Text>
                </Pressable>
                
                <Pressable style={styles.yesButton} onPress={handleYes}>
                  <Text style={styles.yesButtonText}>Yes</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Enter Your Birthday</Text>
              <Text style={styles.subtitle}>
                We need your birthday to verify your age and provide birthday promotions.
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Birthday (MM/DD/YYYY)</Text>
                <TextInput
                  style={styles.input}
                  value={birthday}
                  onChangeText={setBirthday}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor={Colors.dark.subtext}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>

              <View style={styles.buttonContainer}>
                <Pressable style={styles.backButton} onPress={handleBackToBirthday}>
                  <Text style={styles.backButtonText}>Back</Text>
                </Pressable>
                
                <Pressable style={styles.submitButton} onPress={handleBirthdaySubmit}>
                  <Text style={styles.submitButtonText}>Continue</Text>
                </Pressable>
              </View>
            </>
          )}

          <Text style={styles.disclaimer}>
            {appInfo.legalDisclaimer}
          </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    width: '90%',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.subtext,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  question: {
    fontSize: 18,
    color: Colors.dark.text,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  noButton: {
    flex: 1,
    backgroundColor: Colors.dark.error,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  noButtonText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  yesButton: {
    flex: 1,
    backgroundColor: Colors.dark.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  yesButtonText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.dark.subtext,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.dark.background,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.dark.text,
  },
  backButton: {
    flex: 1,
    backgroundColor: Colors.dark.border,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.dark.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
});