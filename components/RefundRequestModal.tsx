import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { X, DollarSign, Clock, AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useOrderStore } from '@/store/orderStore';
import appInfo from '@/constants/appInfo';

interface RefundRequestModalProps {
  visible: boolean;
  onClose: () => void;
  orderId: string;
}

export default function RefundRequestModal({ visible, onClose, orderId }: RefundRequestModalProps) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { getOrderById, requestRefund, getRefundTimeRemaining } = useOrderStore();
  
  const order = getOrderById(orderId);
  const timeRemaining = getRefundTimeRemaining(orderId);

  const handleRequestRefund = () => {
    if (!order) {
      Alert.alert('Error', 'Order not found');
      return;
    }

    setIsLoading(true);
    
    const success = requestRefund(orderId, reason.trim() || undefined);
    
    if (success) {
      Alert.alert(
        'Refund Requested',
        'Your refund request has been submitted successfully. You will receive your money back within 24 hours.',
        [{ text: 'OK', onPress: onClose }]
      );
    } else {
      Alert.alert(
        'Refund Not Available',
        'This order is not eligible for a refund. Please contact customer service for assistance.'
      );
    }
    
    setIsLoading(false);
  };

  if (!order) {
    return null;
  }

  const refundAmount = order.total + (order.tipAmount || 0);

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
            <DollarSign size={60} color={Colors.dark.primary} />
          </View>
          
          <Text style={styles.title}>Request Refund</Text>
          
          <Text style={styles.description}>
            {appInfo.refundPolicy.description}
          </Text>

          {/* Time Remaining Warning */}
          {timeRemaining <= 2 && timeRemaining > 0 && (
            <View style={styles.warningContainer}>
              <AlertTriangle size={20} color={Colors.dark.warning} />
              <Text style={styles.warningText}>
                Only {timeRemaining} hour{timeRemaining !== 1 ? 's' : ''} left to request a refund!
              </Text>
            </View>
          )}
          
          <View style={styles.refundInfoContainer}>
            <View style={styles.refundInfoRow}>
              <Text style={styles.refundInfoLabel}>Order ID:</Text>
              <Text style={styles.refundInfoValue}>#{orderId.slice(0, 8)}</Text>
            </View>
            
            <View style={styles.refundInfoRow}>
              <Text style={styles.refundInfoLabel}>Refund Amount:</Text>
              <Text style={styles.refundAmountValue}>${refundAmount.toFixed(2)}</Text>
            </View>
            
            <View style={styles.refundInfoRow}>
              <Text style={styles.refundInfoLabel}>Processing Time:</Text>
              <Text style={styles.refundInfoValue}>{appInfo.refundPolicy.processingTime}</Text>
            </View>
            
            <View style={styles.refundInfoRow}>
              <Text style={styles.refundInfoLabel}>Refund Method:</Text>
              <Text style={styles.refundInfoValue}>
                {order.paymentMethod === 'card' ? 'Original Payment Method' : 'Store Credit'}
              </Text>
            </View>
          </View>

          {/* Time Remaining Display */}
          <View style={styles.timeRemainingContainer}>
            <Clock size={16} color={Colors.dark.primary} />
            <Text style={styles.timeRemainingText}>
              {timeRemaining > 0 
                ? `${timeRemaining} hour${timeRemaining !== 1 ? 's' : ''} remaining to request refund`
                : 'Refund period has expired'
              }
            </Text>
          </View>
          
          <View style={styles.reasonContainer}>
            <Text style={styles.reasonLabel}>Reason for refund (optional):</Text>
            <TextInput
              style={styles.reasonInput}
              value={reason}
              onChangeText={setReason}
              placeholder="Tell us why you want a refund..."
              placeholderTextColor={Colors.dark.subtext}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.buttonsContainer}>
            <Pressable 
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            
            <Pressable 
              style={[
                styles.refundButton, 
                (isLoading || timeRemaining <= 0) && styles.disabledButton
              ]}
              onPress={handleRequestRefund}
              disabled={isLoading || timeRemaining <= 0}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.dark.text} />
              ) : (
                <Text style={styles.refundButtonText}>Request Refund</Text>
              )}
            </Pressable>
          </View>

          <Text style={styles.policyText}>
            By requesting a refund, you agree to our refund policy. 
            Refunds are processed within 24 hours for eligible orders.
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: '90%',
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
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    color: Colors.dark.subtext,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  warningText: {
    color: Colors.dark.warning,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  refundInfoContainer: {
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  refundInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  refundInfoLabel: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  refundInfoValue: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  refundAmountValue: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeRemainingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  timeRemainingText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
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
    marginBottom: 16,
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
  refundButton: {
    flex: 1,
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  refundButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  policyText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});