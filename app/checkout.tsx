import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Colors } from '@/constants/colors';
import { TipDriverModal } from '@/components/TipDriverModal';

export default function CheckoutScreen() {
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  const [tipType, setTipType] = useState<'percentage' | 'amount'>('percentage');
  
  const subtotalAfterDiscount = 50; // Example value
  const deliveryFee = 5;
  const taxAmount = 4;
  
  const tipPercentage = ((tipAmount / subtotalAfterDiscount) * 100);
  
  const renderTipAmount = () => {
    if (tipAmount <= 0) {
      return <Text style={styles.noTipText}>No tip added</Text>;
    }
    
    return (
      <View style={styles.tipAmountContainer}>
        <Text style={styles.tipAmount}>
          ${tipAmount.toFixed(2)}
        </Text>
        <Text style={styles.tipPercentage}>
          ({tipPercentage.toFixed(1)}%)
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tipSection}>
        <View style={styles.tipHeader}>
          <Text style={styles.tipLabel}>Driver Tip</Text>
          <Pressable 
            style={styles.changeTipButton}
            onPress={() => setShowTipModal(true)}
          >
            <Text style={styles.changeTipText}>
              {tipAmount > 0 ? "Change" : "Add"}
            </Text>
          </Pressable>
        </View>
        
        {renderTipAmount()}
      </View>

      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>
          ${(subtotalAfterDiscount + deliveryFee + taxAmount + tipAmount).toFixed(2)}
        </Text>
      </View>

      <TipDriverModal
        visible={showTipModal}
        onClose={() => setShowTipModal(false)}
        subtotal={subtotalAfterDiscount}
        onSelectTip={setTipAmount}
        initialTip={tipAmount}
        tipType={tipType}
        onTipTypeChange={setTipType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.background
  },
  tipSection: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 12
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  tipLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text
  },
  changeTipButton: {
    padding: 8
  },
  changeTipText: {
    color: Colors.light.primary,
    fontWeight: '500'
  },
  tipAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  tipAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text
  },
  tipPercentage: {
    fontSize: 14,
    color: Colors.light.textDim
  },
  noTipText: {
    fontSize: 16,
    color: Colors.light.textDim
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4
  },
  totalRow: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text
  }
});