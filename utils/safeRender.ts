import React from 'react';

/**
 * Safely renders emoji content within proper React components
 * Prevents emojis from being used as component names
 */
export const safeEmojiRender = (emoji: string, style?: any) => {
  // Ensure emoji is rendered as text content, not as a component
  // Use a Text component for proper rendering
  return React.createElement('span', { 
    style,
    // Prevent any interpretation as JSX
    dangerouslySetInnerHTML: undefined 
  }, String(emoji));
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
  return String(content).replace(/[<>{}]/g, '');
};

/**
 * Validates that a string is not an emoji (to prevent using as component name)
 */
export const isEmoji = (str: string): boolean => {
  // Basic emoji detection - checks for common emoji ranges
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(str);
};

/**
 * Ensures safe text rendering by converting to string and validating
 * This is the main function to use for any dynamic text content
 */
export const safeTextContent = (content: any): string => {
  if (content === null || content === undefined) {
    return '';
  }
  
  const stringContent = String(content);
  
  // Additional safety: ensure no JSX-like syntax
  return stringContent.replace(/[<>{}]/g, '');
};

/**
 * Safe wrapper for rendering any content as text
 * Prevents React from interpreting content as component names
 */
export const renderSafeText = (content: any): string => {
  return safeTextContent(content);
};