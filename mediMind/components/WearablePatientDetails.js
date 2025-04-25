import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

const WearablePatientDetails = () => {
  const route = useRoute();
  const patient = route.params?.patient;

  if (!patient) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>No patient data available</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>
        Hello, {patient.name}
      </Text>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>Age</Text>
        <Text style={styles.value}>{patient.age || '-'}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>Gender</Text>
        <Text style={styles.value}>{patient.gender || '-'}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoBlock}>
        <Text style={styles.label}>Heart Rate</Text>
        <Text style={styles.value}>{patient.heartRate} bpm</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>Blood Glucose</Text>
        <Text style={styles.value}>{patient.bloodGlucose} mg/dL</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>Blood Oxygen</Text>
        <Text style={styles.value}>{patient.bloodOxygen}%</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>Temperature</Text>
        <Text style={styles.value}>{patient.temperature} °C</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>Steps</Text>
        <Text style={styles.value}>{patient.steps}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>Calories Burned</Text>
        <Text style={styles.value}>{patient.caloriesBurned} kcal</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>Sleep Duration</Text>
        <Text style={styles.value}>{patient.sleepDuration} hrs</Text>
      </View>

      <Text style={styles.timestamp}>
        Last updated: {new Date(patient.timestamp).toLocaleString()}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#A4C1C9',
    padding: 30,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A4C1C9',
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002147',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  label: {
    fontWeight: '600',
    color: '#002147',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: '#002147',
  },
  divider: {
    height: 1,
    backgroundColor: '#fff',
    marginVertical: 20,
  },
  timestamp: {
    marginTop: 30,
    fontStyle: 'italic',
    fontSize: 13,
    textAlign: 'center',
    color: '#002147',
  },
});

export default WearablePatientDetails;