import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, Image } from 'react-native';
import { X, Gift, Calendar, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';

interface BirthdayPromotionModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function BirthdayPromotionModal({ visible, onClose }: BirthdayPromotionModalProps) {
  const { birthday } = useUserStore();
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
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
              Celebrate your birthday with a free 0.5g pre-roll on us! Visit any Dirty Birdz2182 Dispensary location on your birthday to claim your gift.
            </Text>
            
            <View style={styles.birthdayContainer}>
              <Calendar size={20} color={Colors.dark.primary} style={styles.calendarIcon} />
              <View>
                <Text style={styles.birthdayLabel}>Your Birthday</Text>
                <Text style={styles.birthdayValue}>{formatBirthday(birthday)}</Text>
              </View>
            </View>
            
            {birthday ? (
              claimed ? (
                <View style={styles.claimedContainer}>
                  <Check size={24} color={Colors.dark.success} style={styles.checkIcon} />
                  <Text style={styles.claimedText}>Promotion Claimed!</Text>
                  <Text style={styles.claimedDescription}>
                    Your free 0.5g pre-roll has been added to your account. Show this to the budtender on your next visit.
                  </Text>
                </View>
              ) : (
                <Pressable style={styles.claimButton} onPress={handleClaim}>
                  <Text style={styles.claimButtonText}>Claim Birthday Gift</Text>
                </Pressable>
              )
            ) : (
              <View style={styles.noBirthdayContainer}>
                <Text style={styles.noBirthdayText}>
                  Please set your birthday in your profile to claim this promotion.
                </Text>
              </View>
            )}
            
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
  birthdayLabel: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 4,
  },
  birthdayValue: {
    color: Colors.dark.text,
    fontSize: 16,
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
  },
  noBirthdayText: {
    color: Colors.dark.error,
    fontSize: 14,
    textAlign: 'center',
  },
  termsText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});