import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useCartStore } from '@/store/cartStore';
import { getProductById } from '@/mocks/products';

interface CartItemProps {
  id: string;
  quantity: number;
}

export default function CartItem({ id, quantity }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const product = getProductById(id);

  if (!product) return null;

  const handleIncrement = () => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1);
    } else {
      removeItem(id);
    }
  };

  const handleRemove = () => {
    removeItem(id);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      
      <View style={styles.details}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.weight}>{product.weight || product.count || product.volume}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>
      
      <View style={styles.quantityContainer}>
        <View style={styles.quantityControls}>
          <Pressable onPress={handleDecrement} style={styles.quantityButton}>
            <Minus size={16} color={Colors.dark.text} />
          </Pressable>
          
          <Text style={styles.quantity}>{quantity}</Text>
          
          <Pressable onPress={handleIncrement} style={styles.quantityButton}>
            <Plus size={16} color={Colors.dark.text} />
          </Pressable>
        </View>
        
        <Pressable onPress={handleRemove} style={styles.removeButton}>
          <Trash2 size={16} color={Colors.dark.error} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  weight: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  quantityContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  quantity: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    marginTop: 12,
    padding: 4,
  },
});