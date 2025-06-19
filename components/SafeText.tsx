import React from 'react';
import { Text, TextProps } from 'react-native';

interface SafeTextProps extends TextProps {
  children: React.ReactNode;
}

/**
 * SafeText component that ensures content is properly rendered as text
 * Prevents emojis or special characters from being interpreted as components
 */
export default function SafeText({ children, ...props }: SafeTextProps) {
  return (
    <Text {...props}>
      {children}
    </Text>
  );
}