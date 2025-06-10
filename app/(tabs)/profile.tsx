import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Alert, Platform, Image, RefreshControl } from 'react-native';
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
    isVerified
  } = useUserStore();
  
  const { 
    signOut, 
    checkBiometricAvailability,
    useBiometrics
  } = useAuthStore();

  // Show age verification if not verified - this should be the first thing checked
  if (!isVerified) {
    return <AgeVerificationModal visible={true} />;
  }

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

  // Check biometric availability
  React.useEffect(() => {
    const checkBiometrics = async () => {
      if (Platform.OS !== 'web') {
        const result = await checkBiometricAvailability();
        setBiometricInfo(result);
      }
    };
    
    checkBiometrics();
  }, [checkBiometricAvailability]);

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
            <Pressable onPress={() => setIsEditing(true)} style={styles.editButton}>
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
              <Pressable onPress={handleCancel} style={[styles.button, styles.cancelButton]}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSave} style={[styles.button, styles.saveButton]}>
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
            
            <Pressable 
              style={styles.birthdayButton}
              onPress={() => setShowBirthdayPromotion(true)}
            >
              <View style={styles.birthdayButtonContent}>
                <Calendar size={20} color={Colors.dark.primary} style={styles.birthdayIcon} />
                <View>
                  <Text style={styles.birthdayTitle}>Birthday Promotion</Text>
                  <Text style={styles.birthdayDescription}>Get a free 0.5g pre-roll on your birthday!</Text>
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
          >
            <Text style={styles.editButtonText}>Add New</Text>
          </Pressable>
        </View>
        
        {addresses.length > 0 ? (
          addresses.map((address, index) => (
            <Pressable 
              key={index} 
              style={styles.addressCard}
              onPress={() => handleEditAddress(index)}
            >
              <MapPin size={16} color={Colors.dark.primary} style={styles.addressIcon} />
              <View style={styles.addressContent}>
                <Text style={styles.addressText}>
                  {address.street}, {address.city}, {address.state} {address.zipCode}
                </Text>
              </View>
              <ChevronRight size={16} color={Colors.dark.subtext} />
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyAddressContainer}>
            <Text style={styles.emptyAddressText}>No addresses saved</Text>
            <Pressable 
              style={styles.addAddressButton}
              onPress={handleAddAddress}
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
          <Pressable style={styles.feedbackOption}>
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
      >
        <Trash2 size={20} color={Colors.dark.error} />
        <Text style={styles.deleteAccountText}>Delete Account</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
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
  birthdayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
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
  },
  addressIcon: {
    marginRight: 12,
  },
  addressContent: {
    flex: 1,
  },
  addressText: {
    color: Colors.dark.text,
    fontSize: 14,
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