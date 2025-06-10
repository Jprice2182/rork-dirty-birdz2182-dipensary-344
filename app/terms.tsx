// Previous imports remain the same...

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

        {/* Rest of the component remains the same... */}
      </ScrollView>
    </View>
  );
}

// Styles remain the same...