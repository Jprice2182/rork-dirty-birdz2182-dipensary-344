import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { X, MapPin, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore, Address } from '@/store/userStore';

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
  editIndex?: number;
  initialAddress?: Address;
}

export default function AddressModal({ 
  visible, 
  onClose, 
  editIndex, 
  initialAddress 
}: AddressModalProps) {
  const { addAddress, updateAddress } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [street, setStreet] = useState(initialAddress?.street || '');
  const [city, setCity] = useState(initialAddress?.city || '');
  const [state, setState] = useState(initialAddress?.state || '');
  const [zipCode, setZipCode] = useState(initialAddress?.zipCode || '');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const isEditing = editIndex !== undefined;

  // Reset form when modal becomes visible
  React.useEffect(() => {
    if (visible) {
      setStreet(initialAddress?.street || '');
      setCity(initialAddress?.city || '');
      setState(initialAddress?.state || '');
      setZipCode(initialAddress?.zipCode || '');
      setError('');
      setValidationErrors({});
    }
  }, [visible, initialAddress]);

  const resetForm = () => {
    setStreet('');
    setCity('');
    setState('');
    setZipCode('');
    setError('');
    setValidationErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'street':
        return !value.trim() ? 'Street address is required' : '';
      case 'city':
        return !value.trim() ? 'City is required' : '';
      case 'state':
        return !value.trim() ? 'State is required' : '';
      case 'zipCode':
        return !value.trim() 
          ? 'ZIP code is required' 
          : !/^\d{5}(-\d{4})?$/.test(value.trim()) 
            ? 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)' 
            : '';
      default:
        return '';
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));

    switch (field) {
      case 'street':
        setStreet(value);
        break;
      case 'city':
        setCity(value);
        break;
      case 'state':
        setState(value);
        break;
      case 'zipCode':
        setZipCode(value);
        break;
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {
      street: validateField('street', street),
      city: validateField('city', city),
      state: validateField('state', state),
      zipCode: validateField('zipCode', zipCode)
    };

    setValidationErrors(errors);

    // Check if any errors exist
    return !Object.values(errors).some(error => error !== '');
  };

  const handleSave = () => {
    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    const newAddress: Address = {
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim()
    };
    
    try {
      // Simulate API call
      setTimeout(() => {
        if (isEditing && editIndex !== undefined) {
          updateAddress(editIndex, newAddress);
        } else {
          addAddress(newAddress);
        }
        setIsLoading(false);
        Alert.alert(
          "Success",
          `Address ${isEditing ? 'updated' : 'added'} successfully!`,
          [{ text: "OK", onPress: handleClose }]
        );
      }, 500);
    } catch (error) {
      setIsLoading(false);
      setError('Failed to save address. Please try again.');
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <X size={24} color={Colors.dark.text} />
            </Pressable>
            
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.iconContainer}>
                <MapPin size={60} color={Colors.dark.primary} />
              </View>
              
              <Text style={styles.title}>
                {isEditing ? 'Edit Address' : 'Add Delivery Address'}
              </Text>
              
              {error ? (
                <View style={styles.errorContainer}>
                  <AlertCircle size={18} color={Colors.dark.error} style={styles.errorIcon} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
              
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Street Address <Text style={styles.requiredStar}>*</Text></Text>
                  <TextInput
                    style={[styles.input, validationErrors.street ? styles.inputError : null]}
                    value={street}
                    onChangeText={(text) => handleFieldChange('street', text)}
                    placeholder="123 Main St, Apt 4B"
                    placeholderTextColor={Colors.dark.subtext}
                    autoFocus={true}
                  />
                  {validationErrors.street ? (
                    <Text style={styles.fieldErrorText}>{validationErrors.street}</Text>
                  ) : null}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>City <Text style={styles.requiredStar}>*</Text></Text>
                  <TextInput
                    style={[styles.input, validationErrors.city ? styles.inputError : null]}
                    value={city}
                    onChangeText={(text) => handleFieldChange('city', text)}
                    placeholder="San Francisco"
                    placeholderTextColor={Colors.dark.subtext}
                  />
                  {validationErrors.city ? (
                    <Text style={styles.fieldErrorText}>{validationErrors.city}</Text>
                  ) : null}
                </View>
                
                <View style={styles.rowContainer}>
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.inputLabel}>State <Text style={styles.requiredStar}>*</Text></Text>
                    <TextInput
                      style={[styles.input, validationErrors.state ? styles.inputError : null]}
                      value={state}
                      onChangeText={(text) => handleFieldChange('state', text)}
                      placeholder="CA"
                      placeholderTextColor={Colors.dark.subtext}
                      maxLength={2}
                      autoCapitalize="characters"
                    />
                    {validationErrors.state ? (
                      <Text style={styles.fieldErrorText}>{validationErrors.state}</Text>
                    ) : null}
                  </View>
                  
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.inputLabel}>ZIP Code <Text style={styles.requiredStar}>*</Text></Text>
                    <TextInput
                      style={[styles.input, validationErrors.zipCode ? styles.inputError : null]}
                      value={zipCode}
                      onChangeText={(text) => handleFieldChange('zipCode', text)}
                      placeholder="94103"
                      placeholderTextColor={Colors.dark.subtext}
                      keyboardType="number-pad"
                      maxLength={10}
                    />
                    {validationErrors.zipCode ? (
                      <Text style={styles.fieldErrorText}>{validationErrors.zipCode}</Text>
                    ) : null}
                  </View>
                </View>
              </View>
              
              <View style={styles.buttonsContainer}>
                <Pressable 
                  style={styles.cancelButton}
                  onPress={handleClose}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                
                <Pressable 
                  style={[styles.saveButton, isLoading && styles.disabledButton]}
                  onPress={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.dark.text} />
                  ) : (
                    <Text style={styles.saveButtonText}>
                      {isEditing ? 'Update' : 'Save'} Address
                    </Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
  },
  modalView: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  iconContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: Colors.dark.error,
    fontSize: 14,
    flex: 1,
  },
  form: {
    width: '100%',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 8,
  },
  requiredStar: {
    color: Colors.dark.error,
    fontSize: 14,
  },
  input: {
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
    fontSize: 16,
  },
  inputError: {
    borderColor: Colors.dark.error,
    borderWidth: 1,
  },
  fieldErrorText: {
    color: Colors.dark.error,
    fontSize: 12,
    marginTop: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});