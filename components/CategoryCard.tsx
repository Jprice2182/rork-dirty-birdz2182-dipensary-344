import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { Flower, Cigarette, Candy, Zap, Droplets, Package, Droplet, Usb } from 'lucide-react-native';

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

  const renderIcon = () => {
    const iconProps = {
      size: 24,
      color: Colors.dark.text,
      strokeWidth: 1.5
    };

    switch (icon) {
      case 'flower':
        return <Flower {...iconProps} />;
      case 'cigarette':
        return <Cigarette {...iconProps} />;
      case 'candy':
        return <Candy {...iconProps} />;
      case 'zap':
        return <Zap {...iconProps} />;
      case 'droplets':
        return <Droplets {...iconProps} />;
      case 'package':
        return <Package {...iconProps} />;
      case 'droplet':
        return <Droplet {...iconProps} />;
      case 'usb':
        return <Usb {...iconProps} />;
      default:
        return <Package {...iconProps} />;
    }
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
        {renderIcon()}
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
  name: {
    color: Colors.dark.text,
    fontSize: 14,
    textAlign: 'center',
  },
});