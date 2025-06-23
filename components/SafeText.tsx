import React from 'react';
import { Text, TextProps } from 'react-native';
import { safeTextContent } from '@/utils/safeRender';

interface SafeTextProps extends TextProps {
  children: React.ReactNode;
}

/**
 * SafeText component that ensures content is properly rendered as text
 * Prevents emojis or special characters from being interpreted as components
 */
export default function SafeText({ children, ...props }: SafeTextProps) {
  // Process children to ensure they're safe
  const processChild = (child: React.ReactNode): React.ReactNode => {
    if (typeof child === 'string' || typeof child === 'number') {
      return safeTextContent(child);
    }
    if (React.isValidElement(child)) {
      return child;
    }
    if (child === null || child === undefined) {
      return '';
    }
    // For any other type, convert to safe string
    return safeTextContent(child);
  };

  const safeChildren = React.Children.map(children, processChild);

  return (
    <Text {...props}>
      {safeChildren}
    </Text>
  );
}