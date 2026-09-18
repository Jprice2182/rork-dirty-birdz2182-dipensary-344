import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { X, AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useOrderStore } from '@/store/orderStore';
import { useRouter } from 'expo-router';

interface CancelOrderModalProps {
  visible: boolean;
  onClose: () => void;
  orderId: string;
}

export default function CancelOrderModal({ visible, onClose, orderId }: CancelOrderModalProps) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateOrderStatus, getOrderById } = useOrderStore();
  const router = useRouter();
  
  const order = getOrderById(orderId);
  const canCancel = order && (order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing');

  const handleCancelOrder = () => {
    if (!canCancel) {
      onClose();
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateOrderStatus(orderId, 'cancelled');
      setIsLoading(false);
      onClose();
      router.replace('/orders');
    }, 1500);
  };

  if (!order) {
    return null;
  }

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
            <AlertTriangle size={60} color={Colors.dark.warning} />
          </View>
          
          <Text style={styles.title}>Cancel Order</Text>
          
          {canCancel ? (
            <>
              <Text style={styles.description}>
                Are you sure you want to cancel this order? This action cannot be undone.
              </Text>
              
              <View style={styles.orderInfoContainer}>
                <Text style={styles.orderInfoLabel}>Order ID:</Text>
                <Text style={styles.orderInfoValue}>#{orderId.slice(0, 8)}</Text>
                
                <Text style={styles.orderInfoLabel}>Status:</Text>
                <Text style={styles.orderInfoValue}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
                
                <Text style={styles.orderInfoLabel}>Total:</Text>
                <Text style={styles.orderInfoValue}>${order.total.toFixed(2)}</Text>
              </View>
              
              <View style={styles.reasonContainer}>
                <Text style={styles.reasonLabel}>Reason for cancellation (optional):</Text>
                <TextInput
                  style={styles.reasonInput}
                  value={reason}
                  onChangeText={setReason}
                  placeholder="Tell us why you're cancelling..."
                  placeholderTextColor={Colors.dark.subtext}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
              
              <View style={styles.buttonsContainer}>
                <Pressable 
                  style={styles.keepButton}
                  onPress={onClose}
                  disabled={isLoading}
                >
                  <Text style={styles.keepButtonText}>Keep Order</Text>
                </Pressable>
                
                <Pressable 
                  style={[styles.cancelButton, isLoading && styles.disabledButton]}
                  onPress={handleCancelOrder}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.dark.text} />
                  ) : (
                    <Text style={styles.cancelButtonText}>Cancel Order</Text>
                  )}
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.description}>
                This order cannot be cancelled because it is already {order.status}.
              </Text>
              
              <Pressable 
                style={styles.okButton}
                onPress={onClose}
              >
                <Text style={styles.okButtonText}>OK</Text>
              </Pressable>
            </>
          )}
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
    color: Colors.dark.warning,
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
  orderInfoContainer: {
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  orderInfoLabel: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 4,
  },
  orderInfoValue: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  reasonContainer: {
    width: '100%',
    marginBottom: 16,
  },
  reasonLabel: {
    color: Colors.dark.text,
    fontSize: 14,
    marginBottom: 8,
  },
  reasonInput: {
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
    fontSize: 16,
    width: '100%',
    minHeight: 80,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  keepButton: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  keepButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.dark.warning,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  cancelButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  okButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  okButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});