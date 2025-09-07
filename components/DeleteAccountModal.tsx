import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { X, AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { usePromoStore } from '@/store/promoStore';
import { useRouter } from 'expo-router';

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({ visible, onClose }: DeleteAccountModalProps) {
  const [confirmation, setConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { deleteAccount } = useAuthStore();
  const { resetUserData } = useUserStore();
  const { clearCart } = useCartStore();
  const { clearOrders } = useOrderStore();
  const { resetPromoState } = usePromoStore();
  const router = useRouter();

  const handleDeleteAccount = () => {
    if (confirmation.toLowerCase() !== 'delete') {
      setError('Please type "delete" to confirm');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      // Clear all user data
      deleteAccount();
      resetUserData();
      clearCart();
      clearOrders();
      resetPromoState();
      
      setIsLoading(false);
      onClose();
      router.replace('/sign-in');
    }, 1500);
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
          
          <View style={styles.iconContainer}>
            <AlertTriangle size={60} color={Colors.dark.error} />
          </View>
          
          <Text style={styles.title}>Delete Account</Text>
          
          <Text style={styles.description}>
            This action cannot be undone. All your data, including order history and saved addresses, will be permanently deleted.
          </Text>
          
          <View style={styles.confirmationContainer}>
            <Text style={styles.confirmationLabel}>
              Type "delete" to confirm:
            </Text>
            <TextInput
              style={styles.confirmationInput}
              value={confirmation}
              onChangeText={setConfirmation}
              placeholder="delete"
              placeholderTextColor={Colors.dark.subtext}
              autoCapitalize="none"
            />
          </View>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.buttonsContainer}>
            <Pressable 
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.deleteButton, isLoading && styles.disabledButton]}
              onPress={handleDeleteAccount}
              disabled={isLoading || confirmation.toLowerCase() !== 'delete'}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.dark.text} />
              ) : (
                <Text style={styles.deleteButtonText}>Delete Account</Text>
              )}
            </Pressable>
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
  },
  modalView: {
    width: '85%',
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
    color: Colors.dark.error,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    color: Colors.dark.subtext,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmationContainer: {
    width: '100%',
    marginBottom: 16,
  },
  confirmationLabel: {
    color: Colors.dark.text,
    fontSize: 14,
    marginBottom: 8,
  },
  confirmationInput: {
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
    fontSize: 16,
    width: '100%',
  },
  errorText: {
    color: Colors.dark.error,
    fontSize: 14,
    marginBottom: 16,
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
  deleteButton: {
    flex: 1,
    backgroundColor: Colors.dark.error,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  deleteButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});