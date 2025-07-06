import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, ArrowLeft, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuthStore();
  const { updateUserInfo, setBirthday: setUserBirthday, isVerified } = useUserStore();

  // Redirect if not verified - must verify age first
  useEffect(() => {
    if (!isVerified) {
      router.replace('/');
      return;
    }
  }, [isVerified, router]);

  const validateBirthday = (dateString: string): boolean => {
    // Check if date is in MM/DD/YYYY format
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }

    const [month, day, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    // Check if date is valid
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return false;
    }

    // Check if user is at least 21 years old
    const today = new Date();
    const age = today.getFullYear() - year;
    const monthDiff = today.getMonth() - (month - 1);
    const dayDiff = today.getDate() - day;
    
    if (age < 21 || (age === 21 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
      return false;
    }

    return true;
  };

  const formatBirthdayInput = (text: string): string => {
    // Remove all non-numeric characters
    const numbers = text.replace(/\D/g, '');
    
    // Add slashes automatically
    if (numbers.length >= 5) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    } else if (numbers.length >= 3) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return numbers;
    }
  };

  const handleBirthdayChange = (text: string) => {
    const formatted = formatBirthdayInput(text);
    setBirthday(formatted);
  };

  const handleSignUp = async () => {
    setError('');
    
    // Validate inputs
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !birthday.trim()) {
      setError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!validateBirthday(birthday)) {
      setError('Please enter a valid birthday (MM/DD/YYYY) and ensure you are at least 21 years old');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Convert birthday to ISO string for storage
      const [month, day, year] = birthday.split('/').map(Number);
      const birthdayDate = new Date(year, month - 1, day);
      
      // In a real app, you would create the account on your backend
      // For this demo, we'll just update the user info and sign in
      updateUserInfo(name, email, '');
      setUserBirthday(birthdayDate.toISOString());
      
      const success = await signIn(email, password);
      
      if (success) {
        router.replace('/(tabs)');
      } else {
        setError('Failed to create account');
      }
    } catch (err) {
      setError('An error occurred during sign up');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if not verified - age verification required first
  if (!isVerified) {
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color={Colors.dark.text} />
      </Pressable>
      
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to start ordering</Text>
      
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <User size={20} color={Colors.dark.subtext} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={Colors.dark.subtext}
            value={name}
            onChangeText={setName}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Mail size={20} color={Colors.dark.subtext} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.dark.subtext}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Calendar size={20} color={Colors.dark.subtext} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Birthday (MM/DD/YYYY)"
            placeholderTextColor={Colors.dark.subtext}
            value={birthday}
            onChangeText={handleBirthdayChange}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Lock size={20} color={Colors.dark.subtext} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.dark.subtext}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Lock size={20} color={Colors.dark.subtext} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={Colors.dark.subtext}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <Pressable 
          style={[styles.signUpButton, isLoading && styles.disabledButton]}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.dark.text} />
          ) : (
            <Text style={styles.signUpButtonText}>Create Account</Text>
          )}
        </Pressable>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By creating an account, you agree to our Terms of Service and Privacy Policy. You must be 21+ to use this service.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 10,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.dark.subtext,
    fontSize: 16,
    marginBottom: 32,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    color: Colors.dark.text,
    fontSize: 16,
  },
  errorText: {
    color: Colors.dark.error,
    fontSize: 14,
    marginBottom: 16,
  },
  signUpButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  signUpButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 24,
  },
  footerText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    textAlign: 'center',
  },
});