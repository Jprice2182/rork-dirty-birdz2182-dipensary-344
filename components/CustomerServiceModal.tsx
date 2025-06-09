import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { X, Mail, Phone, Clock, Send } from 'lucide-react-native';
import Colors from '@/constants/colors';
import appInfo from '@/constants/appInfo';

interface CustomerServiceModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CustomerServiceModal({ visible, onClose }: CustomerServiceModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSending(true);
    
    // Simulate sending message
    setTimeout(() => {
      setIsSending(false);
      Alert.alert(
        'Message Sent',
        'Thank you for contacting us. We will get back to you as soon as possible.',
        [{ text: 'OK', onPress: () => {
          setSubject('');
          setMessage('');
          onClose();
        }}]
      );
    }, 1500);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>Customer Service</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.dark.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.contactItem}>
              <Mail size={20} color={Colors.dark.primary} style={styles.contactIcon} />
              <View>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{appInfo.customerService.email}</Text>
              </View>
            </View>
            
            <View style={styles.contactItem}>
              <Phone size={20} color={Colors.dark.primary} style={styles.contactIcon} />
              <View>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{appInfo.customerService.phone}</Text>
              </View>
            </View>
            
            <View style={styles.contactItem}>
              <Clock size={20} color={Colors.dark.primary} style={styles.contactIcon} />
              <View>
                <Text style={styles.contactLabel}>Hours</Text>
                <Text style={styles.contactValue}>{appInfo.customerService.hours}</Text>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Send a Message</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="What's your inquiry about?"
                placeholderTextColor={Colors.dark.subtext}
                value={subject}
                onChangeText={setSubject}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Message</Text>
              <TextInput
                style={styles.messageInput}
                placeholder="How can we help you?"
                placeholderTextColor={Colors.dark.subtext}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
          
          <Pressable 
            style={[styles.sendButton, isSending && styles.sendingButton]}
            onPress={handleSend}
            disabled={isSending}
          >
            <Send size={20} color={Colors.dark.text} style={styles.sendIcon} />
            <Text style={styles.sendButtonText}>
              {isSending ? 'Sending...' : 'Send Message'}
            </Text>
          </Pressable>
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
    maxHeight: '70%',
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contactIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  contactLabel: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 4,
  },
  contactValue: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
    fontSize: 16,
  },
  messageInput: {
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
    fontSize: 16,
    minHeight: 120,
  },
  sendButton: {
    backgroundColor: Colors.dark.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  sendingButton: {
    opacity: 0.7,
  },
  sendIcon: {
    marginRight: 8,
  },
  sendButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});