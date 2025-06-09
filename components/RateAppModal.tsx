import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, TextInput, Alert } from 'react-native';
import { X, Send } from 'lucide-react-native';
import Colors from '@/constants/colors';
import RatingStars from './RatingStars';
import { useUserStore } from '@/store/userStore';
import appInfo from '@/constants/appInfo';

interface RateAppModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function RateAppModal({ visible, onClose }: RateAppModalProps) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { setAppRating, addReview } = useUserStore();

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      setAppRating(rating);
      
      if (feedback.trim()) {
        addReview(feedback, rating);
      }
      
      setIsSubmitting(false);
      Alert.alert(
        'Thank You!',
        'Your feedback helps us improve our app.',
        [{ text: 'OK', onPress: () => {
          setRating(5);
          setFeedback('');
          onClose();
        }}]
      );
    }, 1000);
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
            <Text style={styles.title}>Rate Our App</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.dark.text} />
            </Pressable>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.appName}>How would you rate {appInfo.name}?</Text>
            
            <View style={styles.ratingContainer}>
              <RatingStars
                rating={rating}
                onRatingChange={setRating}
                size={36}
              />
              <Text style={styles.ratingText}>
                {rating === 5 ? 'Excellent!' : 
                 rating === 4 ? 'Good' :
                 rating === 3 ? 'Average' :
                 rating === 2 ? 'Poor' : 'Very Poor'}
              </Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tell us what you think (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Your feedback helps us improve..."
                placeholderTextColor={Colors.dark.subtext}
                value={feedback}
                onChangeText={setFeedback}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
          
          <Pressable 
            style={[styles.submitButton, isSubmitting && styles.submittingButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Send size={20} color={Colors.dark.text} style={styles.submitIcon} />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
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
  appName: {
    color: Colors.dark.text,
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingText: {
    color: Colors.dark.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
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
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: Colors.dark.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  submittingButton: {
    opacity: 0.7,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});