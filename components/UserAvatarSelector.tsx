import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Image, Modal, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { X, Plus, Check, Trash2, Camera, Link, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/colors';
import { useUserStore, UserAvatar } from '@/store/userStore';

interface UserAvatarSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
];

export default function UserAvatarSelector({ visible, onClose }: UserAvatarSelectorProps) {
  const { avatars, addAvatar, selectAvatar, removeAvatar } = useUserStore();
  const [showAddAvatarModal, setShowAddAvatarModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleAddAvatar = () => {
    if (!avatarUrl.trim()) {
      Alert.alert('Error', 'Please enter a valid image URL');
      return;
    }

    if (avatars.length >= 5) {
      Alert.alert('Limit Reached', 'You can only have up to 5 avatars. Please remove one before adding another.');
      return;
    }

    addAvatar(avatarUrl);
    setAvatarUrl('');
    setShowAddAvatarModal(false);
  };

  const handleSelectAvatar = (id: string) => {
    selectAvatar(id);
  };

  const handleRemoveAvatar = (id: string) => {
    Alert.alert(
      'Remove Avatar',
      'Are you sure you want to remove this avatar?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          onPress: () => removeAvatar(id),
          style: 'destructive'
        }
      ]
    );
  };

  const handleAddDefaultAvatar = (url: string) => {
    if (avatars.length >= 5) {
      Alert.alert('Limit Reached', 'You can only have up to 5 avatars. Please remove one before adding another.');
      return;
    }

    addAvatar(url);
  };

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'This feature is not available on web.');
      return;
    }

    if (avatars.length >= 5) {
      Alert.alert('Limit Reached', 'You can only have up to 5 avatars. Please remove one before adding another.');
      return;
    }

    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permission to upload your photos.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Add the selected image as an avatar
      addAvatar(result.assets[0].uri);
    }
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
            <Text style={styles.title}>Profile Avatar</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X size={24} color={Colors.dark.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>Your Avatars</Text>
            
            {avatars.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>You haven't added any avatars yet</Text>
              </View>
            ) : (
              <View style={styles.avatarsGrid}>
                {avatars.map((avatar) => (
                  <View key={avatar.id} style={styles.avatarContainer}>
                    <Pressable
                      style={[
                        styles.avatarWrapper,
                        avatar.isSelected && styles.selectedAvatarWrapper
                      ]}
                      onPress={() => handleSelectAvatar(avatar.id)}
                    >
                      <Image source={{ uri: avatar.url }} style={styles.avatarImage} />
                      {avatar.isSelected && (
                        <View style={styles.checkmarkContainer}>
                          <Check size={16} color={Colors.dark.text} />
                        </View>
                      )}
                    </Pressable>
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => handleRemoveAvatar(avatar.id)}
                    >
                      <Trash2 size={16} color={Colors.dark.error} />
                    </Pressable>
                  </View>
                ))}
                
                {avatars.length < 5 && (
                  <Pressable
                    style={styles.addAvatarButton}
                    onPress={() => setShowAddAvatarModal(true)}
                  >
                    <Plus size={24} color={Colors.dark.primary} />
                    <Text style={styles.addAvatarText}>Add Avatar</Text>
                  </Pressable>
                )}
              </View>
            )}

            {Platform.OS !== 'web' && (
              <Pressable
                style={styles.pickFromGalleryButton}
                onPress={pickImage}
              >
                <ImageIcon size={20} color={Colors.dark.text} style={styles.galleryIcon} />
                <Text style={styles.pickFromGalleryText}>Choose from your photos</Text>
              </Pressable>
            )}

            <Text style={styles.sectionTitle}>Default Avatars</Text>
            <View style={styles.defaultAvatarsGrid}>
              {DEFAULT_AVATARS.map((url, index) => (
                <Pressable
                  key={index}
                  style={styles.defaultAvatarWrapper}
                  onPress={() => handleAddDefaultAvatar(url)}
                >
                  <Image source={{ uri: url }} style={styles.defaultAvatarImage} />
                  <View style={styles.addIconContainer}>
                    <Plus size={16} color={Colors.dark.text} />
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Add Avatar Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showAddAvatarModal}
            onRequestClose={() => setShowAddAvatarModal(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.addAvatarModalView}>
                <View style={styles.addAvatarHeader}>
                  <Text style={styles.addAvatarTitle}>Add Avatar</Text>
                  <Pressable
                    style={styles.closeButton}
                    onPress={() => setShowAddAvatarModal(false)}
                  >
                    <X size={24} color={Colors.dark.text} />
                  </Pressable>
                </View>

                <View style={styles.addAvatarContent}>
                  <Text style={styles.addAvatarLabel}>Enter Image URL</Text>
                  <View style={styles.urlInputContainer}>
                    <Link size={20} color={Colors.dark.subtext} style={styles.urlIcon} />
                    <TextInput
                      style={styles.urlInput}
                      value={avatarUrl}
                      onChangeText={setAvatarUrl}
                      placeholder="https://example.com/image.jpg"
                      placeholderTextColor={Colors.dark.subtext}
                      autoCapitalize="none"
                    />
                  </View>

                  <Text style={styles.noteText}>
                    Note: For best results, use square images. Maximum 5 avatars allowed.
                  </Text>

                  <View style={styles.buttonRow}>
                    <Pressable
                      style={styles.cancelButton}
                      onPress={() => setShowAddAvatarModal(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      style={styles.addButton}
                      onPress={handleAddAvatar}
                    >
                      <Text style={styles.addButtonText}>Add Avatar</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
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
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    marginBottom: 24,
  },
  emptyText: {
    color: Colors.dark.subtext,
    fontSize: 16,
    textAlign: 'center',
  },
  avatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  avatarContainer: {
    width: '33%',
    padding: 8,
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatarWrapper: {
    borderColor: Colors.dark.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  checkmarkContainer: {
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
  removeButton: {
    marginTop: 8,
    padding: 4,
  },
  addAvatarButton: {
    width: '33%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    margin: 8,
  },
  addAvatarText: {
    color: Colors.dark.primary,
    fontSize: 14,
    marginTop: 8,
  },
  pickFromGalleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  galleryIcon: {
    marginRight: 8,
  },
  pickFromGalleryText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  defaultAvatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  defaultAvatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    margin: 8,
    position: 'relative',
  },
  defaultAvatarImage: {
    width: '100%',
    height: '100%',
  },
  addIconContainer: {
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
  addAvatarModalView: {
    width: '90%',
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
  addAvatarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  addAvatarTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  addAvatarContent: {
    padding: 16,
  },
  addAvatarLabel: {
    color: Colors.dark.text,
    fontSize: 16,
    marginBottom: 8,
  },
  urlInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  urlIcon: {
    marginRight: 8,
  },
  urlInput: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 16,
  },
  noteText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  addButton: {
    flex: 1,
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  addButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});