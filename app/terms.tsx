import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import appInfo from '@/constants/appInfo';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.dark.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Terms of Service</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: June 10, 2025</Text>
        
        <Text style={styles.section}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By accessing and using {appInfo.name}, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
        </Text>

        <Text style={styles.section}>2. Age Verification</Text>
        <Text style={styles.text}>
          You must be {appInfo.minAge} years or older to use {appInfo.name}. By using our service, you represent and warrant that you are at least {appInfo.minAge} years of age.
        </Text>

        <Text style={styles.section}>3. Product Orders</Text>
        <Text style={styles.text}>
          All orders are subject to product availability and delivery area restrictions. We reserve the right to refuse service to anyone for any reason at any time.
        </Text>

        <Text style={styles.section}>4. Delivery Policy</Text>
        <Text style={styles.text}>
          Delivery times are estimates and may vary based on traffic, weather, and other factors. A valid government-issued ID showing proof of age will be required at delivery.
        </Text>

        <Text style={styles.section}>5. Payment Terms</Text>
        <Text style={styles.text}>
          All prices are in USD. Payment is required at the time of order. We accept major credit cards and other payment methods as specified in the app.
        </Text>

        <Text style={styles.section}>6. Privacy</Text>
        <Text style={styles.text}>
          Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
        </Text>

        <Text style={styles.section}>7. Account Security</Text>
        <Text style={styles.text}>
          You are responsible for maintaining the confidentiality of your account and password. Please notify us immediately of any unauthorized use of your account.
        </Text>

        <Text style={styles.section}>8. Modifications</Text>
        <Text style={styles.text}>
          We reserve the right to modify these terms at any time. Your continued use of the service following any changes constitutes acceptance of those changes.
        </Text>

        <Text style={styles.section}>9. Contact Information</Text>
        <Text style={styles.text}>
          For questions about these Terms of Service, please contact us at:{`\n`}
          Email: {appInfo.supportEmail}{`\n`}
          Phone: {appInfo.supportPhone}
        </Text>

        <Text style={styles.disclaimer}>
          {appInfo.legalDisclaimer}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: Colors.dark.card,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  lastUpdated: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 24,
  },
  section: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  text: {
    color: Colors.dark.subtext,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  disclaimer: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 32,
    marginBottom: 40,
    textAlign: 'center',
  },
});