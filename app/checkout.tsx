// Previous imports remain the same...

export default function CheckoutScreen() {
  // Previous state variables remain the same...
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  
  // Previous code remains the same until the summaryContainer...
  
  return (
    <View style={styles.container}>
      {/* Previous content remains the same... */}
      
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
        
        {tipAmount > 0 ? (
          <Text style={styles.tipAmount}>
            ${tipAmount.toFixed(2)} ({((tipAmount / subtotalAfterDiscount) * 100).toFixed(1)}%)
          </Text>
        ) : (
          <Text style={styles.noTipText}>No tip added</Text>
        )}
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
        onSelectTip={(amount) => setTipAmount(amount)}
        initialTip={tipAmount}
      />

      {/* Rest of the component remains the same... */}
    </View>
  );
}

// Styles remain the same...