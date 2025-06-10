import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { X, DollarSign } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useOrderStore } from '@/store/orderStore';
import appInfo from '@/constants/appInfo';

interface TipDriverModalProps {
  visible: boolean;
  onClose: () => void;
  orderId?: string;
  subtotal: number;
  onSelectTip: (amount: number) => void;
  initialTip?: number;
}

export default function TipDriverModal({ 
  visible, 
  onClose, 
  orderId,
  subtotal,
  onSelectTip,
  initialTip = 0
}: TipDriverModalProps) {
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState(initialTip ? initialTip.toFixed(2) : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const tipPercentages = appInfo.defaultTipPercentages;

  const handleSelectPercentage = (percentage: number) => {
    const tipAmount = (subtotal * (percentage / 100));
    setSelectedPercentage(percentage);
    setCustomTip(tipAmount.toFixed(2));
    onSelectTip(tipAmount);
  };

  const handleCustomTipChange = (text: string) => {
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(text)) {
      setCustomTip(text);
      setSelectedPercentage(null);
      const tipAmount = parseFloat(text) || 0;
      onSelectTip(tipAmount);
    }
  };

  const getTipAmount = () => {
    if (customTip) {
      return parseFloat(customTip) || 0;
    }
    return 0;
  };

  const getTipPercentage = (amount: number) => {
    return ((amount / subtotal) * 100).toFixed(1);
  };

  const handleSubmit = () => {
    const tipAmount = getTipAmount();
    onSelectTip(tipAmount);
    onClose();
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
            <Text style={styles.title}>Add a Tip</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.dark.text} />
            </Pressable>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.subtitle}>
              Show your appreciation for great service
            </Text>
            
            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalLabel}>Order Subtotal:</Text>
              <Text style={styles.subtotalValue}>${subtotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.percentagesContainer}>
              {tipPercentages.map((percentage) => (
                <Pressable
                  key={percentage}
                  style={[
                    styles.percentageOption,
                    selectedPercentage === percentage && styles.selectedPercentageOption
                  ]}
                  onPress={() => handleSelectPercentage(percentage)}
                >
                  <Text 
                    style={[
                      styles.percentageText,
                      selectedPercentage === percentage && styles.selectedPercentageText
                    ]}
                  >
                    {percentage}%
                  </Text>
                  <Text 
                    style={[
                      styles.percentageAmount,
                      selectedPercentage === percentage && styles.selectedPercentageText
                    ]}
                  >
                    ${(subtotal * (percentage / 100)).toFixed(2)}
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
              {customTip && parseFloat(customTip) > 0 && (
                <Text style={styles.tipPercentage}>
                  ({getTipPercentage(parseFloat(customTip))}% of subtotal)
                </Text>
              )}
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
              <Text style={styles.submitButtonText}>
                Add ${getTipAmount().toFixed(2)} Tip
              </Text>
            )}
          </Pressable>
          
          <Pressable 
            style={styles.skipButton}
            onPress={() => {
              onSelectTip(0);
              onClose();
            }}
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
  subtitle: {
    color: Colors.dark.subtext,
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  subtotalLabel: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  subtotalValue: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  percentagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  percentageOption: {
    width: '48%',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedPercentageOption: {
    backgroundColor: Colors.dark.success,
  },
  percentageText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  percentageAmount: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  selectedPercentageText: {
    color: Colors.dark.text,
  },
  customTipContainer: {
    marginBottom: 24,
  },
  customTipLabel: {
    color: Colors.dark.text,
    fontSize: 16,
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
  tipPercentage: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'right',
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