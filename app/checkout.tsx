import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore, OrderItem } from '@/store/orderStore';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import appInfo from '@/constants/appInfo';
import TipDriverModal from '@/components/TipDriverModal';
import PromoCodeInput from '@/components/PromoCodeInput';
import PaymentMethodSelector from '@/components/PaymentMethodSelector';
import { getProductById } from '@/mocks/products';
import { Truck, CheckCircle, Shield } from 'lucide-react-native';
import { PaymentMethod, PaymentInfo } from '@/types/product';

export default function Checkout() {
  const router = useRouter();
  const { items, getCartTotal, getEighthsPromotion, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const { addPoints } = useUserStore();
  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedTip, setSelectedTip] = useState(0);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const subtotal = getCartTotal();
  const eighthsPromo = getEighthsPromotion();
  const deliveryFee = subtotal >= appInfo.freeDeliveryMinimum ? 0 : appInfo.deliveryFee;
  const tax = subtotal * 0.08; // 8% tax
  const promoDiscountAmount = subtotal * promoDiscount;
  const finalTotal = subtotal + deliveryFee + tax + selectedTip - promoDiscountAmount;

  // Convert cart items to order items with product details
  const getOrderItems = (): OrderItem[] => {
    return items.map(item => {
      const product = getProductById(item.id);
      if (!product) {
        console.warn(`Product with id ${item.id} not found`);
        return {
          id: item.id,
          name: item.name || 'Unknown Product',
          price: item.price || 0,
          quantity: item.quantity,
          variant: item.variant,
        };
      }
      
      return {
        id: item.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        variant: item.variant,
      };
    }).filter(item => item.price > 0); // Filter out unknown products
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    // Check purchase limit (1 ounce per day)
    const totalWeight = items.reduce((total, item) => {
      const product = getProductById(item.id);
      if (product?.weight) {
        const weightInOz = parseFloat(product.weight.replace('oz', '').replace('g', '')) / (product.weight.includes('g') ? 28.35 : 1);
        return total + (weightInOz * item.quantity);
      }
      return total;
    }, 0);

    if (totalWeight > 1) {
      Alert.alert(
        'Purchase Limit Exceeded',
        'You can only purchase up to 1 ounce per day. Please reduce your order quantity.',
        [{ text: 'OK' }]
      );
      return;
    }

    const orderItems = getOrderItems();
    if (orderItems.length === 0) {
      Alert.alert('Error', 'No valid items in cart');
      return;
    }

    // Create payment info based on selected method
    const paymentInfo: PaymentInfo = {
      method: paymentMethod,
      // For demo purposes, we'll add mock card info if card is selected
      ...(paymentMethod === 'card' && {
        cardLast4: '4242',
        cardType: 'Visa'
      })
    };

    const orderId = createOrder({
      items: orderItems,
      subtotal,
      deliveryFee,
      tax,
      tip: selectedTip,
      total: finalTotal,
      paymentMethod,
      paymentInfo,
    });

    // Add loyalty points (1 point per $1 spent)
    const pointsEarned = Math.floor(finalTotal);
    addPoints(pointsEarned, `Order #${orderId}`, orderId);

    clearCart();
    router.replace(`/order-confirmation?orderId=${orderId}`);
  };

  const handleSelectTip = (amount: number) => {
    setSelectedTip(amount);
  };

  const handleApplyPromo = (discount: number) => {
    setPromoDiscount(discount);
  };

  const promotion = appInfo.eighthsPromotion;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Checkout</Text>

        {/* Free Delivery Status */}
        <View style={[
          styles.deliveryStatusSection,
          deliveryFee === 0 ? styles.freeDeliveryActive : styles.freeDeliveryInactive
        ]}>
          {deliveryFee === 0 ? (
            <CheckCircle size={24} color={Colors.dark.success} />
          ) : (
            <Truck size={24} color={Colors.dark.primary} />
          )}
          <View style={styles.deliveryStatusText}>
            {deliveryFee === 0 ? (
              <>
                <Text style={styles.freeDeliveryTitle}>🎉 Free Delivery!</Text>
                <Text style={styles.freeDeliverySubtitle}>
                  Your order qualifies for free delivery
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.deliveryFeeTitle}>Delivery Fee: ${deliveryFee.toFixed(2)}</Text>
                <Text style={styles.deliveryFeeSubtitle}>
                  Add ${(appInfo.freeDeliveryMinimum - subtotal).toFixed(2)} more for free delivery
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item, index) => {
            const product = getProductById(item.id);
            const itemName = product?.name || item.name || 'Unknown Product';
            const itemPrice = product?.price || item.price || 0;
            
            return (
              <View key={`${item.id}-${index}`} style={styles.orderItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{itemName}</Text>
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                  {item.variant && (
                    <Text style={styles.itemVariant}>Variant: {item.variant}</Text>
                  )}
                </View>
                <Text style={styles.itemPrice}>${(itemPrice * item.quantity).toFixed(2)}</Text>
              </View>
            );
          })}
        </View>

        {/* Eighths Promotion */}
        {eighthsPromo.eligible && promotion && (
          <View style={styles.promotionSection}>
            <Text style={styles.promotionTitle}>🎉 {promotion.title}</Text>
            <Text style={styles.promotionSubtitle}>{promotion.subtitle}</Text>
            <View style={styles.promotionDetails}>
              <Text style={styles.promotionText}>
                {eighthsPromo.discountedEighths} eighth{eighthsPromo.discountedEighths !== 1 ? 's' : ''} for $1 each
              </Text>
              <Text style={styles.promotionSavings}>
                You save: ${eighthsPromo.savings.toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Promo Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          <PromoCodeInput onApply={handleApplyPromo} />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onSelectMethod={setPaymentMethod}
          />
        </View>

        {/* Pricing Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Total</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
          </View>

          {eighthsPromo.eligible && (
            <View style={styles.priceRow}>
              <Text style={styles.promoLabel}>Eighths Special Discount</Text>
              <Text style={styles.promoValue}>-${eighthsPromo.savings.toFixed(2)}</Text>
            </View>
          )}

          {promoDiscount > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.promoLabel}>Promo Code Discount</Text>
              <Text style={styles.promoValue}>-${promoDiscountAmount.toFixed(2)}</Text>
            </View>
          )}
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery Fee</Text>
            <Text style={[
              styles.priceValue,
              deliveryFee === 0 && styles.freeDeliveryValue
            ]}>
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
          {deliveryFee === 0 ? (
            <Text style={styles.freeDeliveryInfo}>
              🎉 You qualify for free delivery on orders over ${appInfo.freeDeliveryMinimum}!
            </Text>
          ) : (
            <Text style={styles.deliveryInfo}>
              Add ${(appInfo.freeDeliveryMinimum - subtotal).toFixed(2)} more for free delivery
            </Text>
          )}
          <Text style={styles.paymentMethodInfo}>
            Payment method: {paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
          </Text>
          {paymentMethod === 'cash' && (
            <Text style={styles.cashDeliveryNote}>
              MUST SHOW ID BEFORE HANDING OVER MERCHANDISE
            </Text>
          )}
        </View>

        {/* Refund Policy */}
        <View style={styles.refundPolicySection}>
          <Shield size={20} color={Colors.dark.primary} />
          <View style={styles.refundPolicyText}>
            <Text style={styles.refundPolicyTitle}>💰 {appInfo.refundPolicy.description}</Text>
            <Text style={styles.refundPolicySubtitle}>
              Not satisfied? Request a full refund within {appInfo.refundPolicy.timeLimit} hours of delivery. 
              Processing time: {appInfo.refundPolicy.processingTime}.
            </Text>
          </View>
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
  deliveryStatusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  freeDeliveryActive: {
    borderColor: Colors.dark.success,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  freeDeliveryInactive: {
    borderColor: Colors.dark.primary,
  },
  deliveryStatusText: {
    marginLeft: 12,
    flex: 1,
  },
  freeDeliveryTitle: {
    color: Colors.dark.success,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  freeDeliverySubtitle: {
    color: Colors.dark.success,
    fontSize: 14,
    fontWeight: '500',
  },
  deliveryFeeTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  deliveryFeeSubtitle: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '500',
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
  promotionSection: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  promotionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  promotionDetails: {
    alignItems: 'center',
  },
  promotionText: {
    fontSize: 14,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  promotionSavings: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
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
  itemQuantity: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginTop: 2,
  },
  itemVariant: {
    fontSize: 12,
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
  freeDeliveryValue: {
    color: Colors.dark.success,
    fontWeight: 'bold',
  },
  promoLabel: {
    fontSize: 16,
    color: Colors.dark.success,
  },
  promoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.success,
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
  freeDeliveryInfo: {
    fontSize: 14,
    color: Colors.dark.success,
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentMethodInfo: {
    fontSize: 14,
    color: Colors.dark.primary,
    fontWeight: '600',
    marginTop: 8,
  },
  cashDeliveryNote: {
    fontSize: 12,
    color: Colors.dark.error || '#ff6b6b',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.dark.error || '#ff6b6b',
  },
  refundPolicySection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },
  refundPolicyText: {
    marginLeft: 12,
    flex: 1,
  },
  refundPolicyTitle: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  refundPolicySubtitle: {
    color: Colors.dark.primary,
    fontSize: 14,
    lineHeight: 18,
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