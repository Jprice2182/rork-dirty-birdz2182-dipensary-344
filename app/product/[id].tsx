import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ShoppingBag, Plus, Minus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { getProductById } from '@/mocks/products';
import { useCartStore } from '@/store/cartStore';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const product = getProductById(id);
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product?.variants?.[0]?.id
  );
  
  if (!product) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Product not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const hasVariants = product.variants && product.variants.length > 0;
  const selectedVariant = hasVariants && selectedVariantId 
    ? product.variants?.find(v => v.id === selectedVariantId)
    : null;

  // Get cart item for current product/variant combination
  const cartItem = items.find(item => 
    item.id === id && (item.variantId || '') === (selectedVariantId || '')
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  // Get all cart items for this product (including variants)
  const productCartItems = items.filter(item => item.id === id);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentWeight = selectedVariant ? selectedVariant.weight : (product.weight || product.count || product.volume);

  const handleAddToCart = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
    addItem(id, selectedVariantId);
  };

  const handleIncrement = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
    if (quantity === 0) {
      addItem(id, selectedVariantId);
    } else {
      updateQuantity(id, quantity + 1, selectedVariantId);
    }
  };

  const handleDecrement = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
    if (quantity === 1) {
      removeItem(id, selectedVariantId);
    } else {
      updateQuantity(id, quantity - 1, selectedVariantId);
    }
  };

  const handleAddMultiple = (amount: number) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
    const newQuantity = quantity + amount;
    if (newQuantity <= 0) {
      removeItem(id, selectedVariantId);
    } else {
      updateQuantity(id, newQuantity, selectedVariantId);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image }} style={styles.image} />
        
        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          
          {/* Variant Selection for Flower */}
          {hasVariants && (
            <View style={styles.variantsSection}>
              <Text style={styles.sectionTitle}>Choose Size</Text>
              <View style={styles.variantsList}>
                {product.variants?.map(variant => (
                  <Pressable
                    key={variant.id}
                    style={[
                      styles.variantOption,
                      selectedVariantId === variant.id && styles.variantOptionSelected
                    ]}
                    onPress={() => setSelectedVariantId(variant.id)}
                  >
                    <View style={styles.variantInfo}>
                      <Text style={[
                        styles.variantName,
                        selectedVariantId === variant.id && styles.variantNameSelected
                      ]}>
                        {variant.name}
                      </Text>
                      <Text style={styles.variantWeight}>{variant.weight}</Text>
                    </View>
                    <Text style={[
                      styles.variantPrice,
                      selectedVariantId === variant.id && styles.variantPriceSelected
                    ]}>
                      ${variant.price}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>THC</Text>
              <Text style={styles.statValue}>{product.thc}%</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>CBD</Text>
              <Text style={styles.statValue}>{product.cbd}%</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Weight</Text>
              <Text style={styles.statValue}>{currentWeight}</Text>
            </View>
          </View>
          
          <Text style={styles.price}>${currentPrice}</Text>
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
          
          <Text style={styles.sectionTitle}>Effects</Text>
          <View style={styles.effectsContainer}>
            {product.effects.map((effect, index) => (
              <View key={index} style={styles.effectTag}>
                <Text style={styles.effectText}>{effect}</Text>
              </View>
            ))}
          </View>

          {/* Quick Add Buttons */}
          {quantity > 0 && (
            <View style={styles.quickAddSection}>
              <Text style={styles.quickAddTitle}>Quick Add</Text>
              <View style={styles.quickAddButtons}>
                <Pressable 
                  style={styles.quickAddButton} 
                  onPress={() => handleAddMultiple(1)}
                >
                  <Text style={styles.quickAddButtonText}>+1</Text>
                </Pressable>
                <Pressable 
                  style={styles.quickAddButton} 
                  onPress={() => handleAddMultiple(2)}
                >
                  <Text style={styles.quickAddButtonText}>+2</Text>
                </Pressable>
                <Pressable 
                  style={styles.quickAddButton} 
                  onPress={() => handleAddMultiple(5)}
                >
                  <Text style={styles.quickAddButtonText}>+5</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Show other variants in cart */}
          {hasVariants && productCartItems.length > 0 && (
            <View style={styles.cartSummarySection}>
              <Text style={styles.cartSummaryTitle}>In Your Cart</Text>
              {productCartItems.map(item => (
                <View key={`${item.id}-${item.variantId || 'default'}`} style={styles.cartSummaryItem}>
                  <Text style={styles.cartSummaryText}>
                    {item.variantName || 'Standard'} × {item.quantity}
                  </Text>
                  <Text style={styles.cartSummaryPrice}>
                    ${((item.price || 0) * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        {quantity > 0 ? (
          <View style={styles.quantityContainer}>
            <Pressable onPress={handleDecrement} style={styles.quantityButton}>
              <Minus size={20} color={Colors.dark.text} />
            </Pressable>
            
            <Text style={styles.quantity}>{quantity}</Text>
            
            <Pressable onPress={handleIncrement} style={styles.quantityButton}>
              <Plus size={20} color={Colors.dark.text} />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.addButton} onPress={handleAddToCart}>
            <ShoppingBag size={20} color={Colors.dark.text} />
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  name: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  variantsSection: {
    marginBottom: 16,
  },
  variantsList: {
    gap: 8,
  },
  variantOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  variantOptionSelected: {
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.card,
  },
  variantInfo: {
    flex: 1,
  },
  variantName: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  variantNameSelected: {
    color: Colors.dark.primary,
  },
  variantWeight: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  variantPrice: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  variantPriceSelected: {
    color: Colors.dark.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    color: Colors.dark.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: Colors.dark.subtext,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  effectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  effectTag: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  effectText: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  quickAddSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  quickAddTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  quickAddButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAddButton: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  quickAddButtonText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cartSummarySection: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  cartSummaryTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cartSummaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cartSummaryText: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  cartSummaryPrice: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: Colors.dark.card,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  addButton: {
    backgroundColor: Colors.dark.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
  },
  addButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  quantity: {
    color: Colors.dark.text,
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