import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HealthDetailsScreen = ({ route, navigation }) => {
    const { userId } = route.params;
    
    // Sample health data for Alex
    const healthData = {
        bloodSugar: [
            { date: '2025-04-21', value: '6.2 mmol/L', time: '08:30 AM' },
            { date: '2025-04-20', value: '5.9 mmol/L', time: '08:15 AM' },
            { date: '2025-04-19', value: '6.4 mmol/L', time: '08:45 AM' },
        ],
        medications: [
            { name: 'Metformin', dosage: '500mg', schedule: 'Twice daily', nextDose: '5:00 PM' },
            { name: 'Lisinopril', dosage: '10mg', schedule: 'Once daily', nextDose: 'Tomorrow 9:00 AM' },
        ],
        appointments: [
            { doctor: 'Dr. Sarah Johnson', date: '2025-04-22', time: '10:30 AM', type: 'Diabetes Check-up' },
            { doctor: 'Dr. Michael Lee', date: '2025-05-10', time: '2:15 PM', type: 'Annual Physical' },
        ],
        vitals: {
            bloodPressure: '124/78 mmHg',
            heartRate: '72 bpm',
            weight: '178 lbs',
            bmi: '24.2',
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{userId}'s Health Data</Text>
            </View>

            <ScrollView style={styles.scrollContainer}>
                {/* Blood Sugar Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="water" size={22} color="#3498db" />
                        <Text style={styles.sectionTitle}>Blood Sugar</Text>
                    </View>
                    
                    {healthData.bloodSugar.map((reading, index) => (
                        <View key={index} style={styles.dataItem}>
                            <View style={styles.dataItemLeft}>
                                <Text style={styles.dataValue}>{reading.value}</Text>
                                <Text style={styles.dataLabel}>{reading.date}</Text>
                            </View>
                            <Text style={styles.dataTime}>{reading.time}</Text>
                        </View>
                    ))}
                    
                    <TouchableOpacity style={styles.viewMoreButton}>
                        <Text style={styles.viewMoreText}>View All History</Text>
                    </TouchableOpacity>
                </View>

                {/* Medications Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="medkit" size={22} color="#e74c3c" />
                        <Text style={styles.sectionTitle}>Medications</Text>
                    </View>
                    
                    {healthData.medications.map((med, index) => (
                        <View key={index} style={styles.dataItem}>
                            <View style={styles.dataItemLeft}>
                                <Text style={styles.dataValue}>{med.name} - {med.dosage}</Text>
                                <Text style={styles.dataLabel}>{med.schedule}</Text>
                            </View>
                            <View style={styles.pillContainer}>
                                <Text style={styles.pillText}>Next: {med.nextDose}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Appointments Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="calendar" size={22} color="#9b59b6" />
                        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
                    </View>
                    
                    {healthData.appointments.map((appt, index) => (
                        <View key={index} style={styles.dataItem}>
                            <View style={styles.dataItemLeft}>
                                <Text style={styles.dataValue}>{appt.doctor} - {appt.type}</Text>
                                <Text style={styles.dataLabel}>{appt.date}</Text>
                            </View>
                            <Text style={styles.dataTime}>{appt.time}</Text>
                        </View>
                    ))}
                </View>

                {/* Vitals Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="heart" size={22} color="#2ecc71" />
                        <Text style={styles.sectionTitle}>Vital Statistics</Text>
                    </View>
                    
                    <View style={styles.vitalsGrid}>
                        <View style={styles.vitalItem}>
                            <Text style={styles.vitalValue}>{healthData.vitals.bloodPressure}</Text>
                            <Text style={styles.vitalLabel}>Blood Pressure</Text>
                        </View>
                        <View style={styles.vitalItem}>
                            <Text style={styles.vitalValue}>{healthData.vitals.heartRate}</Text>
                            <Text style={styles.vitalLabel}>Heart Rate</Text>
                        </View>
                        <View style={styles.vitalItem}>
                            <Text style={styles.vitalValue}>{healthData.vitals.weight}</Text>
                            <Text style={styles.vitalLabel}>Weight</Text>
                        </View>
                        <View style={styles.vitalItem}>
                            <Text style={styles.vitalValue}>{healthData.vitals.bmi}</Text>
                            <Text style={styles.vitalLabel}>BMI</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6f0f3',
    },
    header: {
        backgroundColor: '#2c3e50',
        padding: 16,
        paddingTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    scrollContainer: {
        flex: 1,
        padding: 16,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        marginLeft: 8,
    },
    dataItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f9f9f9',
    },
    dataItemLeft: {
        flex: 1,
    },
    dataValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2c3e50',
    },
    dataLabel: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 2,
    },
    dataTime: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    viewMoreButton: {
        alignSelf: 'center',
        marginTop: 12,
        paddingVertical: 8,
    },
    viewMoreText: {
        color: '#3498db',
        fontSize: 14,
        fontWeight: '500',
    },
    pillContainer: {
        backgroundColor: '#ebf5fb',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    pillText: {
        color: '#3498db',
        fontSize: 12,
        fontWeight: '500',
    },
    vitalsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    vitalItem: {
        width: '48%',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    vitalValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 4,
    },
    vitalLabel: {
        fontSize: 14,
        color: '#7f8c8d',
    },
});

export default HealthDetailsScreen;