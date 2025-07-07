import React from 'react';
import { StyleSheet, Text, View, Modal, Pressable, Switch, ScrollView } from 'react-native';
import { X, Bell, Flower, Cigarette, Cookie, Scroll, Gift, ShoppingBag, Calendar, PartyPopper } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';

interface NotificationPreferencesModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationPreferencesModal({ visible, onClose }: NotificationPreferencesModalProps) {
  const { notificationPreferences, updateNotificationPreference } = useUserStore();

  const toggleSwitch = (key: keyof typeof notificationPreferences) => {
    updateNotificationPreference(key, !notificationPreferences[key]);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>Notification Preferences</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X size={24} color={Colors.dark.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.notificationSection}>
              <View style={styles.sectionHeader}>
                <Bell size={20} color={Colors.dark.primary} />
                <Text style={styles.sectionTitle}>Product Updates</Text>
              </View>
              
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <Flower size={20} color={Colors.dark.text} style={styles.preferenceIcon} />
                  <View>
                    <Text style={styles.preferenceName}>New Flower Products</Text>
                    <Text style={styles.preferenceDescription}>Get notified when new flower products are available</Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: Colors.dark.border, true: Colors.dark.primary }}
                  thumbColor={Colors.dark.text}
                  ios_backgroundColor={Colors.dark.border}
                  onValueChange={() => toggleSwitch('newFlower')}
                  value={notificationPreferences.newFlower}
                />
              </View>
              
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <Cigarette size={20} color={Colors.dark.text} style={styles.preferenceIcon} />
                  <View>
                    <Text style={styles.preferenceName}>New Vape Products</Text>
                    <Text style={styles.preferenceDescription}>Get notified when new vape products are available</Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: Colors.dark.border, true: Colors.dark.primary }}
                  thumbColor={Colors.dark.text}
                  ios_backgroundColor={Colors.dark.border}
                  onValueChange={() => toggleSwitch('newVapes')}
                  value={notificationPreferences.newVapes}
                />
              </View>
              
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <Cookie size={20} color={Colors.dark.text} style={styles.preferenceIcon} />
                  <View>
                    <Text style={styles.preferenceName}>New Edible Products</Text>
                    <Text style={styles.preferenceDescription}>Get notified when new edible products are available</Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: Colors.dark.border, true: Colors.dark.primary }}
                  thumbColor={Colors.dark.text}
                  ios_backgroundColor={Colors.dark.border}
                  onValueChange={() => toggleSwitch('newEdibles')}
                  value={notificationPreferences.newEdibles}
                />
              </View>
              
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <Scroll size={20} color={Colors.dark.text} style={styles.preferenceIcon} />
                  <View>
                    <Text style={styles.preferenceName}>New Pre-Roll Products</Text>
                    <Text style={styles.preferenceDescription}>Get notified when new pre-roll products are available</Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: Colors.dark.border, true: Colors.dark.primary }}
                  thumbColor={Colors.dark.text}
                  ios_backgroundColor={Colors.dark.border}
                  onValueChange={() => toggleSwitch('newPreRolls')}
                  value={notificationPreferences.newPreRolls}
                />
              </View>
            </View>
            
            <View style={styles.notificationSection}>
              <View style={styles.sectionHeader}>
                <Gift size={20} color={Colors.dark.primary} />
                <Text style={styles.sectionTitle}>Promotions & Offers</Text>
              </View>
              
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <Gift size={20} color={Colors.dark.text} style={styles.preferenceIcon} />
                  <View>
                    <Text style={styles.preferenceName}>Promotions & Discounts</Text>
                    <Text style={styles.preferenceDescription}>Get notified about special offers, discounts, and promotions</Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: Colors.dark.border, true: Colors.dark.primary }}
                  thumbColor={Colors.dark.text}
                  ios_backgroundColor={Colors.dark.border}
                  onValueChange={() => toggleSwitch('promotions')}
                  value={notificationPreferences.promotions}
                />
              </View>
              
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <PartyPopper size={20} color={Colors.dark.text} style={styles.preferenceIcon} />
                  <View>
                    <Text style={styles.preferenceName}>Birthday Promotions</Text>
                    <Text style={styles.preferenceDescription}>Get notified on your birthday about your free gift</Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: Colors.dark.border, true: Colors.dark.primary }}
                  thumbColor={Colors.dark.text}
                  ios_backgroundColor={Colors.dark.border}
                  onValueChange={() => toggleSwitch('birthdayPromotions')}
                  value={notificationPreferences.birthdayPromotions}
                />
              </View>
            </View>
            
            <View style={styles.notificationSection}>
              <View style={styles.sectionHeader}>
                <ShoppingBag size={20} color={Colors.dark.primary} />
                <Text style={styles.sectionTitle}>Order Updates</Text>
              </View>
              
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <ShoppingBag size={20} color={Colors.dark.text} style={styles.preferenceIcon} />
                  <View>
                    <Text style={styles.preferenceName}>Order Status Updates</Text>
                    <Text style={styles.preferenceDescription}>Get notified about changes to your order status</Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: Colors.dark.border, true: Colors.dark.primary }}
                  thumbColor={Colors.dark.text}
                  ios_backgroundColor={Colors.dark.border}
                  onValueChange={() => toggleSwitch('orderUpdates')}
                  value={notificationPreferences.orderUpdates}
                />
              </View>
              
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <Gift size={20} color={Colors.dark.text} style={styles.preferenceIcon} />
                  <View>
                    <Text style={styles.preferenceName}>Refund Updates</Text>
                    <Text style={styles.preferenceDescription}>Get notified about refund status changes</Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: Colors.dark.border, true: Colors.dark.primary }}
                  thumbColor={Colors.dark.text}
                  ios_backgroundColor={Colors.dark.border}
                  onValueChange={() => toggleSwitch('refundUpdates')}
                  value={notificationPreferences.refundUpdates}
                />
              </View>
            </View>
            
            <Text style={styles.noteText}>
              Note: You will always receive important notifications about your account and orders, regardless of these settings.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  notificationSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  preferenceInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  preferenceIcon: {
    marginRight: 12,
  },
  preferenceName: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  preferenceDescription: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  noteText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 16,
    textAlign: 'center',
  },
});