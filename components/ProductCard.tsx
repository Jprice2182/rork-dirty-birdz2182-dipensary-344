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
    router.push(`/product/${id}`);
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={handlePress}
    >
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.thc}>THC: {thc}%</Text>
        <Text style={styles.detail}>{weight || count || volume}</Text>
        <Text style={styles.price}>${price}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  name: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
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