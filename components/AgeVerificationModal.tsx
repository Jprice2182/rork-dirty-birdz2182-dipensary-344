import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, TextInput, Alert, Image, Platform } from 'react-native';
import { Calendar, AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import appInfo from '@/constants/appInfo';

interface AgeVerificationModalProps {
  visible: boolean;
  onClose?: () => void;
}

export default function AgeVerificationModal({ visible, onClose }: AgeVerificationModalProps) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [underageError, setUnderageError] = useState(false);
  
  const { setVerified } = useUserStore();

  // Reset form when modal becomes visible
  useEffect(() => {
    if (visible) {
      setDay('');
      setMonth('');
      setYear('');
      setError('');
      setUnderageError(false);
    }
  }, [visible]);

  const verifyAge = () => {
    setError('');
    setUnderageError(false);
    
    // Basic validation
    if (!day || !month || !year) {
      setError('Please enter your complete date of birth');
      return;
    }
    
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    // Check if numbers are valid
    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
      setError('Please enter valid numbers');
      return;
    }
    
    // Check if month is valid (1-12)
    if (monthNum < 1 || monthNum > 12) {
      setError('Please enter a valid month (1-12)');
      return;
    }
    
    // Check if day is valid for the given month
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    if (dayNum < 1 || dayNum > daysInMonth) {
      setError(`Please enter a valid day (1-${daysInMonth} for month ${monthNum})`);
      return;
    }
    
    // Check if year is reasonable
    const currentYear = new Date().getFullYear();
    if (yearNum < 1900 || yearNum > currentYear) {
      setError('Please enter a valid year');
      return;
    }
    
    // Create date objects for birth date and current date
    const birthDate = new Date(yearNum, monthNum - 1, dayNum);
    const today = new Date();
    
    // Check if date is valid
    if (isNaN(birthDate.getTime())) {
      setError('Please enter a valid date');
      return;
    }
    
    // Check if birth date is in the future
    if (birthDate > today) {
      setError('Birth date cannot be in the future');
      return;
    }
    
    // Calculate age precisely
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday has not occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Check if user is at least 21 years old
    if (age < 21) {
      setUnderageError(true);
      return;
    }
    
    // Age verified - set verified status
    console.log('Age verification successful, setting verified to true');
    setVerified(true);
    onClose?.();
  };

  // Handle text input changes with validation
  const handleDayChange = (text: string) => {
    // Only allow numbers and limit to 2 digits
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 2) {
      setDay(cleaned);
    }
  };

  const handleMonthChange = (text: string) => {
    // Only allow numbers and limit to 2 digits
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 2) {
      setMonth(cleaned);
    }
  };

  const handleYearChange = (text: string) => {
    // Only allow numbers and limit to 4 digits
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 4) {
      setYear(cleaned);
    }
  };

  // Auto-focus next field when current field is filled
  const handleDayComplete = (text: string) => {
    if (text.length === 2 && monthInputRef) {
      monthInputRef.focus();
    }
  };

  const handleMonthComplete = (text: string) => {
    if (text.length === 2 && yearInputRef) {
      yearInputRef.focus();
    }
  };

  // References for input fields
  let monthInputRef: TextInput | null = null;
  let yearInputRef: TextInput | null = null;

  // Don't render if not visible
  if (!visible) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      statusBarTranslucent
    >
      <View style={styles.centeredView}>
        {!underageError ? (
          <View style={styles.modalView}>
            <Calendar size={40} color={Colors.dark.primary} style={styles.icon} />
            
            <Text style={styles.title}>Age Verification Required</Text>
            <Text style={styles.subtitle}>
              Welcome to {appInfo.name}
            </Text>
            <Text style={styles.description}>
              You must be 21 years or older to access this app. Please verify your age to continue.
            </Text>
            
            <Text style={styles.label}>Enter your date of birth:</Text>
            
            <View style={styles.dateInputContainer}>
              <TextInput
                style={styles.dateInput}
                placeholder="DD"
                placeholderTextColor={Colors.dark.subtext}
                keyboardType="number-pad"
                maxLength={2}
                value={day}
                onChangeText={handleDayChange}
                onEndEditing={(e) => handleDayComplete(e.nativeEvent.text)}
                returnKeyType="next"
              />
              <Text style={styles.dateSeparator}>/</Text>
              <TextInput
                ref={(ref) => { monthInputRef = ref; }}
                style={styles.dateInput}
                placeholder="MM"
                placeholderTextColor={Colors.dark.subtext}
                keyboardType="number-pad"
                maxLength={2}
                value={month}
                onChangeText={handleMonthChange}
                onEndEditing={(e) => handleMonthComplete(e.nativeEvent.text)}
                returnKeyType="next"
              />
              <Text style={styles.dateSeparator}>/</Text>
              <TextInput
                ref={(ref) => { yearInputRef = ref; }}
                style={styles.yearInput}
                placeholder="YYYY"
                placeholderTextColor={Colors.dark.subtext}
                keyboardType="number-pad"
                maxLength={4}
                value={year}
                onChangeText={handleYearChange}
                returnKeyType="done"
                onSubmitEditing={verifyAge}
              />
            </View>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <Pressable
              style={[styles.verifyButton, (!day || !month || !year) && styles.disabledButton]}
              onPress={verifyAge}
              disabled={!day || !month || !year}
            >
              <Text style={styles.verifyButtonText}>Verify Age</Text>
            </Pressable>
            
            <Text style={styles.disclaimer}>
              By entering, you agree to our Terms of Service and Privacy Policy. This app is only for users 21 years and older.
            </Text>
          </View>
        ) : (
          <View style={styles.errorModalView}>
            <AlertTriangle size={60} color={Colors.dark.error} style={styles.errorIcon} />
            
            <Text style={styles.errorTitle}>Access Denied</Text>
            <Text style={styles.errorSubtitle}>
              You must be 21 years or older to access this app.
            </Text>
            
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=1000' }} 
              style={styles.errorImage} 
            />
            
            <Text style={styles.errorMessage}>
              We apologize, but due to legal requirements, we cannot allow users under 21 to access this application. This app contains content related to cannabis products which are restricted to adults 21 and older.
            </Text>
            
            <Pressable
              style={styles.exitButton}
              onPress={() => {
                // Reset the form to allow retry
                setDay('');
                setMonth('');
                setYear('');
                setUnderageError(false);
                setError('');
                
                if (Platform.OS === 'android') {
                  Alert.alert(
                    "Age Verification Required",
                    "This app is only for users 21 and older. Please verify your correct age.",
                    [{ text: "OK" }]
                  );
                }
              }}
            >
              <Text style={styles.exitButtonText}>Try Again</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 20,
  },
  modalView: {
    width: '100%',
    maxWidth: 400,
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
  errorModalView: {
    width: '100%',
    maxWidth: 400,
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
  icon: {
    marginBottom: 16,
  },
  errorIcon: {
    marginBottom: 16,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.dark.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    color: Colors.dark.subtext,
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorTitle: {
    color: Colors.dark.error,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    color: Colors.dark.subtext,
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  errorMessage: {
    color: Colors.dark.text,
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  label: {
    color: Colors.dark.text,
    fontSize: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
    fontWeight: '600',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dateInput: {
    backgroundColor: Colors.dark.background,
    color: Colors.dark.text,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: 60,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  yearInput: {
    backgroundColor: Colors.dark.background,
    color: Colors.dark.text,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: 80,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  dateSeparator: {
    color: Colors.dark.text,
    fontSize: 20,
    marginHorizontal: 8,
  },
  errorText: {
    color: Colors.dark.error,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: Colors.dark.subtext,
    opacity: 0.6,
  },
  verifyButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  exitButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  exitButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    color: Colors.dark.subtext,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});