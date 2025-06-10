import { View, Text, Modal, Pressable, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';
import Colors from '@/constants/colors';
import appInfo from '@/constants/appInfo';

interface TipDriverModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectTip: (amount: number) => void;
  orderTotal: number;
}

export function TipDriverModal({ isVisible, onClose, onSelectTip, orderTotal }: TipDriverModalProps) {
  const [customTip, setCustomTip] = useState('');
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null);
  
  const tipPercentages = appInfo.defaultTipPercentages;

  const handlePercentageTip = (percentage: number) => {
    const tipAmount = (orderTotal * percentage) / 100;
    setSelectedPercentage(percentage);
    setCustomTip('');
    onSelectTip(tipAmount);
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
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Add a Tip</Text>
          <Text style={styles.subtitle}>Show your appreciation for great service!</Text>
          <Text style={styles.orderTotal}>Order Total: ${orderTotal.toFixed(2)}</Text>
          
          {/* Percentage Tips */}
          <View style={styles.tipGrid}>
            {tipPercentages.map((percentage) => {
              const tipAmount = (orderTotal * percentage) / 100;
              return (
                <Pressable
                  key={percentage}
                  style={[
                    styles.tipButton,
                    selectedPercentage === percentage && styles.selectedTipButton
                  ]}
                  onPress={() => handlePercentageTip(percentage)}
                >
                  <Text style={styles.tipPercentage}>{percentage}%</Text>
                  <Text style={styles.tipAmount}>${tipAmount.toFixed(2)}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Custom Tip Input */}
          <View style={styles.customTipSection}>
            <Text style={styles.customTipLabel}>Custom Amount</Text>
            <View style={styles.customTipContainer}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.customTipInput}
                value={customTip}
                onChangeText={setCustomTip}
                placeholder="0.00"
                placeholderTextColor={Colors.dark.subtext}
                keyboardType="decimal-pad"
              />
              <Pressable style={styles.customTipButton} onPress={handleCustomTip}>
                <Text style={styles.customTipButtonText}>Add</Text>
              </Pressable>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Pressable style={styles.noTipButton} onPress={handleNoTip}>
              <Text style={styles.noTipText}>No Tip</Text>
            </Pressable>
            
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Cancel</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    padding: 20,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.subtext,
    marginBottom: 8,
    textAlign: 'center',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.primary,
    marginBottom: 20,
  },
  tipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  tipButton: {
    width: '48%',
    backgroundColor: Colors.dark.border,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTipButton: {
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.primary + '20',
  },
  tipPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  tipAmount: {
    fontSize: 16,
    color: Colors.dark.primary,
  },
  customTipSection: {
    width: '100%',
    marginBottom: 20,
  },
  customTipLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  customTipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.border,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  dollarSign: {
    fontSize: 18,
    color: Colors.dark.text,
    marginRight: 8,
  },
  customTipInput: {
    flex: 1,
    fontSize: 18,
    color: Colors.dark.text,
    paddingVertical: 12,
  },
  customTipButton: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  customTipButtonText: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  noTipButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.dark.border,
    alignItems: 'center',
  },
  noTipText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
  },
  closeText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
});