import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useCartStore } from '@/store/cartStore';
import CartItem from '@/components/CartItem';

export default function CartScreen() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const [refreshing, setRefreshing] = useState(false);
  const cartTotal = getCartTotal();

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
        
        <View style={styles.itemsList}>
          {items.map(item => (
            <CartItem key={item.id} id={item.id} quantity={item.quantity} />
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
          <Text style={styles.taxNote}>Taxes and delivery fees calculated at checkout</Text>
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
  taxNote: {
    color: Colors.dark.subtext,
    fontSize: 12,
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