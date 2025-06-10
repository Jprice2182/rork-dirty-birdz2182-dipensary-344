import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

export default function PrivacyScreen() {
  const router = useRouter();

  const bulletPoints = {
    collect: [
      "Name and contact information",
      "Date of birth and age verification data",
      "Delivery address",
      "Payment information",
      "Order history"
    ],
    use: [
      "Process your orders",
      "Verify your age and identity",
      "Provide customer support",
      "Send order updates and notifications",
      "Improve our services"
    ],
    rights: [
      "Access your personal data",
      "Correct inaccurate data",
      "Request deletion of your data",
      "Opt out of marketing communications"
    ],
    share: [
      "Delivery partners (only delivery details)",
      "Payment processors",
      "Legal authorities when required by law"
    ]
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.dark.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: June 10, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>
          {bulletPoints.collect.map((point, index) => (
            <View key={index} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{point}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          {bulletPoints.use.map((point, index) => (
            <View key={index} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{point}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights</Text>
          {bulletPoints.rights.map((point, index) => (
            <View key={index} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{point}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information Sharing</Text>
          {bulletPoints.share.map((point, index) => (
            <View key={index} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{point}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border
  },
  backButton: {
    marginRight: 16
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text
  },
  content: {
    flex: 1,
    padding: 16
  },
  lastUpdated: {
    fontSize: 14,
    color: Colors.light.textDim,
    marginBottom: 24
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8
  },
  bullet: {
    marginRight: 8,
    color: Colors.light.text
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text
  }
});