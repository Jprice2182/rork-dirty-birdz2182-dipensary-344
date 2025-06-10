import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import appInfo from '@/constants/appInfo';

interface TipDriverModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectTip: (amount: number) => void;
  orderTotal: number;
}

export function TipDriverModal({ isVisible, onClose, onSelectTip, orderTotal }: TipDriverModalProps) {
  const tipPercentages = appInfo.defaultTipPercentages;

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
          
          <View style={styles.tipGrid}>
            {tipPercentages.map((percentage) => {
              const tipAmount = (orderTotal * percentage) / 100;
              return (
                <Pressable
                  key={percentage}
                  style={styles.tipButton}
                  onPress={() => {
                    onSelectTip(tipAmount);
                    onClose();
                  }}
                >
                  <Text style={styles.tipPercentage}>{percentage}%</Text>
                  <Text style={styles.tipAmount}>${tipAmount.toFixed(2)}</Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
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
    marginBottom: 20,
    textAlign: 'center',
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
  closeButton: {
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.dark.border,
    width: '100%',
  },
  closeText: {
    color: Colors.dark.text,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});