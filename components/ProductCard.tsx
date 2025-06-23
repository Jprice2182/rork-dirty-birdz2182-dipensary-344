import React, { memo } from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import SafeText from '@/components/SafeText';
import { safeTextContent } from '@/utils/safeRender';

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

  const handlePress = () => {
    if (!id) {
      console.warn('Product card pressed but no ID provided');
      return;
    }
    
    console.log(`Navigating to product ${id}: ${name}`);
    router.push(`/product/${id}`);
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
        <SafeText style={styles.price}>{formatPrice(price)}</SafeText>
      </View>
    </Pressable>
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
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: '100%',
    height: 150,
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
    lineHeight: 20,
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