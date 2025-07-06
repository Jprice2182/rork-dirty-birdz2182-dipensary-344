import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, Image, TextInput, Alert } from 'react-native';
import { X, Gift, Calendar, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';

interface BirthdayPromotionModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function BirthdayPromotionModal({ visible, onClose }: BirthdayPromotionModalProps) {
  const { birthday, setBirthday } = useUserStore();
  const [claimed, setClaimed] = useState(false);
  const [isEditing, setIsEditing] = useState(!birthday);
  const [editBirthday, setEditBirthday] = useState('');

  const validateBirthday = (dateString: string): boolean => {
    // Check if date is in MM/DD/YYYY format
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }

    const [month, day, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    // Check if date is valid
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return false;
    }

    // Check if user is at least 21 years old
    const today = new Date();
    const age = today.getFullYear() - year;
    const monthDiff = today.getMonth() - (month - 1);
    const dayDiff = today.getDate() - day;
    
    if (age < 21 || (age === 21 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
      return false;
    }

    return true;
  };

  const formatBirthdayInput = (text: string): string => {
    // Remove all non-numeric characters
    const numbers = text.replace(/\D/g, '');
    
    // Add slashes automatically
    if (numbers.length >= 5) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    } else if (numbers.length >= 3) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return numbers;
    }
  };

  const handleBirthdayChange = (text: string) => {
    const formatted = formatBirthdayInput(text);
    setEditBirthday(formatted);
  };

  const handleSaveBirthday = () => {
    if (!validateBirthday(editBirthday)) {
      Alert.alert(
        'Invalid Birthday',
        'Please enter a valid birthday (MM/DD/YYYY) and ensure you are at least 21 years old.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Convert to ISO string for storage
    const [month, day, year] = editBirthday.split('/').map(Number);
    const birthdayDate = new Date(year, month - 1, day);
    setBirthday(birthdayDate.toISOString());
    setIsEditing(false);
    Alert.alert('Success', 'Birthday saved successfully!');
  };

  const handleClaim = () => {
    if (!birthday) {
      Alert.alert(
        'Birthday Required',
        'Please set your birthday first to claim this promotion.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // In a real app, this would add the free pre-roll to the user's account
    setClaimed(true);
  };

  const formatBirthday = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.dark.text} />
          </Pressable>
          
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Gift size={60} color={Colors.dark.primary} />
            </View>
            
            <Text style={styles.title}>Birthday Promotion</Text>
            
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1603909223429-69858b7e1482?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' }} 
              style={styles.productImage} 
            />
            
            <Text style={styles.description}>
              Celebrate your birthday with a free 1g pre-roll on us! Visit any Dirty Birdz2182 Dispensary location on your birthday to claim your gift.
            </Text>
            
            <View style={styles.birthdayContainer}>
              <Calendar size={20} color={Colors.dark.primary} style={styles.calendarIcon} />
              <View style={styles.birthdayInfo}>
                <Text style={styles.birthdayLabel}>Your Birthday</Text>
                {isEditing ? (
                  <View style={styles.birthdayEditContainer}>
                    <TextInput
                      style={styles.birthdayInput}
                      value={editBirthday}
                      onChangeText={handleBirthdayChange}
                      placeholder="MM/DD/YYYY"
                      placeholderTextColor={Colors.dark.subtext}
                      keyboardType="numeric"
                      maxLength={10}
                    />
                    <Pressable style={styles.saveButton} onPress={handleSaveBirthday}>
                      <Text style={styles.saveButtonText}>Save</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={styles.birthdayDisplayContainer}>
                    <Text style={styles.birthdayValue}>{formatBirthday(birthday)}</Text>
                    <Pressable 
                      style={styles.editButton} 
                      onPress={() => {
                        setIsEditing(true);
                        setEditBirthday(birthday ? new Date(birthday).toLocaleDateString('en-US') : '');
                      }}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
            
            {birthday && !isEditing ? (
              claimed ? (
                <View style={styles.claimedContainer}>
                  <Check size={24} color={Colors.dark.success} style={styles.checkIcon} />
                  <Text style={styles.claimedText}>Promotion Claimed!</Text>
                  <Text style={styles.claimedDescription}>
                    Your free 1g pre-roll has been added to your account. Show this to the budtender on your next visit.
                  </Text>
                </View>
              ) : (
                <Pressable style={styles.claimButton} onPress={handleClaim}>
                  <Text style={styles.claimButtonText}>Claim Birthday Gift</Text>
                </Pressable>
              )
            ) : !isEditing ? (
              <View style={styles.noBirthdayContainer}>
                <Text style={styles.noBirthdayText}>
                  Please set your birthday to claim this promotion.
                </Text>
                <Pressable 
                  style={styles.setBirthdayButton} 
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.setBirthdayButtonText}>Set Birthday</Text>
                </Pressable>
              </View>
            ) : null}
            
            <Text style={styles.termsText}>
              * Limit one per customer. Must be 21+ with valid ID. Cannot be combined with other offers. Pre-roll selection based on availability.
            </Text>
          </View>
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
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  description: {
    color: Colors.dark.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  birthdayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  calendarIcon: {
    marginRight: 12,
  },
  birthdayInfo: {
    flex: 1,
  },
  birthdayLabel: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 4,
  },
  birthdayEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  birthdayInput: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 8,
    color: Colors.dark.text,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  saveButtonText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  birthdayDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  birthdayValue: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editButtonText: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: '500',
  },
  claimButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  claimButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  claimedContainer: {
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkIcon: {
    marginBottom: 8,
  },
  claimedText: {
    color: Colors.dark.success,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  claimedDescription: {
    color: Colors.dark.text,
    fontSize: 14,
    textAlign: 'center',
  },
  noBirthdayContainer: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    alignItems: 'center',
  },
  noBirthdayText: {
    color: Colors.dark.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  setBirthdayButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  setBirthdayButtonText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  termsText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});