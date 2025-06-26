import React, { memo, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Minus, ShoppingBag, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import SafeText from '@/components/SafeText';
import { safeTextContent } from '@/utils/safeRender';
import { useCartStore } from '@/store/cartStore';
import { getProductById } from '@/mocks/products';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  thc: number;
  weight?: string;
  count?: string;
  volume?: string;
}

const ProductCard = memo(({ id, name, price, image, thc, weight, count, volume }: ProductCardProps) => {
  const router = useRouter();
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const [showVariantModal, setShowVariantModal] = useState(false);
  
  const product = getProductById(id);
  const hasVariants = product?.variants && product.variants.length > 0;

  // Get all cart items for this product (including variants)
  const productCartItems = items.filter(item => item.id === id);
  const totalQuantity = productCartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handlePress = () => {
    if (!id) {
      console.warn('Product card pressed but no ID provided');
      return;
    }
    
    console.log(`Navigating to product ${id}: ${name}`);
    router.push(`/product/${id}`);
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }

    // If product has variants, show variant selection modal
    if (hasVariants) {
      setShowVariantModal(true);
    } else {
      addItem(id);
    }
  };

  const handleVariantSelect = (variantId: string) => {
    addItem(id, variantId);
    setShowVariantModal(false);
  };

  const handleIncrement = (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }

    // For products with variants, show variant selection
    if (hasVariants) {
      setShowVariantModal(true);
    } else {
      const cartItem = items.find(item => item.id === id && !item.variantId);
      const quantity = cartItem ? cartItem.quantity : 0;
      
      if (quantity === 0) {
        addItem(id);
      } else {
        updateQuantity(id, quantity + 1);
      }
    }
  };

  const handleDecrement = (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }

    // For products with variants, find the most recent item to decrement
    if (hasVariants && productCartItems.length > 0) {
      const mostRecentItem = productCartItems.reduce((latest, item) => 
        (item.addedAt || '') > (latest.addedAt || '') ? item : latest
      );
      
      if (mostRecentItem.quantity === 1) {
        removeItem(mostRecentItem.id, mostRecentItem.variantId);
      } else {
        updateQuantity(mostRecentItem.id, mostRecentItem.quantity - 1, mostRecentItem.variantId);
      }
    } else {
      const cartItem = items.find(item => item.id === id && !item.variantId);
      const quantity = cartItem ? cartItem.quantity : 0;
      
      if (quantity === 1) {
        removeItem(id);
      } else if (quantity > 1) {
        updateQuantity(id, quantity - 1);
      }
    }
  };

  const getDisplayUnit = () => {
    if (weight) return safeTextContent(weight);
    if (count) return safeTextContent(count);
    if (volume) return safeTextContent(volume);
    return '';
  };

  const formatPrice = (price: number) => {
    if (typeof price !== 'number' || isNaN(price)) {
      return '$0.00';
    }
    return `$${price.toFixed(2)}`;
  };

  const formatTHC = (thc: number) => {
    if (typeof thc !== 'number' || isNaN(thc)) {
      return 'THC: 0%';
    }
    return `THC: ${thc}%`;
  };

  return (
    <>
      <Pressable 
        style={({ pressed }) => [
          styles.container,
          pressed && styles.pressed
        ]}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${formatPrice(price)}, ${formatTHC(thc)}`}
      >
        <Image 
          source={{ uri: image }} 
          style={styles.image}
          defaultSource={require('@/assets/images/icon.png')}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <SafeText style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {safeTextContent(name) || 'Unnamed Product'}
          </SafeText>
          <SafeText style={styles.thc}>{formatTHC(thc)}</SafeText>
          {getDisplayUnit() ? (
            <SafeText style={styles.detail}>{getDisplayUnit()}</SafeText>
          ) : null}
          {hasVariants ? (
            <SafeText style={styles.price}>From {formatPrice(price)}</SafeText>
          ) : (
            <SafeText style={styles.price}>{formatPrice(price)}</SafeText>
          )}
          
          {/* Quantity Controls */}
          <View style={styles.quantitySection}>
            {totalQuantity > 0 ? (
              <View style={styles.quantityContainer}>
                <Pressable onPress={handleDecrement} style={styles.quantityButton}>
                  <Minus size={16} color={Colors.dark.text} />
                </Pressable>
                
                <SafeText style={styles.quantity}>{totalQuantity}</SafeText>
                
                <Pressable onPress={handleIncrement} style={styles.quantityButton}>
                  <Plus size={16} color={Colors.dark.text} />
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.addButton} onPress={handleAddToCart}>
                <ShoppingBag size={16} color={Colors.dark.text} />
                <SafeText style={styles.addButtonText}>Add</SafeText>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>

      {/* Variant Selection Modal */}
      {hasVariants && (
        <Modal
          visible={showVariantModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowVariantModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <SafeText style={styles.modalTitle}>Choose Size</SafeText>
                <Pressable 
                  onPress={() => setShowVariantModal(false)}
                  style={styles.closeButton}
                >
                  <X size={24} color={Colors.dark.text} />
                </Pressable>
              </View>
              
              <SafeText style={styles.modalSubtitle}>{name}</SafeText>
              
              <View style={styles.variantsList}>
                {product?.variants?.map(variant => (
                  <Pressable
                    key={variant.id}
                    style={styles.variantOption}
                    onPress={() => handleVariantSelect(variant.id)}
                  >
                    <View style={styles.variantInfo}>
                      <SafeText style={styles.variantName}>{variant.name}</SafeText>
                      <SafeText style={styles.variantWeight}>{variant.weight}</SafeText>
                    </View>
                    <SafeText style={styles.variantPrice}>${variant.price}</SafeText>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '48%',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: 12,
  },
  name: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    minHeight: 36,
    lineHeight: 18,
  },
  thc: {
    color: Colors.dark.subtext,
    fontSize: 11,
    marginBottom: 2,
  },
  detail: {
    color: Colors.dark.subtext,
    fontSize: 11,
    marginBottom: 6,
  },
  price: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  quantitySection: {
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.primary,
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
    minWidth: 80,
    justifyContent: 'space-between',
  },
  quantityButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  quantity: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: Colors.dark.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 80,
  },
  addButtonText: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    color: Colors.dark.subtext,
    fontSize: 16,
    marginBottom: 20,
  },
  variantsList: {
    gap: 12,
  },
  variantOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
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
  variantWeight: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  variantPrice: {
    color: Colors.dark.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});