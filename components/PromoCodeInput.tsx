import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Tag, Check, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePromoStore } from '@/store/promoStore';
import { useUserStore } from '@/store/userStore';

interface PromoCodeInputProps {
  onApply: (discount: number) => void;
}

export default function PromoCodeInput({ onApply }: PromoCodeInputProps) {
  const [promoCode, setPromoCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);
  
  const { validatePromoCode } = usePromoStore();
  const { hasUsedPromoCode, markPromoCodeAsUsed } = useUserStore();

  const handleApply = () => {
    if (!promoCode.trim()) return;
    
    setIsValidating(true);
    setValidationResult(null);
    
    // Simulate network request
    setTimeout(() => {
      if (hasUsedPromoCode) {
        setValidationResult({
          valid: false,
          message: "You've already used a promo code"
        });
        setIsValidating(false);
        return;
      }
      
      const discount = validatePromoCode(promoCode);
      
      if (discount) {
        setValidationResult({
          valid: true,
          message: `${discount * 100}% discount applied!`
        });
        onApply(discount);
        markPromoCodeAsUsed();
      } else {
        setValidationResult({
          valid: false,
          message: "Invalid promo code"
        });
      }
      
      setIsValidating(false);
    }, 1000);
  };

  const handleClear = () => {
    setPromoCode('');
    setValidationResult(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Tag size={20} color={Colors.dark.subtext} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter promo code"
          placeholderTextColor={Colors.dark.subtext}
          value={promoCode}
          onChangeText={setPromoCode}
          autoCapitalize="characters"
        />
        
        {promoCode.length > 0 && !isValidating && !validationResult?.valid && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <X size={20} color={Colors.dark.subtext} />
          </Pressable>
        )}
        
        {validationResult?.valid && (
          <View style={styles.validIndicator}>
            <Check size={20} color={Colors.dark.success} />
          </View>
        )}
      </View>
      
      {validationResult && (
        <Text 
          style={[
            styles.validationMessage,
            validationResult.valid ? styles.validMessage : styles.invalidMessage
          ]}
        >
          {validationResult.message}
        </Text>
      )}
      
      <Pressable 
        style={[
          styles.applyButton,
          (isValidating || validationResult?.valid) && styles.disabledButton
        ]}
        onPress={handleApply}
        disabled={isValidating || validationResult?.valid || !promoCode.trim()}
      >
        {isValidating ? (
          <ActivityIndicator size="small" color={Colors.dark.text} />
        ) : (
          <Text style={styles.applyButtonText}>Apply</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    color: Colors.dark.text,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  validIndicator: {
    padding: 8,
  },
  validationMessage: {
    marginTop: 4,
    fontSize: 14,
  },
  validMessage: {
    color: Colors.dark.success,
  },
  invalidMessage: {
    color: Colors.dark.error,
  },
  applyButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: Colors.dark.border,
    opacity: 0.7,
  },
  applyButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
});