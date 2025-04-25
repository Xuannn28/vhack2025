import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import i18n from '../translations/translations_language'; // Import the i18n instance
import * as Localization from 'expo-localization'; // This will help fetch the device's locale

const WearablePatientDetails = () => {
  const route = useRoute();
  const patient = route.params?.patient;

  // State to manage locale
  const [locale, setLocale] = useState('english'); // Default to 'english'

  useEffect(() => {
    // Fetch device locale and update i18n locale
    const deviceLocale = Localization.locale.split('-')[0]; // Get base language (e.g., 'en', 'fr', etc.)
    i18n.locale = deviceLocale;  // Set the locale dynamically based on device's locale
    setLocale(deviceLocale);  // Optionally, you can use this to trigger UI updates
  }, []);

  // Handle the case where patient data is missing
  if (!patient) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{i18n.t('no_patient_data')}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Display greeting with patient's name */}
      <Text style={styles.header}>
        {i18n.t('hello_patient', { name: patient.name })}
      </Text>

      {/* Patient info blocks */}
      <View style={styles.infoBlock}>
        <Text style={styles.label}>{i18n.t('age')}</Text>
        <Text style={styles.value}>{patient.age || '-'}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>{i18n.t('gender')}</Text>
        <Text style={styles.value}>{patient.gender || '-'}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoBlock}>
        <Text style={styles.label}>{i18n.t('heart_rate')}</Text>
        <Text style={styles.value}>{patient.heartRate} bpm</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>{i18n.t('blood_glucose')}</Text>
        <Text style={styles.value}>{patient.bloodGlucose} mg/dL</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>{i18n.t('blood_oxygen')}</Text>
        <Text style={styles.value}>{patient.bloodOxygen}%</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>{i18n.t('temperature')}</Text>
        <Text style={styles.value}>{patient.temperature} °C</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>{i18n.t('steps')}</Text>
        <Text style={styles.value}>{patient.steps}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>{i18n.t('calories_burned')}</Text>
        <Text style={styles.value}>{patient.caloriesBurned} kcal</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>{i18n.t('sleep_duration')}</Text>
        <Text style={styles.value}>{patient.sleepDuration} hrs</Text>
      </View>

      <Text style={styles.timestamp}>
        {i18n.t('last_updated')} {new Date(patient.timestamp).toLocaleString()}
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