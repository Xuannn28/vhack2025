// PatientDetails.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';

const PatientDetails = ({ route, navigation }) => {
    const { date, time } = route.params;
    const [fullName, setFullName] = useState('');
    const [icPassport, setIcPassport] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState(null);
    const [problem, setProblem] = useState('');

    const handleSetAppointment = () => {
        if (!fullName || !icPassport || !age || !gender || !problem) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Please fill in all details before setting an appointment.',
                position: 'bottom',  
                bottomOffset: 40,   
            });
            return;
        }
    
        Toast.show({
            type: 'success',
            text1: 'Appointment Set',
            text2: `Your appointment on ${date} at ${time} is confirmed.`,
            position: 'bottom',  
            bottomOffset: 40,    
        });
    
        setTimeout(() => {
            navigation.navigate('Dashboard');
        }, 2000);
    };    

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.header}>Patient Details</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter full name"
                        placeholderTextColor="#000"
                        value={fullName}
                        onChangeText={setFullName}
                    />

                    <Text style={styles.label}>IC/Passport</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter IC/Passport"
                        placeholderTextColor="#000"
                        value={icPassport}
                        onChangeText={setIcPassport}
                    />

                    <Text style={styles.label}>Age</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter age"
                        placeholderTextColor="#000"
                        keyboardType="numeric"
                        value={age}
                        onChangeText={setAge}
                    />

                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.genderContainer}>
                        <TouchableOpacity
                            style={[styles.genderButton, gender === 'Male' && styles.selectedGender]}
                            onPress={() => setGender('Male')}
                        >
                            <Text style={[styles.genderText, gender === 'Male' && styles.selectedGenderText]}>Male</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.genderButton, gender === 'Female' && styles.selectedGender]}
                            onPress={() => setGender('Female')}
                        >
                            <Text style={[styles.genderText, gender === 'Female' && styles.selectedGenderText]}>Female</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Write Your Problem</Text>
                    <TextInput
                        style={[styles.input, styles.problemInput]}
                        placeholder="Describe your problem"
                        placeholderTextColor="#000"
                        multiline
                        value={problem}
                        onChangeText={setProblem}
                    />

                    <TouchableOpacity style={styles.submitButton} onPress={handleSetAppointment}>
                        <Text style={styles.submitText}>Set Appointment</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1 },
    container: { flex: 1, padding: 20, backgroundColor: '#A4C1C9' },
    formContainer: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '100%' },
    header: { fontSize: 22, fontWeight: 'bold', color: 'black', marginBottom: 20 },
    label: { fontSize: 16, fontWeight: 'bold', color: 'black', marginTop: 10 },
    input: { backgroundColor: '#E0E0E0', padding: 12, borderRadius: 8, marginTop: 5, color: 'black' },
    genderContainer: { flexDirection: 'row', marginTop: 5 },
    genderButton: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#E0E0E0', marginHorizontal: 5, alignItems: 'center' },
    selectedGender: { backgroundColor: '#4C8BF5' },
    selectedGenderText: { color: 'white' },
    genderText: { fontSize: 16, color: 'black' },
    problemInput: { height: 100, textAlignVertical: 'top' },
    submitButton: { backgroundColor: '#006D77', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center' },
    submitText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

export default PatientDetails;