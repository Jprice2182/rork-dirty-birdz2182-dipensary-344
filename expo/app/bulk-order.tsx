import React, { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Building2, MapPin, MessageSquareText, Phone, Send, Sparkles } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';

interface BulkOrderFormState {
  businessName: string;
  phone: string;
  address: string;
  message: string;
}

export default function BulkOrderScreen() {
  const { phone, addresses } = useUserStore();
  const primaryAddress = addresses[0];

  const [form, setForm] = useState<BulkOrderFormState>({
    businessName: '',
    phone: phone ?? '',
    address: primaryAddress ? `${primaryAddress.street}, ${primaryAddress.city}, ${primaryAddress.state} ${primaryAddress.zipCode}` : '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isFormValid = useMemo(() => {
    return Boolean(
      form.businessName.trim() &&
      form.phone.trim() &&
      form.address.trim() &&
      form.message.trim()
    );
  }, [form.address, form.businessName, form.message, form.phone]);

  const updateField = (field: keyof BulkOrderFormState, value: string) => {
    console.log('Updating bulk order field', field, value.length);
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log('Submitting bulk order inquiry');

    if (!isFormValid) {
      Alert.alert('Missing information', 'Please complete your business name, phone number, address, and message.');
      return;
    }

    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 700));
      Alert.alert(
        'Inquiry sent',
        'Your bulk order request has been submitted. Our team will contact you soon.',
        [
          {
            text: 'OK',
          },
        ]
      );
      setForm((current) => ({
        ...current,
        message: '',
      }));
    } catch (error) {
      console.error('Bulk order inquiry failed', error);
      Alert.alert('Something went wrong', 'We could not submit your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={['#103127', '#0b1f19']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroBadge}>
            <Sparkles size={16} color={Colors.dark.text} />
            <Text style={styles.heroBadgeText}>Wholesale & bulk requests</Text>
          </View>
          <Text style={styles.heroTitle}>Tell us what your business needs</Text>
          <Text style={styles.heroText}>
            Fill out the form below with your business name, phone number, address, and message so we can follow up about bulk purchasing.
          </Text>
          <View style={styles.heroMetrics}>
            <View style={styles.heroMetricCard}>
              <Building2 size={18} color={Colors.dark.primary} />
              <Text style={styles.heroMetricLabel}>Business orders</Text>
            </View>
            <View style={styles.heroMetricCard}>
              <Phone size={18} color={Colors.dark.primary} />
              <Text style={styles.heroMetricLabel}>Fast follow-up</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.formCard}>
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Building2 size={16} color={Colors.dark.primary} />
              <Text style={styles.label}>Business name</Text>
            </View>
            <TextInput
              style={styles.input}
              value={form.businessName}
              onChangeText={(value) => updateField('businessName', value)}
              placeholder="Your business name"
              placeholderTextColor={Colors.dark.subtext}
              autoCapitalize="words"
              testID="bulk-business-name-input"
            />
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Phone size={16} color={Colors.dark.primary} />
              <Text style={styles.label}>Phone number</Text>
            </View>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="Best contact number"
              placeholderTextColor={Colors.dark.subtext}
              keyboardType="phone-pad"
              testID="bulk-phone-input"
            />
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <MapPin size={16} color={Colors.dark.primary} />
              <Text style={styles.label}>Business address</Text>
            </View>
            <TextInput
              style={[styles.input, styles.addressInput]}
              value={form.address}
              onChangeText={(value) => updateField('address', value)}
              placeholder="Street, city, state, ZIP"
              placeholderTextColor={Colors.dark.subtext}
              multiline={true}
              testID="bulk-address-input"
            />
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <MessageSquareText size={16} color={Colors.dark.primary} />
              <Text style={styles.label}>Message</Text>
            </View>
            <TextInput
              style={[styles.input, styles.messageInput]}
              value={form.message}
              onChangeText={(value) => updateField('message', value)}
              placeholder="Tell us what products or quantities you want to purchase"
              placeholderTextColor={Colors.dark.subtext}
              multiline={true}
              textAlignVertical="top"
              maxLength={500}
              testID="bulk-message-input"
            />
            <Text style={styles.helperText}>{form.message.length}/500</Text>
          </View>

          <Pressable
            style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            testID="bulk-submit-button"
          >
            <Send size={18} color={Colors.dark.text} />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Sending inquiry...' : 'Submit bulk inquiry'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
    gap: 18,
  },
  heroCard: {
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 16,
  },
  heroBadgeText: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: '700',
  },
  heroTitle: {
    color: Colors.dark.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  heroText: {
    color: '#b7c9c2',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 18,
  },
  heroMetrics: {
    flexDirection: 'row',
    gap: 10,
  },
  heroMetricCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
  heroMetricLabel: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 18,
  },
  fieldGroup: {
    gap: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: Colors.dark.text,
    fontSize: 15,
    fontWeight: '700',
  },
  input: {
    backgroundColor: Colors.dark.background,
    color: Colors.dark.text,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  addressInput: {
    minHeight: 84,
  },
  messageInput: {
    minHeight: 150,
  },
  helperText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    textAlign: 'right',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.dark.primary,
    borderRadius: 18,
    paddingVertical: 16,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '800',
  },
});
