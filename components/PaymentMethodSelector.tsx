import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CreditCard, DollarSign } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { PaymentMethod } from '@/types/product';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({ selectedMethod, onSelectMethod }: PaymentMethodSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>
      
      <View style={styles.methodsContainer}>
        <Pressable
          style={[
            styles.methodButton,
            selectedMethod === 'card' && styles.selectedMethod
          ]}
          onPress={() => onSelectMethod('card')}
        >
          <CreditCard 
            size={24} 
            color={selectedMethod === 'card' ? Colors.dark.text : Colors.dark.subtext} 
          />
          <View style={styles.methodInfo}>
            <Text style={[
              styles.methodTitle,
              selectedMethod === 'card' && styles.selectedMethodText
            ]}>
              Credit/Debit Card
            </Text>
            <Text style={[
              styles.methodSubtitle,
              selectedMethod === 'card' && styles.selectedMethodSubtext
            ]}>
              Pay securely with your card
            </Text>
          </View>
          <View style={[
            styles.radioButton,
            selectedMethod === 'card' && styles.selectedRadio
          ]}>
            {selectedMethod === 'card' && <View style={styles.radioInner} />}
          </View>
        </Pressable>

        <Pressable
          style={[
            styles.methodButton,
            selectedMethod === 'cash' && styles.selectedMethod
          ]}
          onPress={() => onSelectMethod('cash')}
        >
          <DollarSign 
            size={24} 
            color={selectedMethod === 'cash' ? Colors.dark.text : Colors.dark.subtext} 
          />
          <View style={styles.methodInfo}>
            <Text style={[
              styles.methodTitle,
              selectedMethod === 'cash' && styles.selectedMethodText
            ]}>
              Cash on Delivery
            </Text>
            <Text style={[
              styles.methodSubtitle,
              selectedMethod === 'cash' && styles.selectedMethodSubtext
            ]}>
              Pay with cash when delivered
            </Text>
            <Text style={styles.smallPrint}>
              MUST SHOW ID BEFORE HANDING OVER MERCHANDISE
            </Text>
          </View>
          <View style={[
            styles.radioButton,
            selectedMethod === 'cash' && styles.selectedRadio
          ]}>
            {selectedMethod === 'cash' && <View style={styles.radioInner} />}
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  methodsContainer: {
    gap: 12,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  selectedMethod: {
    borderColor: Colors.dark.primary,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
  },
  methodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 2,
  },
  selectedMethodText: {
    color: Colors.dark.text,
  },
  methodSubtitle: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  selectedMethodSubtext: {
    color: Colors.dark.text,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: Colors.dark.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.dark.primary,
  },
  smallPrint: {
    fontSize: 10,
    color: Colors.dark.subtext,
    marginTop: 4,
    fontWeight: '500',
  },
});