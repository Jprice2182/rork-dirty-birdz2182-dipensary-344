import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { X, DollarSign } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useOrderStore } from '@/store/orderStore';

interface TipDriverModalProps {
  visible: boolean;
  onClose: () => void;
  orderId: string;
  driverName?: string;
}

export default function TipDriverModal({ 
  visible, 
  onClose, 
  orderId,
  driverName = "your driver"
}: TipDriverModalProps) {
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { getOrderById, updateOrderTip } = useOrderStore();
  const order = getOrderById(orderId);

  const tipOptions = [2, 5, 10, 15, 20];

  const handleSelectTip = (amount: number) => {
    setSelectedTip(amount);
    setCustomTip('');
  };

  const handleCustomTipChange = (text: string) => {
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(text)) {
      setCustomTip(text);
      setSelectedTip(null);
    }
  };

  const getTipAmount = () => {
    if (selectedTip !== null) {
      return selectedTip;
    }
    
    if (customTip) {
      return parseFloat(customTip);
    }
    
    return 0;
  };

  const handleSubmit = () => {
    const tipAmount = getTipAmount();
    
    if (tipAmount <= 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      updateOrderTip(orderId, tipAmount);
      
      setIsSubmitting(false);
      setSelectedTip(null);
      setCustomTip('');
      onClose();
    }, 1000);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>Tip Your Driver</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.dark.text} />
            </Pressable>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.driverName}>
              Add a tip for {driverName}
            </Text>
            
            <Text style={styles.tipNote}>
              100% of tips go directly to drivers
            </Text>
            
            <View style={styles.tipOptionsContainer}>
              {tipOptions.map((amount) => (
                <Pressable
                  key={amount}
                  style={[
                    styles.tipOption,
                    selectedTip === amount && styles.selectedTipOption
                  ]}
                  onPress={() => handleSelectTip(amount)}
                >
                  <Text 
                    style={[
                      styles.tipOptionText,
                      selectedTip === amount && styles.selectedTipOptionText
                    ]}
                  >
                    ${amount}
                  </Text>
                </Pressable>
              ))}
            </View>
            
            <View style={styles.customTipContainer}>
              <Text style={styles.customTipLabel}>Custom Amount</Text>
              <View style={styles.customTipInputContainer}>
                <DollarSign size={20} color={Colors.dark.subtext} style={styles.dollarIcon} />
                <TextInput
                  style={styles.customTipInput}
                  value={customTip}
                  onChangeText={handleCustomTipChange}
                  placeholder="Enter amount"
                  placeholderTextColor={Colors.dark.subtext}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Tip Amount:</Text>
              <Text style={styles.totalValue}>
                ${getTipAmount().toFixed(2)}
              </Text>
            </View>
          </View>
          
          <Pressable 
            style={[
              styles.submitButton, 
              (isSubmitting || getTipAmount() <= 0) && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting || getTipAmount() <= 0}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={Colors.dark.text} />
            ) : (
              <Text style={styles.submitButtonText}>Add Tip</Text>
            )}
          </Pressable>
          
          <Pressable 
            style={styles.skipButton}
            onPress={onClose}
            disabled={isSubmitting}
          >
            <Text style={styles.skipButtonText}>No Tip</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: '90%',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  driverName: {
    color: Colors.dark.text,
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  tipNote: {
    color: Colors.dark.success,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 24,
    textAlign: 'center',
  },
  tipOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  tipOption: {
    width: '30%',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedTipOption: {
    backgroundColor: Colors.dark.success,
  },
  tipOptionText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
  selectedTipOptionText: {
    color: Colors.dark.text,
  },
  customTipContainer: {
    marginBottom: 24,
  },
  customTipLabel: {
    color: Colors.dark.text,
    fontSize: 14,
    marginBottom: 8,
  },
  customTipInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  dollarIcon: {
    marginRight: 8,
  },
  customTipInput: {
    flex: 1,
    height: 48,
    color: Colors.dark.text,
    fontSize: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  totalLabel: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  totalValue: {
    color: Colors.dark.success,
    fontSize: 20,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: Colors.dark.success,
    padding: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: Colors.dark.background,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  skipButtonText: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
});