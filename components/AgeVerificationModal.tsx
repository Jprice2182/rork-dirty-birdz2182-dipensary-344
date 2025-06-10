import { useState, useEffect } from 'react';
import { View, Text, Modal, Platform, StyleSheet, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/constants/colors';

interface AgeVerificationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export function AgeVerificationModal({ 
  isVisible, 
  onClose, 
  onVerified 
}: AgeVerificationModalProps) {
  const [birthDate, setBirthDate] = useState<Date>(new Date(2000, 0, 1));
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [error, setError] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (birthDate) {
      setMonth(String(birthDate.getMonth() + 1).padStart(2, '0'));
      setDay(String(birthDate.getDate()).padStart(2, '0'));
      setYear(String(birthDate.getFullYear()));
    }
  }, [birthDate]);

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleVerify = () => {
    const age = calculateAge(birthDate);
    
    if (age < 21) {
      setError("You must be 21 or older to use this app");
      return;
    }
    
    setError("");
    onVerified();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate) {
      setBirthDate(selectedDate);
      setError("");
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Verify Your Age</Text>
          <Text style={styles.subtitle}>
            You must be 21 or older to use this app
          </Text>

          {Platform.OS === 'ios' ? (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              maximumDate={new Date()}
              style={styles.datePicker}
            />
          ) : (
            <View style={styles.androidDateContainer}>
              <Pressable
                style={styles.androidDateButton}
                onPress={() => setShowPicker(true)}
              >
                <Text style={styles.dateText}>
                  {`${month}/${day}/${year}`}
                </Text>
              </Pressable>

              {showPicker && (
                <DateTimePicker
                  value={birthDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>
          )}

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <Pressable style={styles.verifyButton} onPress={handleVerify}>
            <Text style={styles.verifyButtonText}>Verify Age</Text>
          </Pressable>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '90%',
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.light.text
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textDim,
    marginBottom: 24,
    textAlign: 'center'
  },
  datePicker: {
    width: '100%',
    height: 200
  },
  androidDateContainer: {
    width: '100%',
    marginBottom: 24
  },
  androidDateButton: {
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 8
  },
  dateText: {
    fontSize: 18,
    color: Colors.light.text,
    textAlign: 'center'
  },
  errorText: {
    color: Colors.light.error,
    marginBottom: 16,
    textAlign: 'center'
  },
  verifyButton: {
    width: '100%',
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 8,
    marginTop: 8
  },
  verifyButtonText: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center'
  }
});