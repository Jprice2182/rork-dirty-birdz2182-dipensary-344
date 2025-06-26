import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Phone, Clock, Package, Truck, CheckCircle, AlertCircle, Tag, Star, Map, XCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useOrderStore } from '@/store/orderStore';
import { getProductById } from '@/mocks/products';
import RateDriverModal from '@/components/RateDriverModal';
import { useUserStore } from '@/store/userStore';
import RatingStars from '@/components/RatingStars';
import DriverTrackingMap from '@/components/DriverTrackingMap';
import CancelOrderModal from '@/components/CancelOrderModal';
import TipDriverModal from '@/components/TipDriverModal';
import appInfo from '@/constants/appInfo';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrderById } = useOrderStore();
  const { driverRatings } = useUserStore();
  const order = getOrderById(id);
  const [showRateDriverModal, setShowRateDriverModal] = useState(false);
  const [showTrackingMap, setShowTrackingMap] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);

  if (!order) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Order not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const getStatusIcon = () => {
    switch (order.status) {
      case 'pending':
        return <Clock size={24} color={Colors.dark.warning} />;
      case 'processing':
        return <Package size={24} color={Colors.dark.primary} />;
      case 'out-for-delivery':
        return <Truck size={24} color={Colors.dark.secondary} />;
      case 'delivered':
        return <CheckCircle size={24} color={Colors.dark.success} />;
      case 'cancelled':
        return <AlertCircle size={24} color={Colors.dark.error} />;
      default:
        return <Clock size={24} color={Colors.dark.warning} />;
    }
  };

  const getStatusText = () => {
    switch (order.status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'out-for-delivery':
        return 'Out for delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  const handleRateDriver = () => {
    if (order.status !== 'delivered') {
      Alert.alert(
        "Cannot Rate Yet",
        "You can rate your driver after the order has been delivered."
      );
      return;
    }
    
    setShowRateDriverModal(true);
  };

  const handleTrackDriver = () => {
    if (order.status !== 'out-for-delivery') {
      Alert.alert(
        "Tracking Unavailable",
        "Driver tracking is only available when your order is out for delivery."
      );
      return;
    }
    
    setShowTrackingMap(true);
  };

  const handleCancelOrder = () => {
    if (order.status === 'delivered' || order.status === 'cancelled') {
      Alert.alert(
        "Cannot Cancel",
        "This order cannot be cancelled because it has already been delivered or cancelled."
      );
      return;
    }
    
    if (order.status === 'out-for-delivery') {
      Alert.alert(
        "Cannot Cancel",
        "This order cannot be cancelled because it is already out for delivery. Please contact customer service for assistance."
      );
      return;
    }
    
    setShowCancelModal(true);
  };

  const handleTipDriver = () => {
    if (order.status !== 'delivered' && order.status !== 'out-for-delivery') {
      Alert.alert(
        "Cannot Tip Yet",
        "You can tip your driver when your order is out for delivery or has been delivered."
      );
      return;
    }
    
    setShowTipModal(true);
  };

  const driverId = order.driverId || 'unknown';
  const driverRating = driverRatings[driverId];
  const canRateDriver = order.status === 'delivered' && !order.isRated;
  const canTrackDriver = order.status === 'out-for-delivery';
  const canCancel = order.status === 'pending' || order.status === 'processing';
  const canTip = order.status === 'out-for-delivery' || order.status === 'delivered';
  const tipAmount = order.tipAmount || 0;
  const isFreeDelivery = order.deliveryFee === 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{id.slice(0, 8)}</Text>
          <Text style={styles.orderDate}>{order.date}</Text>
        </View>
        
        <View style={styles.statusContainer}>
          {getStatusIcon()}
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      {/* Free Delivery Highlight */}
      {isFreeDelivery && (
        <View style={styles.freeDeliveryBanner}>
          <Truck size={20} color={Colors.dark.success} />
          <Text style={styles.freeDeliveryText}>
            🎉 You saved ${appInfo.deliveryFee.toFixed(2)} with free delivery!
          </Text>
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Information</Text>
        
        <View style={styles.deliveryInfoContainer}>
          <View style={styles.deliveryInfoItem}>
            <MapPin size={20} color={Colors.dark.primary} style={styles.deliveryInfoIcon} />
            <View>
              <Text style={styles.deliveryInfoLabel}>Address</Text>
              <Text style={styles.deliveryInfoValue}>{order.deliveryAddress}</Text>
            </View>
          </View>
          
          {order.driverName && (
            <View style={styles.deliveryInfoItem}>
              <Truck size={20} color={Colors.dark.primary} style={styles.deliveryInfoIcon} />
              <View style={styles.driverInfoContainer}>
                <View>
                  <Text style={styles.deliveryInfoLabel}>Driver</Text>
                  <Text style={styles.deliveryInfoValue}>{order.driverName}</Text>
                </View>
                
                {driverRating && (
                  <View style={styles.driverRatingContainer}>
                    <RatingStars rating={driverRating} size={16} readonly />
                  </View>
                )}
              </View>
            </View>
          )}
          
          {order.driverPhone && (
            <View style={styles.deliveryInfoItem}>
              <Phone size={20} color={Colors.dark.primary} style={styles.deliveryInfoIcon} />
              <View>
                <Text style={styles.deliveryInfoLabel}>Contact</Text>
                <Text style={styles.deliveryInfoValue}>{order.driverPhone}</Text>
              </View>
            </View>
          )}
          
          <View style={styles.timeInfoContainer}>
            <Clock size={20} color={Colors.dark.primary} style={styles.timeInfoIcon} />
            <View>
              <Text style={styles.timeInfoLabel}>Processing Time</Text>
              <Text style={styles.timeInfoValue}>{order.estimatedProcessingTime || 'To be determined'}</Text>
              
              <Text style={[styles.timeInfoLabel, styles.marginTop]}>Estimated Delivery</Text>
              <Text style={styles.timeInfoValue}>{appInfo.estimatedDeliveryTime}</Text>
            </View>
          </View>
          
          <View style={styles.actionButtonsContainer}>
            {canTrackDriver && (
              <Pressable 
                style={styles.trackDriverButton}
                onPress={handleTrackDriver}
              >
                <Map size={20} color={Colors.dark.text} style={styles.actionButtonIcon} />
                <Text style={styles.actionButtonText}>Track Driver</Text>
              </Pressable>
            )}
            
            {canRateDriver && (
              <Pressable 
                style={styles.rateDriverButton}
                onPress={handleRateDriver}
              >
                <Star size={20} color={Colors.dark.text} style={styles.actionButtonIcon} />
                <Text style={styles.actionButtonText}>Rate Driver</Text>
              </Pressable>
            )}
            
            {canTip && (
              <Pressable 
                style={styles.tipDriverButton}
                onPress={handleTipDriver}
              >
                <Text style={[styles.actionButtonText, styles.tipButtonText]}>Tip Driver</Text>
              </Pressable>
            )}
            
            {canCancel && (
              <Pressable 
                style={styles.cancelOrderButton}
                onPress={handleCancelOrder}
              >
                <XCircle size={20} color={Colors.dark.text} style={styles.actionButtonIcon} />
                <Text style={styles.actionButtonText}>Cancel Order</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        
        {order.items.map(item => {
          const product = getProductById(item.id);
          if (!product) return null;
          
          return (
            <View key={item.id} style={styles.orderItem}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDetail}>
                  {product.weight || product.count || product.volume}
                </Text>
                <View style={styles.productPriceRow}>
                  <Text style={styles.productPrice}>${product.price}</Text>
                  <Text style={styles.productQuantity}>x{item.quantity}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ${order.subtotal.toFixed(2)}
            </Text>
          </View>
          
          {order.discountApplied && order.discountApplied > 0 && (
            <View style={styles.discountRow}>
              <View style={styles.discountLabelContainer}>
                <Tag size={16} color={Colors.dark.secondary} style={styles.discountIcon} />
                <Text style={styles.discountLabel}>New Customer Discount</Text>
              </View>
              <Text style={styles.discountValue}>-${order.discountApplied.toFixed(2)}</Text>
            </View>
          )}
          
          {order.promoCodeApplied && (
            <View style={styles.discountRow}>
              <View style={styles.discountLabelContainer}>
                <Tag size={16} color={Colors.dark.primary} style={styles.discountIcon} />
                <Text style={styles.discountLabel}>Promo: {order.promoCodeApplied}</Text>
              </View>
              <Text style={styles.discountValue}>-${(order.total * 0.2).toFixed(2)}</Text>
            </View>
          )}
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={[
              styles.summaryValue,
              isFreeDelivery && styles.freeDeliveryValue
            ]}>
              {isFreeDelivery ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>
              ${order.tax.toFixed(2)}
            </Text>
          </View>
          
          {tipAmount > 0 && (
            <View style={styles.tipRow}>
              <Text style={styles.tipLabel}>Driver Tip</Text>
              <Text style={styles.tipValue}>${tipAmount.toFixed(2)}</Text>
            </View>
          )}
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ${(order.total + tipAmount).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
      
      <RateDriverModal 
        visible={showRateDriverModal}
        onClose={() => setShowRateDriverModal(false)}
        orderId={id}
        driverId={order.driverId}
        driverName={order.driverName}
      />
      
      <DriverTrackingMap
        visible={showTrackingMap}
        onClose={() => setShowTrackingMap(false)}
        orderId={id}
        driverName={order.driverName || "Your Driver"}
        estimatedArrival={
          // Fix TypeScript error by ensuring the value is one of the allowed types
          (order.estimatedArrival as string === 'early' || 
           order.estimatedArrival as string === 'on-time' || 
           order.estimatedArrival as string === 'late') 
            ? (order.estimatedArrival as 'early' | 'on-time' | 'late') 
            : 'on-time'
        }
      />
      
      <CancelOrderModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        orderId={id}
      />
      
      <TipDriverModal
        visible={showTipModal}
        onClose={() => setShowTipModal(false)}
        orderId={id}
        driverName={order.driverName}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    backgroundColor: Colors.dark.card,
    padding: 16,
    marginBottom: 16,
  },
  orderInfo: {
    marginBottom: 12,
  },
  orderId: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderDate: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  freeDeliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.dark.success,
  },
  freeDeliveryText: {
    color: Colors.dark.success,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    backgroundColor: Colors.dark.card,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  deliveryInfoContainer: {
    gap: 16,
  },
  deliveryInfoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  deliveryInfoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  deliveryInfoLabel: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 4,
  },
  deliveryInfoValue: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  driverInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInfoContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
  },
  timeInfoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  timeInfoLabel: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 4,
  },
  timeInfoValue: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  marginTop: {
    marginTop: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  rateDriverButton: {
    flex: 1,
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '45%',
  },
  trackDriverButton: {
    flex: 1,
    backgroundColor: Colors.dark.secondary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '45%',
  },
  tipDriverButton: {
    flex: 1,
    backgroundColor: Colors.dark.success,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '45%',
  },
  cancelOrderButton: {
    flex: 1,
    backgroundColor: Colors.dark.warning,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '45%',
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  tipButtonText: {
    fontSize: 14,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productDetail: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 4,
  },
  productPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  productQuantity: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  summaryContainer: {
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
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
  tipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    borderRadius: 8,
    padding: 8,
  },
  tipLabel: {
    color: Colors.dark.success,
    fontSize: 14,
    fontWeight: '500',
  },
  tipValue: {
    color: Colors.dark.success,
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
  freeDeliveryValue: {
    color: Colors.dark.success,
    fontWeight: 'bold',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    paddingTop: 8,
    marginTop: 8,
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notFoundText: {
    color: Colors.dark.text,
    fontSize: 18,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});