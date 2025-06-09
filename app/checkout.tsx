import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, CreditCard, Truck, Check, Tag, Clock, Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { useOrderStore } from '@/store/orderStore';
import PromoCodeInput from '@/components/PromoCodeInput';
import AddressModal from '@/components/AddressModal';
import appInfo from '@/constants/appInfo';

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { addresses, selectedAddressIndex, isNewUser, hasUsedDiscount, markDiscountAsUsed, selectAddress } = useUserStore();
  const { addOrder } = useOrderStore();
  
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddressError, setShowAddressError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const cartTotal = getCartTotal();
  const deliveryFee = deliveryMethod === 'express' ? 10 : 5;
  const taxRate = 0.08; // 8% tax
  
  // Apply 20% discount for new users who have not used their discount
  const isDiscountApplicable = isNewUser && !hasUsedDiscount;
  const discountRate = isDiscountApplicable ? 0.2 : 0;
  const discountAmount = cartTotal * discountRate;
  
  // Apply promo code discount if applicable
  const promoDiscountAmount = cartTotal * promoDiscount;
  
  const subtotalAfterDiscount = cartTotal - discountAmount - promoDiscountAmount;
  const taxAmount = subtotalAfterDiscount * taxRate;
  const totalAmount = subtotalAfterDiscount + deliveryFee + taxAmount;
  
  const selectedAddress = addresses[selectedAddressIndex];
  const hasAddress = addresses.length > 0 && selectedAddressIndex < addresses.length;

  // Check if address is needed and show error if not present
  useEffect(() => {
    if (items.length > 0 && !hasAddress) {
      setShowAddressError(true);
    } else {
      setShowAddressError(false);
    }
  }, [items.length, hasAddress]);

  // Auto-open address modal if no address is available
  useEffect(() => {
    if (items.length > 0 && !hasAddress && !showAddressModal) {
      setShowAddressModal(true);
    }
  }, [items.length, hasAddress, showAddressModal]);

  // Ensure we have a valid selected address index
  useEffect(() => {
    if (addresses.length > 0 && selectedAddressIndex >= addresses.length) {
      selectAddress(0);
    }
  }, [addresses, selectedAddressIndex, selectAddress]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart');
    }
  }, [items.length, router]);

  // Estimated processing and delivery times
  const getProcessingTime = () => {
    return deliveryMethod === 'express' ? '15-30 minutes' : '30-60 minutes';
  };

  const getEstimatedDeliveryTime = () => {
    const now = new Date();
    const deliveryDate = new Date(now);
    
    if (deliveryMethod === 'express') {
      deliveryDate.setHours(deliveryDate.getHours() + 2);
      return `Today, ${formatTime(deliveryDate)}`;
    } else {
      deliveryDate.setHours(deliveryDate.getHours() + 24);
      return `Tomorrow, ${formatTime(deliveryDate)}`;
    }
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const handleApplyPromoCode = (discount: number) => {
    setPromoDiscount(discount);
  };

  const handleAddAddress = () => {
    setShowAddressModal(true);
  };

  const validateCardDetails = () => {
    if (paymentMethod !== 'card') return true;
    
    if (!cardNumber.trim()) {
      Alert.alert('Error', 'Please enter your card number');
      return false;
    }
    
    if (!cardExpiry.trim()) {
      Alert.alert('Error', 'Please enter card expiry date');
      return false;
    }
    
    if (!cardCvv.trim()) {
      Alert.alert('Error', 'Please enter CVV');
      return false;
    }
    
    // Basic card number validation (remove spaces and check length)
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      Alert.alert('Error', 'Please enter a valid card number');
      return false;
    }
    
    // Basic expiry validation
    const expiryParts = cardExpiry.split('/');
    if (expiryParts.length !== 2) {
      Alert.alert('Error', 'Please enter expiry in MM/YY format');
      return false;
    }
    
    const month = parseInt(expiryParts[0], 10);
    const year = parseInt(expiryParts[1], 10);
    
    if (month < 1 || month > 12) {
      Alert.alert('Error', 'Please enter a valid month');
      return false;
    }
    
    // Check if card is expired
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    const currentMonth = currentDate.getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      Alert.alert('Error', 'Card has expired');
      return false;
    }
    
    // Basic CVV validation
    if (cardCvv.length < 3 || cardCvv.length > 4) {
      Alert.alert('Error', 'Please enter a valid CVV');
      return false;
    }
    
    return true;
  };

  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    
    if (!hasAddress) {
      Alert.alert('Error', 'Please add a delivery address');
      setShowAddressModal(true);
      return;
    }
    
    if (!validateCardDetails()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create a new order
      const orderId = Math.random().toString(36).substring(2, 10);
      const now = new Date();
      const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      
      const addressString = `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zipCode}`;
      
      // Calculate estimated delivery time
      const estimatedDelivery = getEstimatedDeliveryTime();
      const estimatedProcessingTime = getProcessingTime();
      
      const newOrder = {
        id: orderId,
        items: [...items],
        total: totalAmount,
        date: formattedDate,
        status: 'pending' as const,
        deliveryAddress: addressString,
        estimatedDelivery,
        estimatedProcessingTime,
        discountApplied: isDiscountApplicable ? discountAmount : 0,
        promoCodeApplied: promoDiscount > 0 ? appInfo.promoCode : undefined,
        tipAmount: 0, // Initialize tip amount to 0
        estimatedArrival: 'on-time' as const, // Set default estimated arrival
      };
      
      // Mark discount as used if it was applied
      if (isDiscountApplicable) {
        markDiscountAsUsed();
      }
      
      addOrder(newOrder);
      clearCart();
      
      router.push({
        pathname: '/order-confirmation',
        params: { orderId }
      });
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
    // If we still do not have an address, show the error
    if (!hasAddress) {
      setShowAddressError(true);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    const groups = [];
    
    for (let i = 0; i < cleaned.length; i += 4) {
      groups.push(cleaned.substring(i, i + 4));
    }
    
    return groups.join(' ');
  };

  // Format card expiry with slash
  const formatCardExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length <= 2) {
      return cleaned;
    }
    
    return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    if (formatted.length <= 23) { // Max length for formatted card number
      setCardNumber(formatted);
    }
  };

  const handleCardExpiryChange = (text: string) => {
    const formatted = formatCardExpiry(text);
    setCardExpiry(formatted);
  };

  const handleCardCvvChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 4) {
      setCardCvv(cleaned);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        {hasAddress ? (
          <View style={styles.addressCard}>
            <MapPin size={20} color={Colors.dark.primary} style={styles.addressIcon} />
            <View style={styles.addressContent}>
              <Text style={styles.addressText}>
                {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
              </Text>
              <Pressable 
                style={styles.changeAddressButton}
                onPress={handleAddAddress}
              >
                <Text style={styles.changeAddressText}>Change</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={[styles.noAddressContainer, showAddressError && styles.errorContainer]}>
            <Text style={[styles.noAddressText, showAddressError && styles.errorText]}>
              {showAddressError ? 'Delivery address required to continue' : 'No delivery address saved'}
            </Text>
            <Pressable 
              style={[styles.addAddressButton, showAddressError && styles.errorButton]}
              onPress={handleAddAddress}
            >
              <Plus size={16} color={showAddressError ? Colors.dark.error : Colors.dark.primary} style={styles.addIcon} />
              <Text style={[styles.addAddressButtonText, showAddressError && styles.errorButtonText]}>
                Add Address
              </Text>
            </Pressable>
          </View>
        )}
        
        <Text style={styles.sectionTitle}>Delivery Method</Text>
        <View style={styles.deliveryOptions}>
          <Pressable 
            style={[
              styles.deliveryOption, 
              deliveryMethod === 'standard' && styles.selectedDeliveryOption
            ]}
            onPress={() => setDeliveryMethod('standard')}
          >
            <View style={styles.deliveryOptionHeader}>
              <Truck size={20} color={Colors.dark.text} />
              <Text style={styles.deliveryOptionTitle}>Standard</Text>
              {deliveryMethod === 'standard' && (
                <View style={styles.checkCircle}>
                  <Check size={16} color={Colors.dark.text} />
                </View>
              )}
            </View>
            <Text style={styles.deliveryOptionDescription}>Delivery within 24 hours</Text>
            <View style={styles.deliveryTimeRow}>
              <Clock size={16} color={Colors.dark.subtext} />
              <Text style={styles.deliveryTimeText}>Estimated delivery: Tomorrow</Text>
            </View>
            <Text style={styles.deliveryOptionPrice}>$5.00</Text>
          </Pressable>
          
          <Pressable 
            style={[
              styles.deliveryOption, 
              deliveryMethod === 'express' && styles.selectedDeliveryOption
            ]}
            onPress={() => setDeliveryMethod('express')}
          >
            <View style={styles.deliveryOptionHeader}>
              <Truck size={20} color={Colors.dark.text} />
              <Text style={styles.deliveryOptionTitle}>Express</Text>
              {deliveryMethod === 'express' && (
                <View style={styles.checkCircle}>
                  <Check size={16} color={Colors.dark.text} />
                </View>
              )}
            </View>
            <Text style={styles.deliveryOptionDescription}>Delivery within 2 hours</Text>
            <View style={styles.deliveryTimeRow}>
              <Clock size={16} color={Colors.dark.subtext} />
              <Text style={styles.deliveryTimeText}>Estimated delivery: Today</Text>
            </View>
            <Text style={styles.deliveryOptionPrice}>$10.00</Text>
          </Pressable>
        </View>
        
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentOptions}>
          <Pressable 
            style={[
              styles.paymentOption, 
              paymentMethod === 'card' && styles.selectedPaymentOption
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <View style={styles.paymentOptionHeader}>
              <CreditCard size={20} color={Colors.dark.text} />
              <Text style={styles.paymentOptionTitle}>Credit Card</Text>
              {paymentMethod === 'card' && (
                <View style={styles.checkCircle}>
                  <Check size={16} color={Colors.dark.text} />
                </View>
              )}
            </View>
          </Pressable>
          
          <Pressable 
            style={[
              styles.paymentOption, 
              paymentMethod === 'cash' && styles.selectedPaymentOption
            ]}
            onPress={() => setPaymentMethod('cash')}
          >
            <View style={styles.paymentOptionHeader}>
              <Text style={styles.cashIcon}>$</Text>
              <Text style={styles.paymentOptionTitle}>Cash on Delivery</Text>
              {paymentMethod === 'cash' && (
                <View style={styles.checkCircle}>
                  <Check size={16} color={Colors.dark.text} />
                </View>
              )}
            </View>
          </Pressable>
        </View>
        
        {paymentMethod === 'card' && (
          <View style={styles.cardDetailsContainer}>
            <Text style={styles.cardDetailsTitle}>Card Details</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={Colors.dark.subtext}
                keyboardType="number-pad"
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                maxLength={23}
              />
            </View>
            
            <View style={styles.cardDetailsRow}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor={Colors.dark.subtext}
                  keyboardType="number-pad"
                  value={cardExpiry}
                  onChangeText={handleCardExpiryChange}
                  maxLength={5}
                />
              </View>
              
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  placeholderTextColor={Colors.dark.subtext}
                  keyboardType="number-pad"
                  value={cardCvv}
                  onChangeText={handleCardCvvChange}
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        )}
        
        <Text style={styles.sectionTitle}>Promo Code</Text>
        <PromoCodeInput onApply={handleApplyPromoCode} />
        
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${cartTotal.toFixed(2)}</Text>
          </View>
          
          {isDiscountApplicable && (
            <View style={styles.discountRow}>
              <View style={styles.discountLabelContainer}>
                <Tag size={16} color={Colors.dark.secondary} style={styles.discountIcon} />
                <Text style={styles.discountLabel}>New Customer Discount (20%)</Text>
              </View>
              <Text style={styles.discountValue}>-${discountAmount.toFixed(2)}</Text>
            </View>
          )}
          
          {promoDiscount > 0 && (
            <View style={styles.discountRow}>
              <View style={styles.discountLabelContainer}>
                <Tag size={16} color={Colors.dark.primary} style={styles.discountIcon} />
                <Text style={styles.discountLabel}>Promo: {appInfo.promoCode}</Text>
              </View>
              <Text style={styles.discountValue}>-${promoDiscountAmount.toFixed(2)}</Text>
            </View>
          )}
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${taxAmount.toFixed(2)}</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
          </View>
          
          <View style={styles.estimatedTimeContainer}>
            <Clock size={16} color={Colors.dark.primary} style={styles.timeIcon} />
            <View>
              <Text style={styles.estimatedTimeLabel}>Estimated Processing Time:</Text>
              <Text style={styles.estimatedTimeValue}>{getProcessingTime()}</Text>
              <Text style={styles.estimatedTimeLabel}>Estimated Delivery:</Text>
              <Text style={styles.estimatedTimeValue}>{getEstimatedDeliveryTime()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Pressable 
          style={[
            styles.placeOrderButton, 
            (!hasAddress || isProcessing) && styles.disabledButton
          ]}
          onPress={handlePlaceOrder}
          disabled={!hasAddress || isProcessing}
        >
          <Text style={styles.placeOrderButtonText}>
            {isProcessing 
              ? 'Processing...' 
              : !hasAddress 
                ? 'Add Address to Continue' 
                : 'Place Order'
            }
          </Text>
        </Pressable>
      </View>

      <AddressModal 
        visible={showAddressModal}
        onClose={handleCloseAddressModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  addressIcon: {
    marginRight: 12,
  },
  addressContent: {
    flex: 1,
  },
  addressText: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  changeAddressButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  changeAddressText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  noAddressContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  errorContainer: {
    borderColor: Colors.dark.error,
    borderWidth: 1,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  noAddressText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 8,
  },
  errorText: {
    color: Colors.dark.error,
    fontWeight: '500',
  },
  addAddressButton: {
    backgroundColor: Colors.dark.background,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
  },
  addIcon: {
    marginRight: 6,
  },
  addAddressButtonText: {
    color: Colors.dark.primary,
    fontSize: 14,
  },
  errorButtonText: {
    color: Colors.dark.error,
  },
  deliveryOptions: {
    marginBottom: 8,
  },
  deliveryOption: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  selectedDeliveryOption: {
    borderColor: Colors.dark.primary,
    borderWidth: 1,
  },
  deliveryOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryOptionTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryOptionDescription: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 8,
  },
  deliveryTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryTimeText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    marginLeft: 6,
  },
  deliveryOptionPrice: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  paymentOptions: {
    marginBottom: 8,
  },
  paymentOption: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  selectedPaymentOption: {
    borderColor: Colors.dark.primary,
    borderWidth: 1,
  },
  paymentOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentOptionTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  cashIcon: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardDetailsContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  cardDetailsTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  summaryContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 8,
    padding: 8,
  },
  discountLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountIcon: {
    marginRight: 6,
  },
  discountLabel: {
    color: Colors.dark.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  discountValue: {
    color: Colors.dark.secondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryLabel: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  summaryValue: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    paddingTop: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  totalLabel: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    color: Colors.dark.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  estimatedTimeContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
  },
  timeIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  estimatedTimeLabel: {
    color: Colors.dark.subtext,
    fontSize: 12,
    marginBottom: 2,
  },
  estimatedTimeValue: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  footer: {
    backgroundColor: Colors.dark.card,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  placeOrderButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.dark.subtext,
    opacity: 0.8,
  },
  placeOrderButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});