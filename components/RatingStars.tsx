import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Star } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = 24,
  onRatingChange,
  readonly = false
}: RatingStarsProps) {
  const handlePress = (selectedRating: number) => {
    if (readonly || !onRatingChange) return;
    onRatingChange(selectedRating);
  };

  return (
    <View style={styles.container}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const filled = starValue <= rating;
        
        return (
          <Pressable
            key={index}
            onPress={() => handlePress(starValue)}
            disabled={readonly}
            style={({ pressed }) => [
              styles.starContainer,
              pressed && !readonly && styles.pressed
            ]}
          >
            <Star
              size={size}
              color={filled ? Colors.dark.primary : Colors.dark.subtext}
              fill={filled ? Colors.dark.primary : 'transparent'}
              strokeWidth={1.5}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    padding: 2,
  },
  pressed: {
    opacity: 0.7,
  },
});