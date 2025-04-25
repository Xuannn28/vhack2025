import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const doctors = [
    { id: '1', name: 'Dr. Sarah Lim', specialization: 'Psychiatrist', contact: '03 1234 5678', rating: 4.8, image: require('../assets/doctor1.jpg'), description: "Dr. Sarah Lim is a board-certified psychiatrist with over 10 years of experience in treating mental health disorders." },
    { id: '2', name: 'Dr. James Tan', specialization: 'Clinical Psychologist', contact: '03 8765 4321', rating: 4.5, image: require('../assets/doctor2.jpg'), description: "Dr. James Tan is a clinical psychologist who has helped patients with anxiety and depression." },
    { id: '3', name: 'Dr. Emily Wong', specialization: 'Counseling Psychologist', contact: '03 9988 7766', rating: 4.6, image: require('../assets/doctor3.jpg'), description: "Dr. Emily Wong specializes in counseling psychology, helping individuals and families navigate life challenges." },
    { id: '4', name: 'Dr. Michael Lee', specialization: 'Child Psychologist', contact: '03 5566 7788', rating: 4.7, image: require('../assets/doctor4.jpg'), description: "Dr. Michael Lee is a child psychologist with expertise in developmental disorders and behavioral therapy." },
    { id: '5', name: 'Dr. Amanda Chia', specialization: 'Neuropsychologist', contact: '03 6677 8899', rating: 4.9, image: require('../assets/doctor5.jpg'), description: "Dr. Amanda Chia is a neuropsychologist specializing in brain-behavior relationships." },
    { id: '6', name: 'Dr. Kevin Ong', specialization: 'Behavioral Therapist', contact: '03 4455 6677', rating: 4.4, image: require('../assets/doctor6.jpg'), description: "Dr. Kevin Ong is a behavioral therapist with a focus on helping patients develop healthy habits and coping mechanisms." },
    { id: '7', name: 'Dr. Rachel Tan', specialization: 'Addiction Specialist', contact: '03 3344 5566', rating: 4.7, image: require('../assets/doctor7.jpg'), description: "Dr. Rachel Tan specializes in addiction recovery and rehabilitation." },
    { id: '8', name: 'Dr. Victor Lim', specialization: 'Trauma Counselor', contact: '03 2233 4455', rating: 4.6, image: require('../assets/doctor8.jpg'), description: "Dr. Victor Lim is a trauma counselor with expertise in post-traumatic stress disorder (PTSD) and crisis intervention." },
];

const DoctorSelection = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState(doctors);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredDoctors(doctors);
        } else {
            const filtered = doctors.filter((doctor) =>
                doctor.name.toLowerCase().includes(query.toLowerCase()) ||
                doctor.specialization.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredDoctors(filtered);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>👨‍⚕️ Select a Doctor</Text>
            
            {/* Search Bar */}
            <TextInput
                style={styles.searchBar}
                placeholder="Search by name or specialization..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={handleSearch}
            />

            {/* Doctor List */}
            <FlatList
                data={filteredDoctors}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('DoctorDetail', { doctor: item })}
                    >
                        <Image source={item.image} style={styles.doctorImage} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.specialization}>{item.specialization}</Text>
                            <Text style={styles.rating}>⭐ {item.rating}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e6f0f3', padding: 20 },
    header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    
    searchBar: {
        height: 40,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },

    card: { flexDirection: 'row', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
    doctorImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: 'bold' },
    specialization: { fontSize: 14, color: 'gray' },
    rating: { fontSize: 14, color: '#FFD700', marginTop: 5 },
});

export default DoctorSelection;
