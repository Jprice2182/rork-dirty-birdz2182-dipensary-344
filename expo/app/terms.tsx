import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import appInfo from '@/constants/appInfo';

export default function Terms() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.dark.text} />
        </Pressable>
        <Text style={styles.title}>Terms of Service</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
        <Text style={styles.text}>
          By accessing and using {appInfo.name}, you accept and agree to be bound by the terms 
          and provision of this agreement.
        </Text>

        <Text style={styles.sectionTitle}>Age Requirement</Text>
        <Text style={styles.text}>
          You must be at least {appInfo.minAge} years old to use this service. By using this app, 
          you represent and warrant that you are at least {appInfo.minAge} years of age.
        </Text>

        <Text style={styles.sectionTitle}>Product Information</Text>
        <Text style={styles.text}>
          All products sold through this app are intended for adult use only. Products have not 
          been evaluated by the FDA and are not intended to diagnose, treat, cure, or prevent any disease.
        </Text>

        <Text style={styles.sectionTitle}>Delivery Terms</Text>
        <Text style={styles.text}>
          Delivery is available within our service area. Estimated delivery times are approximate 
          and may vary based on location and demand. A valid ID will be required upon delivery.
        </Text>

        <Text style={styles.sectionTitle}>Payment and Pricing</Text>
        <Text style={styles.text}>
          All prices are subject to change without notice. Payment is required at the time of order. 
          We accept major credit cards and other payment methods as indicated in the app.
        </Text>

        <Text style={styles.sectionTitle}>Limitation of Liability</Text>
        <Text style={styles.text}>
          {appInfo.name} shall not be liable for any indirect, incidental, special, consequential, 
          or punitive damages resulting from your use of the service.
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: Colors.dark.subtext,
    lineHeight: 24,
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 14,
    color: Colors.dark.subtext,
    fontStyle: 'italic',
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
  },
});