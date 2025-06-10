// Previous imports remain the same...
// Add this line to imports:
import TipDriverModal from '@/components/TipDriverModal';

export default function CheckoutScreen() {
  // Previous state variables remain the same...
  // Add these new state variables:
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  
  // Previous code remains the same until the summaryContainer...
  // Inside the summaryContainer, add the tip section before the total:
  
  {/* Add this section before the totalRow */}
  <View style={styles.tipSection}>
    <View style={styles.tipHeader}>
      <Text style={styles.tipLabel}>Driver Tip</Text>
      <Pressable 
        style={styles.changeTipButton}
        onPress={() => setShowTipModal(true)}
      >
        <Text style={styles.changeTipText}>
          {tipAmount > 0 ? 'Change' : 'Add'}
        </Text>
      </Pressable>
    </View>
    
    {tipAmount > 0 ? (
      <Text style={styles.tipAmount}>
        ${tipAmount.toFixed(2)} ({((tipAmount / subtotalAfterDiscount) * 100).toFixed(1)}%)
      </Text>
    ) : (
      <Text style={styles.noTipText}>No tip added</Text>
    )}
  </View>

  {/* Update the total calculation to include tip */}
  <View style={[styles.summaryRow, styles.totalRow]}>
    <Text style={styles.totalLabel}>Total</Text>
    <Text style={styles.totalValue}>
      ${(subtotalAfterDiscount + deliveryFee + taxAmount + tipAmount).toFixed(2)}
    </Text>
  </View>

  {/* Add the TipDriverModal */}
  <TipDriverModal
    visible={showTipModal}
    onClose={() => setShowTipModal(false)}
    subtotal={subtotalAfterDiscount}
    onSelectTip={(amount) => setTipAmount(amount)}
    initialTip={tipAmount}
  />

  {/* The rest of the code remains the same... */}

// Add these new styles:
const additionalStyles = StyleSheet.create({
  tipSection: {
    marginBottom: 16,
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipLabel: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  changeTipButton: {
    backgroundColor: Colors.dark.card,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  changeTipText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  tipAmount: {
    color: Colors.dark.success,
    fontSize: 16,
    fontWeight: '500',
  },
  noTipText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    fontStyle: 'italic',
  },
});

// Merge the new styles with existing ones
const styles = StyleSheet.create({
  ...existingStyles,
  ...additionalStyles,
});