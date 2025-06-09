import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, Image, Dimensions } from 'react-native';
import { X, Navigation, MapPin, Clock, Phone } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface DriverTrackingMapProps {
  visible: boolean;
  onClose: () => void;
  orderId: string;
  driverName?: string;
  estimatedArrival?: 'early' | 'on-time' | 'late';
}

export default function DriverTrackingMap({ 
  visible, 
  onClose, 
  orderId,
  driverName = "Your Driver",
  estimatedArrival = "on-time"
}: DriverTrackingMapProps) {
  const [driverLocation, setDriverLocation] = useState({ lat: 37.7749, lng: -122.4194 });
  const [deliveryLocation, setDeliveryLocation] = useState({ lat: 37.7849, lng: -122.4294 });
  const [estimatedTime, setEstimatedTime] = useState("15-20 minutes");
  const [distance, setDistance] = useState("2.3 miles");
  
  // Simulate driver movement
  useEffect(() => {
    if (!visible) return;
    
    const interval = setInterval(() => {
      setDriverLocation(prev => ({
        lat: prev.lat + (Math.random() * 0.001 - 0.0005),
        lng: prev.lng + (Math.random() * 0.001 - 0.0005)
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [visible]);
  
  // Update estimated time based on estimatedArrival prop
  useEffect(() => {
    switch (estimatedArrival) {
      case 'early':
        setEstimatedTime("10-15 minutes");
        break;
      case 'late':
        setEstimatedTime("25-30 minutes");
        break;
      case 'on-time':
      default:
        setEstimatedTime("15-20 minutes");
        break;
    }
  }, [estimatedArrival]);

  const getArrivalStatusText = () => {
    switch (estimatedArrival) {
      case 'early':
        return "Arriving earlier than expected!";
      case 'late':
        return "Slight delay in delivery";
      case 'on-time':
      default:
        return "On track for delivery";
    }
  };

  const getArrivalStatusColor = () => {
    switch (estimatedArrival) {
      case 'early':
        return Colors.dark.success;
      case 'late':
        return Colors.dark.warning;
      case 'on-time':
      default:
        return Colors.dark.secondary;
    }
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
            <Text style={styles.title}>Track Your Order</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.dark.text} />
            </Pressable>
          </View>
          
          <View style={styles.mapContainer}>
            {/* This is a placeholder for a real map. In a real app, you would use a map component here */}
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?q=80&w=1000' }} 
              style={styles.mapImage}
              resizeMode="cover"
            />
            
            {/* Simulated driver marker */}
            <View style={[styles.marker, styles.driverMarker]}>
              <Navigation size={24} color={Colors.dark.text} />
            </View>
            
            {/* Simulated destination marker */}
            <View style={[styles.marker, styles.destinationMarker]}>
              <MapPin size={24} color={Colors.dark.text} />
            </View>
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.driverInfoContainer}>
              <View style={styles.driverAvatarContainer}>
                <Text style={styles.driverInitial}>{driverName.charAt(0)}</Text>
              </View>
              
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{driverName}</Text>
                <Text style={styles.vehicleInfo}>Toyota Prius • ABC-123</Text>
              </View>
              
              <Pressable style={styles.callButton}>
                <Phone size={20} color={Colors.dark.text} />
              </Pressable>
            </View>
            
            <View style={styles.deliveryInfoContainer}>
              <View style={styles.deliveryInfoRow}>
                <Clock size={16} color={Colors.dark.primary} style={styles.infoIcon} />
                <Text style={styles.deliveryInfoText}>
                  Estimated arrival: <Text style={styles.highlightText}>{estimatedTime}</Text>
                </Text>
              </View>
              
              <View style={styles.deliveryInfoRow}>
                <Navigation size={16} color={Colors.dark.primary} style={styles.infoIcon} />
                <Text style={styles.deliveryInfoText}>
                  Distance: <Text style={styles.highlightText}>{distance}</Text>
                </Text>
              </View>
            </View>
            
            <View style={[
              styles.arrivalStatusContainer, 
              { backgroundColor: `${getArrivalStatusColor()}20` }
            ]}>
              <Text style={[styles.arrivalStatusText, { color: getArrivalStatusColor() }]}>
                {getArrivalStatusText()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: '90%',
    maxHeight: height * 0.8,
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
  mapContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  marker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverMarker: {
    backgroundColor: Colors.dark.primary,
    top: '40%',
    left: '30%',
  },
  destinationMarker: {
    backgroundColor: Colors.dark.secondary,
    top: '30%',
    right: '20%',
  },
  infoContainer: {
    padding: 16,
  },
  driverInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  driverInitial: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vehicleInfo: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryInfoContainer: {
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  deliveryInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  deliveryInfoText: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  highlightText: {
    color: Colors.dark.primary,
    fontWeight: '500',
  },
  arrivalStatusContainer: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  arrivalStatusText: {
    fontSize: 14,
    fontWeight: '500',
  },
});