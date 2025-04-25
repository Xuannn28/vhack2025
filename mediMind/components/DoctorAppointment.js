import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const availableTimes = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '12:00 PM', '12:30 PM', '01:30 PM', '02:00 PM',
    '03:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
];

const DoctorAppointment = ({ route, navigation }) => {
    const { doctor } = route.params;
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.header}>New Appointment</Text>
                <Image source={doctor.image} style={styles.doctorImage} />
                <Text style={styles.doctorName}>{doctor.name}</Text>

                <Calendar
                    onDayPress={(day) => setSelectedDate(day.dateString)}
                    markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: '#6FA3EF' } } : {}}
                    theme={{ todayTextColor: '#6FA3EF' }}
                    style={styles.calendar}
                />

                <Text style={styles.subHeader}>Available Time</Text>
                <ScrollView horizontal>
                    <FlatList
                        data={availableTimes}
                        numColumns={3}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.timeSlot, selectedTime === item && styles.selectedTime]}
                                onPress={() => setSelectedTime(item)}
                            >
                                <Text style={[styles.timeText, selectedTime === item && { color: 'white' }]}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </ScrollView>

                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => navigation.navigate('PatientDetails', { date: selectedDate, time: selectedTime })}
                    disabled={!selectedDate || !selectedTime}
                >
                    <Text style={styles.nextText}>NEXT</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1 },
    container: { flex: 1, backgroundColor: '#e6f0f3', padding: 20, alignItems: 'center' },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    doctorImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
    doctorName: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    calendar: { borderRadius: 10, marginBottom: 20, width: '100%' },
    subHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    timeSlot: { backgroundColor: '#F0F0F0', padding: 10, borderRadius: 10, margin: 5 },
    selectedTime: { backgroundColor: '#6FA3EF' },
    timeText: { fontSize: 14 },
    nextButton: { backgroundColor: '#006D77', padding: 15, borderRadius: 10, marginTop: 20, width: '90%', alignItems: 'center' },
    nextText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

export default DoctorAppointment;
