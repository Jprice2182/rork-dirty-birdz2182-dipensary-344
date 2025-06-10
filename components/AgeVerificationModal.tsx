// Update the terms container to use Links
const termsContainer = (
  <View style={styles.termsContainer}>
    <Text style={styles.termsTitle}>Terms & Privacy</Text>
    <Text style={styles.termsText}>
      By continuing, you agree to our{' '}
      <Link href="/terms" style={styles.termsLink}>Terms of Service</Link>
      {' '}and{' '}
      <Link href="/privacy" style={styles.termsLink}>Privacy Policy</Link>. 
      All your information is encrypted and we will not share your personal 
      information with anyone else. Your privacy and security are our top priority.
    </Text>
    
    <Text style={styles.encryptionText}>
      🔒 Everything is encrypted - Your data is secure
    </Text>
  </View>
);

// Add to styles
termsLink: {
  color: Colors.dark.primary,
  textDecorationLine: 'underline',
},