import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';

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

export default function ProductCard({ id, name, price, image, thc, weight, count, volume }: ProductCardProps) {
  const router = useRouter();

  const handlePress = () => {
    console.log(`Navigating to product ${id}: ${name}`);
    router.push(`/product/${id}`);
  };

  const getDisplayUnit = () => {
    if (weight) return weight;
    if (count) return count;
    if (volume) return volume;
    return '';
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={handlePress}
    >
      <Image 
        source={{ uri: image }} 
        style={styles.image}
        defaultSource={require('@/assets/images/icon.png')}
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <Text style={styles.thc}>THC: {thc}%</Text>
        {getDisplayUnit() && (
          <Text style={styles.detail}>{getDisplayUnit()}</Text>
        )}
        <Text style={styles.price}>${price.toFixed(2)}</Text>
      </View>
    </Pressable>
  );
}

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
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: 12,
  },
  name: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    minHeight: 40,
  },
  thc: {
    color: Colors.dark.subtext,
    fontSize: 12,
    marginBottom: 2,
  },
  detail: {
    color: Colors.dark.subtext,
    fontSize: 12,
    marginBottom: 6,
  },
  price: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});