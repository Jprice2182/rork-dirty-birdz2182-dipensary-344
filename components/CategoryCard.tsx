import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';

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

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
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
  },
  iconText: {
    fontSize: 24,
  },
  name: {
    color: Colors.dark.text,
    fontSize: 14,
    textAlign: 'center',
  },
});