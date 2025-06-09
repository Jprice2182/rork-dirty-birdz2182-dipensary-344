import React from 'react';
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

  const cartItem = items.find(item => item.id === id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    addItem(id);
  };

  const handleIncrement = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (quantity === 0) {
      addItem(id);
    } else {
      updateQuantity(id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (quantity === 1) {
      removeItem(id);
    } else {
      updateQuantity(id, quantity - 1);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image }} style={styles.image} />
        
        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          
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
              <Text style={styles.statValue}>{product.weight || product.count || product.volume}</Text>
            </View>
          </View>
          
          <Text style={styles.price}>${product.price}</Text>
          
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