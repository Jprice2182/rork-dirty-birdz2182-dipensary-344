import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface TipDriverModalProps {
  visible: boolean;
  onClose: () => void;
  subtotal: number;
  onSelectTip: (amount: number) => void;
  initialTip: number;
  tipType: 'percentage' | 'amount';
  onTipTypeChange: (type: 'percentage' | 'amount') => void;
}

const PERCENTAGE_OPTIONS = [10, 15, 20, 25];
const AMOUNT_OPTIONS = [2, 3, 4, 5];

export function TipDriverModal({
  visible,
  onClose,
  subtotal,
  onSelectTip,
  initialTip,
  tipType,
  onTipTypeChange
}: TipDriverModalProps) {
  const handleSelectTip = (value: number) => {
    const amount = tipType === 'percentage' ? (subtotal * value) / 100 : value;
    onSelectTip(amount);
    onClose();
  };

  const isSelected = (value: number) => {
    if (tipType === 'percentage') {
      return Math.abs(((initialTip / subtotal) * 100) - value) < 0.1;
    }
    return Math.abs(initialTip - value) < 0.1;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add a tip for your driver</Text>
          
          <View style={styles.tipTypeSelector}>
            <Pressable
              style={[
                styles.tipTypeButton,
                tipType === 'percentage' && styles.selectedTipType
              ]}
              onPress={() => onTipTypeChange('percentage')}
            >
              <Text style={[
                styles.tipTypeText,
                tipType === 'percentage' && styles.selectedTipTypeText
              ]}>
                Percentage
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.tipTypeButton,
                tipType === 'amount' && styles.selectedTipType
              ]}
              onPress={() => onTipTypeChange('amount')}
            >
              <Text style={[
                styles.tipTypeText,
                tipType === 'amount' && styles.selectedTipTypeText
              ]}>
                Amount
              </Text>
            </Pressable>
          </View>

          <View style={styles.optionsContainer}>
            {(tipType === 'percentage' ? PERCENTAGE_OPTIONS : AMOUNT_OPTIONS).map((value) => (
              <Pressable
                key={value}
                style={[
                  styles.option,
                  isSelected(value) && styles.selectedOption
                ]}
                onPress={() => handleSelectTip(value)}
              >
                <Text style={[
                  styles.optionText,
                  isSelected(value) && styles.selectedOptionText
                ]}>
                  {tipType === 'percentage' ? `${value}%` : `$${value}`}
                </Text>
                {tipType === 'percentage' && (
                  <Text style={styles.calculatedAmount}>
                    ${((subtotal * value) / 100).toFixed(2)}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.noTipButton} onPress={() => handleSelectTip(0)}>
            <Text style={styles.noTipText}>No tip</Text>
          </Pressable>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.light.text
  },
  tipTypeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 4
  },
  tipTypeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6
  },
  selectedTipType: {
    backgroundColor: Colors.light.primary
  },
  tipTypeText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.light.textDim
  },
  selectedTipTypeText: {
    color: Colors.light.background,
    fontWeight: '500'
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20
  },
  option: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.card,
    alignItems: 'center'
  },
  selectedOption: {
    backgroundColor: Colors.light.primary
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text
  },
  selectedOptionText: {
    color: Colors.light.background
  },
  calculatedAmount: {
    fontSize: 14,
    color: Colors.light.textDim,
    marginTop: 4
  },
  noTipButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.card,
    marginBottom: 12
  },
  noTipText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.light.textDim
  },
  closeButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.card
  },
  closeText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.light.text,
    fontWeight: '500'
  }
});