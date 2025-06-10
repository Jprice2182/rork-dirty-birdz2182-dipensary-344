import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import appInfo from '@/constants/appInfo';

interface AgeVerificationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function AgeVerificationModal({ isVisible, onClose, onVerified }: AgeVerificationModalProps) {
  const handleYes = () => {
    onVerified();
  };

  const handleNo = () => {
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Age Verification Required</Text>
          <Text style={styles.subtitle}>
            You must be {appInfo.minAge} or older to use this app.
          </Text>
          <Text style={styles.question}>
            Are you {appInfo.minAge} years of age or older?
          </Text>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.noButton} onPress={handleNo}>
              <Text style={styles.noButtonText}>No</Text>
            </Pressable>
            
            <Pressable style={styles.yesButton} onPress={handleYes}>
              <Text style={styles.yesButtonText}>Yes</Text>
            </Pressable>
          </View>

          <Text style={styles.disclaimer}>
            {appInfo.legalDisclaimer}
          </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    width: '90%',
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.subtext,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  question: {
    fontSize: 18,
    color: Colors.dark.text,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  noButton: {
    flex: 1,
    backgroundColor: Colors.dark.error,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  noButtonText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  yesButton: {
    flex: 1,
    backgroundColor: Colors.dark.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  yesButtonText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.dark.subtext,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 10,
  },
});