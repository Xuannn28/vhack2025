import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const AppointmentDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get appointment data from navigation
  const { appointment } = route.params || {};

  if (!appointment) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.title}>Error: No appointment data found</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="arrow-back" size={24} color="#3A1E70" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointment Summary</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <Text style={styles.title}>{appointment.title}</Text>

      {/* Appointment Details */}
      <View style={styles.detailsBox}>
        <Text style={styles.label}>Date of Checkup</Text>
        <Text style={styles.input}>{appointment.date}</Text>

        <Text style={styles.label}>Doctor's Name</Text>
        <Text style={styles.input}>{appointment.doctor}</Text>

        <Text style={styles.label}>Reason for Visit</Text>
        <Text style={styles.input}>{appointment.reason}</Text>
      </View>

      {/* Summary Section */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>1. Key Takeaways:</Text>
        <Text style={styles.summaryText}>• {appointment.keyTakeaways}</Text>

        <Text style={styles.summaryTitle}>2. Therapist's Observations & Insights:</Text>
        <Text style={styles.summaryText}>• {appointment.observations}</Text>

        <Text style={styles.summaryTitle}>3. Therapist's Recommendations & Next Steps:</Text>
        {appointment.recommendations && appointment.recommendations.map((rec, index) => (
          <Text key={index} style={styles.summaryText}>✅ {rec}</Text>
        ))}

        <Text style={styles.summaryTitle}>4. Medication (If Prescribed):</Text>
        <Text style={styles.summaryText}>• {appointment.medication}</Text>

        <Text style={styles.summaryTitle}>5. Follow-Up & Support Plan:</Text>
        <Text style={styles.summaryText}>• Next Appointment: {appointment.nextAppointment}</Text>
        <Text style={styles.summaryText}>• {appointment.selfMonitoring}</Text>
      </View>
      
      {/* Back to Home Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AFC2D5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A1E70',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3A1E70',
    marginBottom: 10,
  },
  detailsBox: {
    backgroundColor: '#DCE3F0',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3A1E70',
  },
  input: {
    fontSize: 16,
    backgroundColor: '#EFE9F7',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  summaryBox: {
    backgroundColor: '#DCE3F0',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3A1E70',
    marginTop: 10,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#3A1E70',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AppointmentDetails;