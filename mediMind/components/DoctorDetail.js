import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5, Feather } from '@expo/vector-icons';

const DoctorDetail = ({ route, navigation }) => {
  const { doctor } = route.params;

  return (
    <View style={styles.container}>   
      {/* Doctor Image */}
      <View style={styles.imageContainer}>
        <Image source={doctor.image} style={styles.doctorImage} />
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <FontAwesome5 name="user-friends" size={20} color="#88A2B9" />
          <Text style={styles.statNumber}>1000+</Text>
          <Text style={styles.statLabel}>Patients</Text>
        </View>
        <View style={styles.statBox}>
          <Feather name="award" size={20} color="#88A2B9" />
          <Text style={styles.statNumber}>10 Yrs</Text>
          <Text style={styles.statLabel}>Experience</Text>
        </View>
        <View style={styles.statBox}>
          <FontAwesome5 name="star" size={20} color="#FFC107" />
          <Text style={styles.statNumber}>{doctor.rating}</Text>
          <Text style={styles.statLabel}>Ratings</Text>
        </View>
      </View>

      {/* About Doctor Section */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>About Doctor</Text>
        <Text style={styles.description}>{doctor.description}</Text>
        
        <Text style={styles.sectionTitle}>Working time</Text>
        <Text style={styles.workingTime}>Mon - Sat (08:30 AM - 09:00 PM)</Text>
        
        <Text style={styles.sectionTitle}>Communication</Text>
        <View style={styles.communicationOption}>
          <FontAwesome5 name="comment-dots" size={20} color="#DD5B9A" />
          <Text style={styles.communicationText}>Messaging</Text>
        </View>
        <View style={styles.communicationOption}>
          <Feather name="phone-call" size={20} color="#4A90E2" />
          <Text style={styles.communicationText}>Audio Call</Text>
        </View>
        <View style={styles.communicationOption}>
          <FontAwesome5 name="video" size={20} color="#F4A621" />
          <Text style={styles.communicationText}>Video Call</Text>
        </View>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => navigation.navigate('DoctorAppointment', { doctor })}
      >
        <Text style={styles.confirmText}>CONFIRM</Text>
      </TouchableOpacity>

    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e6f0f3', alignItems: 'center', padding: 20 },
  imageContainer: { borderWidth: 3, borderColor: '#0882B9', borderRadius: 100, padding: 5 },
  doctorImage: { width: 150, height: 150, borderRadius: 75 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginVertical: 20 },
  statBox: { backgroundColor: 'white', padding: 10, borderRadius: 10, alignItems: 'center', width: 100 },
  statNumber: { fontSize: 16, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: 'gray' },
  detailsContainer: { backgroundColor: 'white', padding: 15, borderRadius: 10, width: '100%', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  description: { fontSize: 14, color: 'gray', marginVertical: 5 },
  workingTime: { fontSize: 14, color: 'gray' },
  communicationOption: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  communicationText: { fontSize: 14, color: 'gray', marginLeft: 10 },
  confirmButton: { backgroundColor: '#006D77', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  confirmText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default DoctorDetail;