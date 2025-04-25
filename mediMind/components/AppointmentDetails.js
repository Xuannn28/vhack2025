import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Share,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const AppointmentSummaryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointmentId } = route.params || {};
  
  const [appointment, setAppointment] = useState(null);
  
  useEffect(() => {
    if (appointmentId) {
      loadAppointmentData();
    }
  }, [appointmentId]);
  
  // In AppointmentSummaryScreen.js (currently named AppointmentDetails.js)
  const loadAppointmentData = async () => {
    try {
      const appointmentData = await AsyncStorage.getItem(`appointment_${appointmentId}`);
      if (appointmentData) {
        setAppointment(JSON.parse(appointmentData));
      } else {
        console.error('No appointment data found for ID:', appointmentId);
      }
    } catch (error) {
      console.error('Failed to load appointment data:', error);
    }
  };
  
  const handleShare = async () => {
    if (!appointment) return;
    
    try {
      const result = await Share.share({
        message: 
          `Appointment Summary\n\n` +
          `Doctor: Dr. ${appointment.doctor}\n` +
          `Date: ${appointment.date}\n` +
          `Reason: ${appointment.reason}\n\n` +
          `Key Takeaways: ${appointment.keyTakeaways}\n\n` +
          `Recommendations:\n` +
          `${appointment.recommendations.map(rec => `• ${rec}`).join('\n')}\n\n` +
          `Follow-up: ${appointment.nextAppointment}`
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share appointment summary');
    }
  };
  
  if (!appointment) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#3A1E70" />
        </TouchableOpacity>
        <Text style={styles.title}>AI Summary</Text>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#3A1E70" />
        </TouchableOpacity>
      </View>
      
      {/* Appointment Summary Card */}
      <View style={styles.summaryHeaderCard}>
        <Text style={styles.summaryTitle}>{appointment.title}</Text>
        <View style={styles.summaryMeta}>
          <Text style={styles.summaryDate}>Visit date: {appointment.date}</Text>
          <Text style={styles.summaryDoctor}>Dr. {appointment.doctor}</Text>
        </View>
      </View>
      
      {/* Main Content */}
      <ScrollView style={styles.contentContainer}>
        {/* AI Generated Summary */}
        <View style={styles.aiSummaryContainer}>
          <View style={styles.aiHeaderRow}>
            <Ionicons name="analytics-outline" size={22} color="#3A1E70" />
            <Text style={styles.aiSummaryTitle}>AI-Generated Summary</Text>
          </View>
          
          <Text style={styles.aiSummaryText}>
            Based on your recent appointment with Dr. {appointment.doctor} regarding {appointment.reason.toLowerCase()}, 
            the following insights were identified from your conversation:
          </Text>
          
          {/* Key Medical Information Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Key Medical Information</Text>
            <Text style={styles.sectionContent}>
              {appointment.keyTakeaways}
            </Text>
          </View>
          
          {/* Doctor's Assessment Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Doctor's Assessment</Text>
            <Text style={styles.sectionContent}>
              {appointment.observations}
            </Text>
          </View>
          
          {/* Recommendations Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            {appointment.recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>
          
          {/* Medication Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Medication</Text>
            <Text style={styles.sectionContent}>
              {appointment.medication}
            </Text>
          </View>
          
          {/* Follow-up Plan Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Follow-up Plan</Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.boldText}>Next appointment: </Text>
              {appointment.nextAppointment}
            </Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.boldText}>Self-monitoring: </Text>
              {appointment.selfMonitoring}
            </Text>
          </View>
          
          {/* Disclaimer Notice */}
          <View style={styles.disclaimerContainer}>
            <Ionicons name="information-circle-outline" size={16} color="#666" />
            <Text style={styles.disclaimerText}>
              This AI-generated summary is based on the transcription of your appointment and is not a substitute for professional medical advice. Always consult with your healthcare provider for medical concerns.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Actions */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home-outline" size={22} color="white" />
          <Text style={styles.actionButtonText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="document-text-outline" size={22} color="white" />
          <Text style={styles.actionButtonText}>View Transcription</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f0f3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#AFC2D5',
  },
  loadingText: {
    color: '#3A1E70',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A1E70',
  },
  summaryHeaderCard: {
    backgroundColor: '#3A1E70',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  summaryMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryDate: {
    color: '#DDD',
    fontSize: 14,
  },
  summaryDoctor: {
    color: '#DDD',
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  aiSummaryContainer: {
    padding: 16,
    paddingBottom: 80, // Space for action bar
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A1E70',
    marginLeft: 8,
  },
  aiSummaryText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 16,
  },
  sectionContainer: {
    marginBottom: 16,
    backgroundColor: '#F8F5FC',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3A1E70',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3A1E70',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3A1E70',
    marginTop: 7,
    marginRight: 10,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9E92B2',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: '#3A1E70',
    flex: 2,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default AppointmentSummaryScreen;