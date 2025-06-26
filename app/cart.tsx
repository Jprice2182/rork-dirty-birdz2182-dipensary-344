import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag, ArrowLeft, Truck } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useCartStore } from '@/store/cartStore';
import CartItem from '@/components/CartItem';
import DiscountBanner from '@/components/DiscountBanner';
import appInfo from '@/constants/appInfo';

export default function CartScreen() {
  const router = useRouter();
  const { items, getCartTotal, getEighthsPromotion, clearCart } = useCartStore();
  const [refreshing, setRefreshing] = useState(false);
  const cartTotal = getCartTotal();
  const eighthsPromo = getEighthsPromotion();

  // Calculate delivery fee based on cart total
  const deliveryFee = cartTotal >= appInfo.freeDeliveryMinimum ? 0 : appInfo.deliveryFee;
  const amountForFreeDelivery = appInfo.freeDeliveryMinimum - cartTotal;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Simulate refreshing cart data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you might sync cart with server here
      // await syncCartWithServer();
      
    } catch (error) {
      console.error('Error refreshing cart:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/(tabs)');
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.dark.primary}
              colors={[Colors.dark.primary]}
              progressBackgroundColor={Colors.dark.card}
            />
          }
        >
          <ShoppingBag size={60} color={Colors.dark.subtext} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add some premium cannabis products to your cart and enjoy fast delivery in Atlanta</Text>
          
          {/* Free delivery info when cart is empty */}
          <View style={styles.freeDeliveryBanner}>
            <Truck size={20} color={Colors.dark.primary} />
            <Text style={styles.freeDeliveryText}>
              Free delivery on orders over ${appInfo.freeDeliveryMinimum}!
            </Text>
          </View>
          
          {/* Show eighths promotion when cart is empty */}
          <View style={styles.emptyPromoContainer}>
            <DiscountBanner showEighthsPromo={true} />
          </View>
          
          <View style={styles.emptyButtonsContainer}>
            <Pressable style={styles.shopButton} onPress={handleGoHome}>
              <Text style={styles.shopButtonText}>Browse Products</Text>
            </Pressable>
            
            <Pressable style={styles.backButton} onPress={handleContinueShopping}>
              <ArrowLeft size={16} color={Colors.dark.subtext} />
              <Text style={styles.backButtonText}>Go Back</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  const promotion = appInfo.eighthsPromotion;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.itemsContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.dark.primary}
            colors={[Colors.dark.primary]}
            progressBackgroundColor={Colors.dark.card}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Cart</Text>
          <Text style={styles.itemCount}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Text>
        </View>

        {/* Free Delivery Status */}
        <View style={[
          styles.deliveryStatusContainer,
          deliveryFee === 0 ? styles.freeDeliveryActive : styles.freeDeliveryInactive
        ]}>
          <Truck size={20} color={deliveryFee === 0 ? Colors.dark.success : Colors.dark.primary} />
          <View style={styles.deliveryStatusText}>
            {deliveryFee === 0 ? (
              <Text style={styles.freeDeliveryActiveText}>
                🎉 You qualify for FREE delivery!
              </Text>
            ) : (
              <>
                <Text style={styles.deliveryFeeText}>
                  Delivery fee: ${deliveryFee.toFixed(2)}
                </Text>
                <Text style={styles.freeDeliveryInactiveText}>
                  Add ${amountForFreeDelivery.toFixed(2)} more for free delivery
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Show eighths promotion if eligible or close to eligible */}
        {(eighthsPromo.eligible || eighthsPromo.totalEighths >= 1) && (
          <DiscountBanner showEighthsPromo={true} />
        )}

        {/* Eighths promotion status */}
        {eighthsPromo.totalEighths > 0 && !eighthsPromo.eligible && promotion && (
          <View style={styles.promoStatusContainer}>
            <Text style={styles.promoStatusTitle}>🌿 Eighths Special Progress</Text>
            <Text style={styles.promoStatusText}>
              You have {eighthsPromo.totalEighths} eighth{eighthsPromo.totalEighths !== 1 ? 's' : ''} in your cart.
            </Text>
            <Text style={styles.promoStatusText}>
              Add {3 - (eighthsPromo.totalEighths % 3)} more to get your next eighth for $1!
            </Text>
          </View>
        )}
        
        <View style={styles.itemsList}>
          {items.map((item, index) => (
            <CartItem 
              key={`${item.id}-${item.variantId || 'default'}-${index}`}
              id={item.id} 
              quantity={item.quantity}
              variantId={item.variantId}
              variantName={item.variantName}
            />
          ))}
        </View>
        
        <Pressable onPress={clearCart} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear Cart</Text>
        </Pressable>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalAmount}>${cartTotal.toFixed(2)}</Text>
          </View>
          
          {eighthsPromo.eligible && (
            <View style={styles.totalRow}>
              <Text style={styles.promoLabel}>Eighths Special Savings</Text>
              <Text style={styles.promoAmount}>-${eighthsPromo.savings.toFixed(2)}</Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.deliveryLabel}>Delivery Fee</Text>
            <Text style={[
              styles.deliveryAmount,
              deliveryFee === 0 && styles.freeDeliveryAmount
            ]}>
              {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
            </Text>
          </View>
          
          <Text style={styles.taxNote}>Taxes calculated at checkout</Text>
        </View>
        
        <View style={styles.footerButtons}>
          <Pressable style={styles.continueButton} onPress={handleContinueShopping}>
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </Pressable>
          
          <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  itemsContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemCount: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  deliveryStatusContainer: {
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
  freeDeliveryActiveText: {
    color: Colors.dark.success,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deliveryFeeText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  freeDeliveryInactiveText: {
    color: Colors.dark.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  freeDeliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },
  freeDeliveryText: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  promoStatusContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  promoStatusTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  promoStatusText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 4,
  },
  itemsList: {
    marginBottom: 16,
  },
  clearButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  clearButtonText: {
    color: Colors.dark.error,
    fontSize: 14,
  },
  footer: {
    backgroundColor: Colors.dark.card,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  totalContainer: {
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    color: Colors.dark.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  promoLabel: {
    color: Colors.dark.success,
    fontSize: 16,
    fontWeight: '600',
  },
  promoAmount: {
    color: Colors.dark.success,
    fontSize: 18,
    fontWeight: 'bold',
  },
  deliveryLabel: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  deliveryAmount: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
  freeDeliveryAmount: {
    color: Colors.dark.success,
    fontWeight: 'bold',
  },
  taxNote: {
    color: Colors.dark.subtext,
    fontSize: 12,
    marginTop: 8,
  },
  footerButtons: {
    gap: 8,
  },
  continueButton: {
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  continueButtonText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  checkoutButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    color: Colors.dark.subtext,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyPromoContainer: {
    width: '100%',
    marginBottom: 24,
  },
  emptyButtonsContainer: {
    width: '100%',
    gap: 12,
  },
  shopButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  shopButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginLeft: 6,
  },
});