import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, TextInput } from 'react-native';
import Colors from '@/constants/colors';

interface TipDriverModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectTip: (amount: number) => void;
  orderTotal: number;
}

export default function TipDriverModal({
  isVisible,
  onClose,
  onSelectTip,
  orderTotal,
}: TipDriverModalProps) {
  const [customTip, setCustomTip] = useState('');

  const tipOptions = [
    { label: '15%', amount: orderTotal * 0.15 },
    { label: '18%', amount: orderTotal * 0.18 },
    { label: '20%', amount: orderTotal * 0.20 },
    { label: '25%', amount: orderTotal * 0.25 },
  ];

  const handleTipSelect = (amount: number) => {
    onSelectTip(amount);
    onClose();
  };

  const handleCustomTip = () => {
    const amount = parseFloat(customTip);
    if (!isNaN(amount) && amount >= 0) {
      onSelectTip(amount);
      onClose();
    }
  };

  const handleNoTip = () => {
    onSelectTip(0);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Tip for Driver</Text>
          <Text style={styles.subtitle}>
            Show your appreciation for great service
          </Text>

          <View style={styles.tipOptions}>
            {tipOptions.map((option, index) => (
              <Pressable
                key={index}
                style={styles.tipOption}
                onPress={() => handleTipSelect(option.amount)}
              >
                <Text style={styles.tipLabel}>{option.label}</Text>
                <Text style={styles.tipAmount}>${option.amount.toFixed(2)}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.customTipSection}>
            <Text style={styles.customTipLabel}>Custom Amount</Text>
            <View style={styles.customTipInput}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.textInput}
                value={customTip}
                onChangeText={setCustomTip}
                placeholder="0.00"
                placeholderTextColor={Colors.dark.subtext}
                keyboardType="numeric"
              />
              <Pressable style={styles.customTipButton} onPress={handleCustomTip}>
                <Text style={styles.customTipButtonText}>Add</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.noTipButton} onPress={handleNoTip}>
              <Text style={styles.noTipText}>No Tip</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  tipOptions: {
    gap: 12,
    marginBottom: 24,
  },
  tipOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  tipLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  tipAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.primary,
  },
  customTipSection: {
    marginBottom: 24,
  },
  customTipLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  customTipInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 16,
  },
  dollarSign: {
    fontSize: 16,
    color: Colors.dark.text,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark.text,
    paddingVertical: 16,
  },
  customTipButton: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  customTipButtonText: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  noTipButton: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  noTipText: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.dark.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
});