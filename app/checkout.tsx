import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import Colors from '@/constants/colors';
import appInfo from '@/constants/appInfo';
import { TipDriverModal } from '@/components/TipDriverModal';

export default function Checkout() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedTip, setSelectedTip] = useState(0);

  const subtotal = total;
  const deliveryFee = subtotal >= appInfo.freeDeliveryMinimum ? 0 : appInfo.deliveryFee;
  const tax = subtotal * 0.08; // 8% tax
  const finalTotal = subtotal + deliveryFee + tax + selectedTip;

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    const orderId = createOrder({
      items,
      subtotal,
      deliveryFee,
      tax,
      tip: selectedTip,
      total: finalTotal,
    });

    clearCart();
    router.replace(`/order-confirmation?orderId=${orderId}`);
  };

  const handleSelectTip = (amount: number) => {
    setSelectedTip(amount);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Checkout</Text>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item) => (
            <View key={`${item.id}-${item.variant || 'default'}`} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.variant && (
                  <Text style={styles.itemVariant}>{item.variant}</Text>
                )}
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Pricing Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Total</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery Fee</Text>
            <Text style={styles.priceValue}>
              {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
            </Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax</Text>
            <Text style={styles.priceValue}>${tax.toFixed(2)}</Text>
          </View>

          {/* Driver Tip Section */}
          <View style={styles.tipSection}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Driver Tip</Text>
              <Pressable 
                style={styles.tipButton}
                onPress={() => setShowTipModal(true)}
              >
                <Text style={styles.tipButtonText}>
                  {selectedTip > 0 ? `$${selectedTip.toFixed(2)}` : 'Add Tip'}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.tipSubtext}>
              Show your appreciation for great service!
            </Text>
          </View>

          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Delivery Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <Text style={styles.deliveryInfo}>
            Estimated delivery: {appInfo.estimatedDeliveryTime}
          </Text>
          <Text style={styles.deliveryInfo}>
            {subtotal >= appInfo.freeDeliveryMinimum 
              ? 'Free delivery on orders over $50!' 
              : `Add $${(appInfo.freeDeliveryMinimum - subtotal).toFixed(2)} more for free delivery`
            }
          </Text>
        </View>

        {/* Place Order Button */}
        <Pressable style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>
            Place Order • ${finalTotal.toFixed(2)}
          </Text>
        </Pressable>
      </View>

      <TipDriverModal
        isVisible={showTipModal}
        onClose={() => setShowTipModal(false)}
        onSelectTip={handleSelectTip}
        orderTotal={subtotal}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 20,
  },
  section: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  itemVariant: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginTop: 2,
  },
  itemQuantity: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  tipSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    paddingTop: 12,
    marginTop: 8,
  },
  tipButton: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tipButtonText: {
    color: Colors.dark.text,
    fontWeight: '600',
    fontSize: 14,
  },
  tipSubtext: {
    fontSize: 12,
    color: Colors.dark.subtext,
    marginTop: 4,
    textAlign: 'center',
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: Colors.dark.border,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.primary,
  },
  deliveryInfo: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 4,
  },
  placeOrderButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  placeOrderText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
});