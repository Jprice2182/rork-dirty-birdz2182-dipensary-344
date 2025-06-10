import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, TextInput, Alert, Image, Platform, ScrollView } from 'react-native';
import { Calendar, AlertTriangle, Check, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import appInfo from '@/constants/appInfo';

interface AgeVerificationModalProps {
  visible: boolean;
  onClose?: () => void;
}

export default function AgeVerificationModal({ visible, onClose }: AgeVerificationModalProps) {
  const [step, setStep] = useState<'checkbox' | 'terms' | 'dateInput'>('checkbox');
  const [isOver21, setIsOver21] = useState<boolean | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [underageError, setUnderageError] = useState(false);
  
  const { setVerified } = useUserStore();

  // Reset form when modal becomes visible
  useEffect(() => {
    if (visible) {
      setStep('checkbox');
      setIsOver21(null);
      setAgreeToTerms(false);
      setDay('');
      setMonth('');
      setYear('');
      setError('');
      setUnderageError(false);
    }
  }, [visible]);

  const handleAgeSelection = (over21: boolean) => {
    setIsOver21(over21);
    setError('');
    
    if (!over21) {
      setUnderageError(true);
      return;
    }
    
    setStep('terms');
  };

  const handleTermsAgreement = () => {
    if (!agreeToTerms) {
      setError('You must agree to our Terms of Service and Privacy Policy to continue');
      return;
    }
    
    setError('');
    setStep('dateInput');
  };

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
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 2) {
      setDay(cleaned);
    }
  };

  const handleMonthChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 2) {
      setMonth(cleaned);
    }
  };

  const handleYearChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 4) {
      setYear(cleaned);
    }
  };

  // Auto-focus next field when current field is filled
  const handleMonthComplete = (text: string) => {
    if (text.length === 2 && dayInputRef) {
      dayInputRef.focus();
    }
  };

  const handleDayComplete = (text: string) => {
    if (text.length === 2 && yearInputRef) {
      yearInputRef.focus();
    }
  };

  // References for input fields
  let dayInputRef: TextInput | null = null;
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
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.centeredView}
        keyboardShouldPersistTaps="handled"
      >
        {!underageError ? (
          <View style={styles.modalView}>
            <Calendar size={40} color={Colors.dark.primary} style={styles.icon} />
            
            <Text style={styles.title}>Age Verification Required</Text>
            <Text style={styles.subtitle}>
              Welcome to {appInfo.name}
            </Text>
            
            {step === 'checkbox' && (
              <>
                <Text style={styles.description}>
                  You must be 21 years or older to access this app. Please confirm your age to continue.
                </Text>
                
                <Text style={styles.questionText}>Are you 21 years of age or older?</Text>
                
                <View style={styles.checkboxContainer}>
                  <Pressable
                    style={[
                      styles.checkboxOption,
                      isOver21 === true && styles.selectedOption
                    ]}
                    onPress={() => handleAgeSelection(true)}
                  >
                    <View style={[
                      styles.checkbox,
                      isOver21 === true && styles.checkedBox
                    ]}>
                      {isOver21 === true && <Check size={16} color={Colors.dark.text} />}
                    </View>
                    <Text style={styles.checkboxText}>Yes, I am 21 or older</Text>
                  </Pressable>
                  
                  <Pressable
                    style={[
                      styles.checkboxOption,
                      isOver21 === false && styles.selectedOption
                    ]}
                    onPress={() => handleAgeSelection(false)}
                  >
                    <View style={[
                      styles.checkbox,
                      isOver21 === false && styles.checkedBox
                    ]}>
                      {isOver21 === false && <X size={16} color={Colors.dark.text} />}
                    </View>
                    <Text style={styles.checkboxText}>No, I am under 21</Text>
                  </Pressable>
                </View>
                
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </>
            )}
            
            {step === 'terms' && (
              <>
                <Text style={styles.description}>
                  Before proceeding, please review and agree to our terms.
                </Text>
                
                <View style={styles.termsContainer}>
                  <Text style={styles.termsTitle}>Terms & Privacy</Text>
                  <Text style={styles.termsText}>
                    By continuing, you agree to our Terms of Service and Privacy Policy. 
                    All your information is encrypted and we will not share your personal 
                    information with anyone else. Your privacy and security are our top priority.
                  </Text>
                  
                  <Text style={styles.encryptionText}>
                    🔒 Everything is encrypted - Your data is secure
                  </Text>
                </View>
                
                <Pressable
                  style={[
                    styles.checkboxOption,
                    agreeToTerms && styles.selectedOption
                  ]}
                  onPress={() => setAgreeToTerms(!agreeToTerms)}
                >
                  <View style={[
                    styles.checkbox,
                    agreeToTerms && styles.checkedBox
                  ]}>
                    {agreeToTerms && <Check size={16} color={Colors.dark.text} />}
                  </View>
                  <Text style={styles.checkboxText}>
                    I agree to the Terms of Service and Privacy Policy
                  </Text>
                </Pressable>
                
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                
                <Pressable
                  style={[styles.continueButton, !agreeToTerms && styles.disabledButton]}
                  onPress={handleTermsAgreement}
                  disabled={!agreeToTerms}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                </Pressable>
                
                <Pressable
                  style={styles.backButton}
                  onPress={() => setStep('checkbox')}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </Pressable>
              </>
            )}
            
            {step === 'dateInput' && (
              <>
                <Text style={styles.description}>
                  Please enter your date of birth to verify your age.
                </Text>
                
                <Text style={styles.label}>Enter your date of birth:</Text>
                
                <View style={styles.dateInputContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Month</Text>
                    <TextInput
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
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Day</Text>
                    <TextInput
                      ref={(ref) => { dayInputRef = ref; }}
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
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Year</Text>
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
                </View>
                
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                
                <Pressable
                  style={[styles.verifyButton, (!day || !month || !year) && styles.disabledButton]}
                  onPress={verifyAge}
                  disabled={!day || !month || !year}
                >
                  <Text style={styles.verifyButtonText}>Verify Age</Text>
                </Pressable>
                
                <Pressable
                  style={styles.backButton}
                  onPress={() => setStep('terms')}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </Pressable>
              </>
            )}
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
                setStep('checkbox');
                setIsOver21(null);
                setAgreeToTerms(false);
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
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  centeredView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: '100%',
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
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    color: Colors.dark.subtext,
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  questionText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  checkboxContainer: {
    width: '100%',
    marginBottom: 24,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.background,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  checkboxText: {
    color: Colors.dark.text,
    fontSize: 16,
    flex: 1,
  },
  termsContainer: {
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  termsTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  termsText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  encryptionText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  continueButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom: 16,
    fontWeight: '600',
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    alignItems: 'center',
  },
  inputLabel: {
    color: Colors.dark.subtext,
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  dateInput: {
    backgroundColor: Colors.dark.background,
    color: Colors.dark.text,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: '100%',
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
    width: '100%',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
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
    marginBottom: 12,
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
  backButton: {
    padding: 12,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.dark.subtext,
    fontSize: 14,
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
});