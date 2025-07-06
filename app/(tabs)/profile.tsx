import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Alert, Platform, Image, RefreshControl, BackHandler } from 'react-native';
import { User, MapPin, LogOut, ChevronRight, Edit2, Star, MessageSquare, Mail, Fingerprint, Scan, Trash2, Calendar, Bell, Gift, Camera, Lock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import RateAppModal from '@/components/RateAppModal';
import CustomerServiceModal from '@/components/CustomerServiceModal';
import BiometricSetupModal from '@/components/BiometricSetupModal';
import DeleteAccountModal from '@/components/DeleteAccountModal';
import AddressModal from '@/components/AddressModal';
import UserAvatarSelector from '@/components/UserAvatarSelector';
import NotificationPreferencesModal from '@/components/NotificationPreferencesModal';
import BirthdayPromotionModal from '@/components/BirthdayPromotionModal';
import AgeVerificationModal from '@/components/AgeVerificationModal';
import appInfo from '@/constants/appInfo';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const { 
    name, 
    email, 
    phone, 
    addresses, 
    updateUserInfo, 
    setVerified,
    appRating,
    reviews,
    avatars,
    birthday,
    isVerified,
    removeAddress
  } = useUserStore();
  
  const { 
    signOut, 
    checkBiometricAvailability,
    useBiometrics
  } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editEmail, setEditEmail] = useState(email);
  const [editPhone, setEditPhone] = useState(phone);
  const [showRateAppModal, setShowRateAppModal] = useState(false);
  const [showCustomerServiceModal, setShowCustomerServiceModal] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showNotificationPreferences, setShowNotificationPreferences] = useState(false);
  const [showBirthdayPromotion, setShowBirthdayPromotion] = useState(false);
  const [editAddressIndex, setEditAddressIndex] = useState<number | undefined>(undefined);
  const [biometricInfo, setBiometricInfo] = useState<{
    available: boolean;
    biometryType: string | null;
  }>({ available: false, biometryType: null });
  const [refreshing, setRefreshing] = useState(false);

  const handleAgeVerified = () => {
    setVerified(true);
  };

  const handleAgeVerificationClose = () => {
    // If user closes without verifying, they can't use the app
    Alert.alert(
      "Age Verification Required",
      "You must verify your age to use this app.",
      [
        {
          text: "Exit App",
          onPress: () => {
            if (Platform.OS === 'android') {
              BackHandler.exitApp();
            } else {
              router.replace('/');
            }
          }
        }
      ]
    );
  };

  // Android back button handling
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backAction = () => {
        if (!isVerified) {
          Alert.alert(
            "Age Verification Required",
            "You must verify your age to use this app.",
            [
              {
                text: "Exit App",
                onPress: () => BackHandler.exitApp()
              }
            ]
          );
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }
  }, [isVerified]);

  // Check biometric availability
  useEffect(() => {
    const checkBiometrics = async () => {
      if (Platform.OS !== 'web') {
        try {
          const result = await checkBiometricAvailability();
          setBiometricInfo(result);
        } catch (error) {
          console.error('Error checking biometric availability:', error);
          setBiometricInfo({ available: false, biometryType: null });
        }
      }
    };
    
    checkBiometrics();
  }, [checkBiometricAvailability]);

  // Show age verification if not verified - this should be the first thing checked
  if (!isVerified) {
    return (
      <AgeVerificationModal 
        isVisible={true} 
        onClose={handleAgeVerificationClose}
        onVerified={handleAgeVerified}
      />
    );
  }

  const handleSave = () => {
    updateUserInfo(editName, editEmail, editPhone);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(name);
    setEditEmail(email);
    setEditPhone(phone);
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => {
            signOut();
            router.replace('/sign-in');
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleAddAddress = () => {
    setEditAddressIndex(undefined);
    setShowAddressModal(true);
  };

  const handleEditAddress = (index: number) => {
    setEditAddressIndex(index);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = (index: number) => {
    const address = addresses[index];
    Alert.alert(
      "Delete Address",
      `Are you sure you want to delete this address?\n\n${address.street}, ${address.city}, ${address.state} ${address.zipCode}`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeAddress(index);
            Alert.alert("Success", "Address deleted successfully!");
          }
        }
      ]
    );
  };

  const getBiometricIcon = () => {
    if (biometricInfo.biometryType === 'FaceID') {
      return <Scan size={20} color={Colors.dark.primary} />;
    }
    return <Fingerprint size={20} color={Colors.dark.primary} />;
  };

  const getSelectedAvatar = () => {
    const selectedAvatar = avatars.find(avatar => avatar.isSelected);
    return selectedAvatar?.url;
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.dark.primary}
          colors={[Colors.dark.primary]}
        />
      }
    >
      <View style={styles.header}>
        <Pressable 
          style={styles.avatarContainer}
          onPress={() => setShowAvatarSelector(true)}
          android_ripple={{ color: Colors.dark.primary, borderless: true }}
        >
          {getSelectedAvatar() ? (
            <Image source={{ uri: getSelectedAvatar() }} style={styles.avatarImage} />
          ) : (
            <User size={40} color={Colors.dark.text} />
          )}
          <View style={styles.cameraIconContainer}>
            <Camera size={16} color={Colors.dark.text} />
          </View>
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {!isEditing && (
            <Pressable 
              onPress={() => setIsEditing(true)} 
              style={styles.editButton}
              android_ripple={{ color: Colors.dark.primary, borderless: true }}
            >
              <Edit2 size={16} color={Colors.dark.primary} />
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
          )}
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Your name"
                placeholderTextColor={Colors.dark.subtext}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Your email"
                placeholderTextColor={Colors.dark.subtext}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="Your phone number"
                placeholderTextColor={Colors.dark.subtext}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.buttonRow}>
              <Pressable 
                onPress={handleCancel} 
                style={[styles.button, styles.cancelButton]}
                android_ripple={{ color: Colors.dark.text }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable 
                onPress={handleSave} 
                style={[styles.button, styles.saveButton]}
                android_ripple={{ color: Colors.dark.text }}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{name || "Not set"}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{email || "Not set"}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{phone || "Not set"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Birthday</Text>
              <Text style={[styles.infoValue, !birthday && styles.requiredField]}>
                {birthday ? new Date(birthday).toLocaleDateString() : "Required - Please set"}
              </Text>
            </View>
            
            <Pressable 
              style={styles.birthdayButton}
              onPress={() => setShowBirthdayPromotion(true)}
              android_ripple={{ color: Colors.dark.primary }}
            >
              <View style={styles.birthdayButtonContent}>
                <Calendar size={20} color={Colors.dark.primary} style={styles.birthdayIcon} />
                <View>
                  <Text style={styles.birthdayTitle}>Birthday Promotion</Text>
                  <Text style={styles.birthdayDescription}>Get a free 1g pre-roll on your birthday!</Text>
                </View>
              </View>
              <ChevronRight size={16} color={Colors.dark.subtext} />
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Addresses</Text>
          <Pressable 
            style={styles.editButton}
            onPress={handleAddAddress}
            android_ripple={{ color: Colors.dark.primary, borderless: true }}
          >
            <Text style={styles.editButtonText}>Add New</Text>
          </Pressable>
        </View>
        
        {addresses.length > 0 ? (
          addresses.map((address, index) => (
            <View key={index} style={styles.addressCard}>
              <MapPin size={16} color={Colors.dark.primary} style={styles.addressIcon} />
              <Pressable 
                style={styles.addressContent}
                onPress={() => handleEditAddress(index)}
                android_ripple={{ color: Colors.dark.primary }}
              >
                <Text style={styles.addressText}>
                  {address.street}, {address.city}, {address.state} {address.zipCode}
                </Text>
              </Pressable>
              <View style={styles.addressActions}>
                <Pressable 
                  style={styles.addressActionButton}
                  onPress={() => handleEditAddress(index)}
                  android_ripple={{ color: Colors.dark.primary, borderless: true }}
                >
                  <Edit2 size={16} color={Colors.dark.primary} />
                </Pressable>
                <Pressable 
                  style={styles.addressActionButton}
                  onPress={() => handleDeleteAddress(index)}
                  android_ripple={{ color: Colors.dark.error, borderless: true }}
                >
                  <Trash2 size={16} color={Colors.dark.error} />
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyAddressContainer}>
            <Text style={styles.emptyAddressText}>No addresses saved</Text>
            <Pressable 
              style={styles.addAddressButton}
              onPress={handleAddAddress}
              android_ripple={{ color: Colors.dark.primary }}
            >
              <Text style={styles.addAddressButtonText}>Add Address</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <Pressable 
          style={styles.notificationOption}
          onPress={() => setShowNotificationPreferences(true)}
          android_ripple={{ color: Colors.dark.primary }}
        >
          <Bell size={20} color={Colors.dark.primary} style={styles.notificationIcon} />
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Notification Preferences</Text>
            <Text style={styles.notificationDescription}>
              Manage which notifications you receive
            </Text>
          </View>
          <ChevronRight size={16} color={Colors.dark.subtext} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        
        {Platform.OS !== 'web' && biometricInfo.available && (
          <Pressable 
            style={styles.securityOption}
            onPress={() => setShowBiometricModal(true)}
            android_ripple={{ color: Colors.dark.primary }}
          >
            {getBiometricIcon()}
            <View style={styles.securityOptionContent}>
              <Text style={styles.securityOptionTitle}>
                {biometricInfo.biometryType} Authentication
              </Text>
              <Text style={styles.securityOptionDescription}>
                {useBiometrics ? "Enabled" : "Disabled"}
              </Text>
            </View>
            <ChevronRight size={16} color={Colors.dark.subtext} />
          </Pressable>
        )}
        
        <Pressable 
          style={styles.securityOption}
          onPress={() => router.push('/forgot-password')}
          android_ripple={{ color: Colors.dark.primary }}
        >
          <Lock size={20} color={Colors.dark.primary} style={styles.securityOptionIcon} />
          <View style={styles.securityOptionContent}>
            <Text style={styles.securityOptionTitle}>Change Password</Text>
            <Text style={styles.securityOptionDescription}>
              Update your account password
            </Text>
          </View>
          <ChevronRight size={16} color={Colors.dark.subtext} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Feedback</Text>
        
        <Pressable 
          style={styles.feedbackOption}
          onPress={() => setShowRateAppModal(true)}
          android_ripple={{ color: Colors.dark.primary }}
        >
          <Star size={20} color={Colors.dark.primary} style={styles.feedbackIcon} />
          <View style={styles.feedbackContent}>
            <Text style={styles.feedbackTitle}>Rate Our App</Text>
            <Text style={styles.feedbackDescription}>
              {appRating ? `You rated us ${appRating}/5 stars` : "Tell us what you think"}
            </Text>
          </View>
          <ChevronRight size={16} color={Colors.dark.subtext} />
        </Pressable>
        
        <Pressable 
          style={styles.feedbackOption}
          onPress={() => setShowCustomerServiceModal(true)}
          android_ripple={{ color: Colors.dark.primary }}
        >
          <Mail size={20} color={Colors.dark.primary} style={styles.feedbackIcon} />
          <View style={styles.feedbackContent}>
            <Text style={styles.feedbackTitle}>Customer Service</Text>
            <Text style={styles.feedbackDescription}>
              Need help? Contact our support team
            </Text>
          </View>
          <ChevronRight size={16} color={Colors.dark.subtext} />
        </Pressable>
        
        {reviews.length > 0 && (
          <Pressable 
            style={styles.feedbackOption}
            android_ripple={{ color: Colors.dark.primary }}
          >
            <MessageSquare size={20} color={Colors.dark.primary} style={styles.feedbackIcon} />
            <View style={styles.feedbackContent}>
              <Text style={styles.feedbackTitle}>Your Reviews</Text>
              <Text style={styles.feedbackDescription}>
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} submitted
              </Text>
            </View>
            <ChevronRight size={16} color={Colors.dark.subtext} />
          </Pressable>
        )}
      </View>

      <Pressable 
        style={styles.deleteAccountButton} 
        onPress={() => setShowDeleteAccountModal(true)}
        android_ripple={{ color: Colors.dark.error }}
      >
        <Trash2 size={20} color={Colors.dark.error} />
        <Text style={styles.deleteAccountText}>Delete Account</Text>
      </Pressable>

      <Pressable 
        style={styles.logoutButton} 
        onPress={handleLogout}
        android_ripple={{ color: Colors.dark.error }}
      >
        <LogOut size={20} color={Colors.dark.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>

      <Text style={styles.versionText}>Version 1.0.0</Text>
      
      <RateAppModal 
        visible={showRateAppModal} 
        onClose={() => setShowRateAppModal(false)} 
      />
      
      <CustomerServiceModal 
        visible={showCustomerServiceModal} 
        onClose={() => setShowCustomerServiceModal(false)} 
      />
      
      <BiometricSetupModal
        visible={showBiometricModal}
        onClose={() => setShowBiometricModal(false)}
      />
      
      <DeleteAccountModal
        visible={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
      />

      <AddressModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        editIndex={editAddressIndex}
        initialAddress={editAddressIndex !== undefined ? addresses[editAddressIndex] : undefined}
      />
      
      <UserAvatarSelector
        visible={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
      />
      
      <NotificationPreferencesModal
        visible={showNotificationPreferences}
        onClose={() => setShowNotificationPreferences(false)}
      />
      
      <BirthdayPromotionModal
        visible={showBirthdayPromotion}
        onClose={() => setShowBirthdayPromotion(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'android' ? 24 : 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  cameraIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: Colors.dark.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...(Platform.OS === 'android' && {
      elevation: 2,
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  editButtonText: {
    color: Colors.dark.primary,
    fontSize: 14,
    marginLeft: 4,
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  infoValue: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  requiredField: {
    color: Colors.dark.error,
    fontStyle: 'italic',
  },
  birthdayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    overflow: 'hidden',
  },
  birthdayButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  birthdayIcon: {
    marginRight: 12,
  },
  birthdayTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  birthdayDescription: {
    color: Colors.dark.subtext,
    fontSize: 12,
  },
  editForm: {
    gap: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
    fontSize: 14,
    ...(Platform.OS === 'android' && {
      paddingVertical: 12,
    }),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: Colors.dark.background,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: Colors.dark.primary,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  saveButtonText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '600',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  addressIcon: {
    marginRight: 12,
  },
  addressContent: {
    flex: 1,
    padding: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  addressText: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  addressActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addressActionButton: {
    padding: 8,
    borderRadius: 6,
    overflow: 'hidden',
  },
  emptyAddressContainer: {
    alignItems: 'center',
    padding: 16,
  },
  emptyAddressText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 12,
  },
  addAddressButton: {
    backgroundColor: Colors.dark.background,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  addAddressButtonText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  notificationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  notificationIcon: {
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  notificationDescription: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  securityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  securityOptionIcon: {
    marginRight: 12,
  },
  securityOptionContent: {
    flex: 1,
  },
  securityOptionTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  securityOptionDescription: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  feedbackOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  feedbackIcon: {
    marginRight: 12,
  },
  feedbackContent: {
    flex: 1,
  },
  feedbackTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  feedbackDescription: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...(Platform.OS === 'android' && {
      elevation: 2,
    }),
  },
  deleteAccountText: {
    color: Colors.dark.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...(Platform.OS === 'android' && {
      elevation: 2,
    }),
  },
  logoutText: {
    color: Colors.dark.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
});