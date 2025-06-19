import React from 'react';

/**
 * Safely renders emoji content within proper React components
 * Prevents emojis from being used as component names
 */
export const safeEmojiRender = (emoji: string, style?: any) => {
  // Ensure emoji is rendered as text content, not as a component
  return React.createElement('span', { style }, emoji);
};

/**
 * Validates that a string is safe to use as JSX content
 */
export const validateJSXContent = (content: string): boolean => {
  // Check if content contains only valid characters for JSX text content
  const invalidChars = /[<>{}]/;
  return !invalidChars.test(content);
};

/**
 * Sanitizes emoji content for safe rendering
 */
export const sanitizeEmojiContent = (content: string): string => {
  // Remove any characters that could be interpreted as JSX
  return content.replace(/[<>{}]/g, '');
};