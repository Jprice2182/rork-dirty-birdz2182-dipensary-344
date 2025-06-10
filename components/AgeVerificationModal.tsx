import { useState } from 'react';
import { View, Text, Modal, Platform, StyleSheet, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '@/constants/colors';
import appInfo from '@/constants/appInfo';

interface AgeVerificationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export function AgeVerificationModal({ isVisible, onClose, onVerified }: AgeVerificationModalProps) {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    setDate(currentDate);

    const age = calculateAge(currentDate);
    if (age >= appInfo.minAge) {
      onVerified();
    }
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
          <Text style={styles.title}>Age Verification Required</Text>
          <Text style={styles.subtitle}>
            You must be {appInfo.minAge} or older to use this app
          </Text>

          {Platform.OS === 'android' && (
            <Pressable
              style={styles.dateButton}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.dateButtonText}>
                Select Birth Date
              </Text>
            </Pressable>
          )}

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
            />
          )}

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    padding: 20,
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.subtext,
    marginBottom: 20,
    textAlign: 'center',
  },
  dateButton: {
    backgroundColor: Colors.dark.primary,
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
  },
  dateButtonText: {
    color: Colors.dark.text,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.dark.border,
    width: '100%',
  },
  closeText: {
    color: Colors.dark.text,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});