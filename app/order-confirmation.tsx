import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, Home, Package, Tag, Clock, Truck, CreditCard, DollarSign, Shield } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useOrderStore } from '@/store/orderStore';
import appInfo from '@/constants/appInfo';

export default function OrderConfirmationScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const { getOrderById } = useOrderStore();
  const order = getOrderById(orderId);

  useEffect(() => {
    if (!order) {
      router.replace('/');
    }
  }, [order, router]);

  if (!order) {
    return null;
  }

  const handleViewOrder = () => {
    router.push(`/order/${orderId}`);
  };

  const handleGoHome = () => {
    router.replace('/');
  };

  const isFreeDelivery = order.deliveryFee === 0;

  const getPaymentMethodIcon = () => {
    return order.paymentMethod === 'card' ? 
      <CreditCard size={16} color={Colors.dark.primary} /> : 
      <DollarSign size={16} color={Colors.dark.primary} />;
  };

  const getPaymentMethodText = () => {
    if (order.paymentMethod === 'card') {
      return order.paymentInfo?.cardLast4 ? 
        `${order.paymentInfo.cardType} ending in ${order.paymentInfo.cardLast4}` : 
        'Credit/Debit Card';
    }
    return 'Cash on Delivery';
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color={Colors.dark.success} />
        </View>
        
        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.message}>
          Your order has been placed successfully. We'll notify you when your order is on its way.
        </Text>
        
        <View style={styles.orderInfoContainer}>
          <Text style={styles.orderInfoTitle}>Order Information</Text>
          
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Order Number</Text>
            <Text style={styles.orderInfoValue}>#{orderId.slice(0, 8)}</Text>
          </View>
          
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Date</Text>
            <Text style={styles.orderInfoValue}>{order.date}</Text>
          </View>

          {/* Payment Method */}
          <View style={styles.paymentMethodRow}>
            <View style={styles.paymentMethodLabelContainer}>
              {getPaymentMethodIcon()}
              <Text style={styles.paymentMethodLabel}>Payment Method</Text>
            </View>
            <Text style={styles.paymentMethodValue}>{getPaymentMethodText()}</Text>
          </View>

          {/* Free Delivery Highlight */}
          {isFreeDelivery && (
            <View style={styles.freeDeliveryRow}>
              <View style={styles.freeDeliveryLabelContainer}>
                <Truck size={16} color={Colors.dark.success} style={styles.freeDeliveryIcon} />
                <Text style={styles.freeDeliveryLabel}>Free Delivery</Text>
              </View>
              <Text style={styles.freeDeliveryValue}>$0.00</Text>
            </View>
          )}
          
          {order.discountApplied && order.discountApplied > 0 && (
            <View style={styles.discountInfoRow}>
              <View style={styles.discountLabelContainer}>
                <Tag size={16} color={Colors.dark.secondary} style={styles.discountIcon} />
                <Text style={styles.discountLabel}>New Customer Discount</Text>
              </View>
              <Text style={styles.discountValue}>-${order.discountApplied.toFixed(2)}</Text>
            </View>
          )}
          
          {order.promoCodeApplied && (
            <View style={styles.discountInfoRow}>
              <View style={styles.discountLabelContainer}>
                <Tag size={16} color={Colors.dark.primary} style={styles.discountIcon} />
                <Text style={styles.discountLabel}>Promo: {order.promoCodeApplied}</Text>
              </View>
              <Text style={styles.discountValue}>-${(order.total * 0.2).toFixed(2)}</Text>
            </View>
          )}
          
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Total Amount</Text>
            <Text style={styles.orderInfoValue}>${order.total.toFixed(2)}</Text>
          </View>
          
          <View style={styles.timeInfoContainer}>
            <Clock size={20} color={Colors.dark.primary} style={styles.timeIcon} />
            <View>
              <View style={styles.timeInfoRow}>
                <Text style={styles.timeInfoLabel}>Processing Time:</Text>
                <Text style={styles.timeInfoValue}>{order.estimatedProcessingTime || "30-60 minutes"}</Text>
              </View>
              <View style={styles.timeInfoRow}>
                <Text style={styles.timeInfoLabel}>Estimated Delivery:</Text>
                <Text style={styles.timeInfoValue}>{appInfo.estimatedDeliveryTime}</Text>
              </View>
              {isFreeDelivery && (
                <View style={styles.timeInfoRow}>
                  <Text style={styles.freeDeliveryNote}>
                    🎉 You saved ${appInfo.deliveryFee.toFixed(2)} with free delivery!
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Refund Policy Information */}
          <View style={styles.refundPolicyContainer}>
            <Shield size={20} color={Colors.dark.primary} style={styles.refundPolicyIcon} />
            <View style={styles.refundPolicyText}>
              <Text style={styles.refundPolicyTitle}>💰 {appInfo.refundPolicy.description}</Text>
              <Text style={styles.refundPolicySubtitle}>
                Not satisfied? Request a full refund within {appInfo.refundPolicy.timeLimit} hours of delivery.
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Pressable style={styles.viewOrderButton} onPress={handleViewOrder}>
          <Package size={20} color={Colors.dark.text} />
          <Text style={styles.viewOrderButtonText}>View Order</Text>
        </Pressable>
        
        <Pressable style={styles.homeButton} onPress={handleGoHome}>
          <Home size={20} color={Colors.dark.text} />
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </Pressable>
      </View>
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
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    color: Colors.dark.subtext,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  orderInfoContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  orderInfoTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 8,
  },
  paymentMethodLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodLabel: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  paymentMethodValue: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  freeDeliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    borderRadius: 8,
    padding: 8,
  },
  freeDeliveryLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeDeliveryIcon: {
    marginRight: 6,
  },
  freeDeliveryLabel: {
    color: Colors.dark.success,
    fontSize: 14,
    fontWeight: '600',
  },
  freeDeliveryValue: {
    color: Colors.dark.success,
    fontSize: 14,
    fontWeight: 'bold',
  },
  discountInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  orderInfoLabel: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  orderInfoValue: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  timeInfoContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  timeIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  timeInfoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  timeInfoLabel: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginRight: 6,
  },
  timeInfoValue: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  freeDeliveryNote: {
    color: Colors.dark.success,
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  refundPolicyContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  refundPolicyIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  refundPolicyText: {
    flex: 1,
  },
  refundPolicyTitle: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  refundPolicySubtitle: {
    color: Colors.dark.primary,
    fontSize: 12,
    lineHeight: 16,
  },
  footer: {
    padding: 16,
    gap: 12,
  },
  viewOrderButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewOrderButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  homeButton: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});