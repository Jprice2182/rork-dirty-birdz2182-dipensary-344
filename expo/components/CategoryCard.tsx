import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import SafeText from '@/components/SafeText';
import { safeTextContent } from '@/utils/safeRender';

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
}

export default function CategoryCard({ id, name, icon }: CategoryCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/category/${id}`);
  };

  // Ensure all content is safely rendered as text
  const safeIcon = safeTextContent(icon);
  const safeName = safeTextContent(name);

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>
        <SafeText style={styles.iconText}>{safeIcon}</SafeText>
      </View>
      <SafeText style={styles.name}>{safeName}</SafeText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  iconText: {
    fontSize: 24,
    textAlign: 'center',
  },
  name: {
    color: Colors.dark.text,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});