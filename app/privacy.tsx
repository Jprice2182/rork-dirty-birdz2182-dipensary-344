import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import appInfo from '@/constants/appInfo';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.dark.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.iconContainer}>
          <Lock size={40} color={Colors.dark.primary} />
        </View>

        <Text style={styles.lastUpdated}>Last Updated: June 10, 2025</Text>
        
        <Text style={styles.section}>1. Information We Collect</Text>
        <Text style={styles.text}>
          We collect information that you provide directly to us, including:
          {'
'}- Name and contact information
          {'
'}- Date of birth and age verification data
          {'
'}- Delivery address
          {'
'}- Payment information
          {'
'}- Order history
        </Text>

        <Text style={styles.section}>2. How We Use Your Information</Text>
        <Text style={styles.text}>
          We use the information we collect to:
          {'
'}- Process your orders
          {'
'}- Verify your age and identity
          {'
'}- Provide customer support
          {'
'}- Send order updates and notifications
          {'
'}- Improve our services
        </Text>

        <Text style={styles.section}>3. Data Security</Text>
        <Text style={styles.text}>
          We implement appropriate technical and organizational measures to protect your personal information. All data is encrypted during transmission and storage.
        </Text>

        <Text style={styles.section}>4. Information Sharing</Text>
        <Text style={styles.text}>
          We do not sell your personal information. We share your information only with:
          {'
'}- Delivery partners (only delivery details)
          {'
'}- Payment processors
          {'
'}- Legal authorities when required by law
        </Text>

        <Text style={styles.section}>5. Your Rights</Text>
        <Text style={styles.text}>
          You have the right to:
          {'
'}- Access your personal data
          {'
'}- Correct inaccurate data
          {'
'}- Request deletion of your data
          {'
'}- Opt out of marketing communications
        </Text>

        <Text style={styles.section}>6. Data Retention</Text>
        <Text style={styles.text}>
          We retain your personal information only for as long as necessary to provide our services and comply with legal obligations.
        </Text>

        <Text style={styles.section}>7. Changes to Privacy Policy</Text>
        <Text style={styles.text}>
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
        </Text>

        <Text style={styles.section}>8. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about this Privacy Policy, please contact us at:
          {'
'}Email: {appInfo.supportEmail}
          {'
'}Phone: {appInfo.supportPhone}
        </Text>

        <Text style={styles.encryptionNote}>
          🔒 Your data is encrypted and secure
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
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
  encryptionNote: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 32,
    marginBottom: 40,
    textAlign: 'center',
  },
});