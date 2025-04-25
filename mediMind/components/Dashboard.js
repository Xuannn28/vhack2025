import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

const Dashboard = ({navigation}) => {
    return (
        <ScrollView style={styles.scrollView}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Hello, Alex</Text>

                        <View style={styles.rightButtons}>
                            <TouchableOpacity 
                                style={styles.iconButton}
                                onPress={() => navigation.navigate('Notifications')}
                                >
                                <Ionicons name="notifications" size={24} color="#333" />
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.profileButton}
                                onPress={() => navigation.navigate('Profile')}
                            >
                                <Image source={require('../assets/profile.jpg')} style={styles.profileImage} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    {/* Health Today Card - Modified to be clickable */}
                    <TouchableOpacity 
                        style={styles.healthCard}
                        onPress={() => navigation.navigate('HealthDetails', { userId: 'Alex' })}
                        activeOpacity={0.8}
                    >
                        <View style={styles.healthCardHeader}>
                            <Ionicons name="medical" size={24} color="#2c3e50" />
                            <Text style={styles.healthCardTitle}>Your Health Today</Text>
                            <Ionicons name="chevron-forward" size={20} color="#95a5a6" style={styles.arrowIcon} />
                        </View>
                        
                        <View style={styles.healthInfoContainer}>
                            <View style={styles.healthInfoItem}>                           
                                <Text style={styles.healthInfoText}>🩸 Blood Sugar: 6.2 mmol/L</Text>
                            </View>
                            <View style={styles.healthInfoItem}>                              
                                <Text style={styles.healthInfoText}>💊 Next Med: 5:00 PM—Metformin</Text>
                            </View>
                            <View style={styles.healthInfoItem}>                               
                                <Text style={styles.healthInfoText}>🗓️ Appointment: Tomorrow at 10:30 AM</Text>
                            </View>
                            <View style={styles.healthInfoItem}>                               
                                <Text style={styles.healthInfoText}>📌 Tip: You're doing great! Stay hydrated.</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    
                    {/* Quick Action Buttons - First Row */}
                    <View style={styles.actionButtonsRow}>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('HomeScreen')}
                        >
                            <FontAwesome5 name="file-invoice" size={24} color="#2c3e50" style={styles.actionIcon} />
                            <Text style={styles.actionText}>Transcriptions</Text>
                        </TouchableOpacity>
                    
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('HealthRewards')}
                        >
                            <FontAwesome5 name="chart-line" size={24} color="#2c3e50" style={styles.actionIcon} />
                            <Text style={styles.actionText}>Challenges</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Quick Action Buttons - Second Row */}
                    <View style={styles.actionButtonsRow}>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('DoctorsSelection')}
                        >
                            <FontAwesome5 name="calendar-alt" size={24} color="#2c3e50" style={styles.actionIcon} />
                            <Text style={styles.actionText}>Appointment</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Contact')}
                        >
                            <FontAwesome5 name="brain" size={24} color="#2c3e50" style={styles.actionIcon} />
                            <Text style={styles.actionText}>Mental Health</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Chatbot Card */}
                    <TouchableOpacity 
                        style={styles.chatbotCard}
                        onPress={() => navigation.navigate('Chatbot')}
                    >
                        <FontAwesome5 name="brain" size={28} color="#2c3e50" />
                        <View style={styles.chatbotTextContainer}>
                            <Text style={styles.chatbotTitle}>Not feeling well today?</Text>
                            <Text style={styles.chatbotDescription}>Tap here to chat with MediMind Assistant.</Text>
                        </View>
                    </TouchableOpacity>
                    
                    {/* Navigation Footer */}
                    <View style={styles.navFooter}>
                        <TouchableOpacity style={styles.navButton}>
                            <FontAwesome5 name="home" size={24} color="#2c3e50" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButton}
                            onPress={() => navigation.navigate('HealthDetails')}>
                            <FontAwesome5 name="list" size={24} color="#7c8c9a" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButton}>
                            <FontAwesome5 name="envelope" size={24} color="#7c8c9a" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButton}>
                            <FontAwesome5 name="user" size={24} color="#7c8c9a" />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#e6f0f3',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#e6f0f3',
    },
    container: {
        flex: 1, 
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    profileButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    rightButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton:{
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: '#fff',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    healthCard: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: 20,
    },
    healthCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    healthCardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginLeft: 10,
        flex: 1,
    },
    arrowIcon: {
        marginLeft: 'auto',
    },
    healthInfoContainer: {
        marginLeft: 5,
    },
    healthInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    bulletPoint: {
        fontSize: 24,
        color: '#2c3e50',
        marginRight: 10,
    },
    healthInfoText: {
        fontSize: 16,
        color: '#2c3e50',
    },
    actionButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    actionButton: {
        backgroundColor: '#FFFFFF',
        width: '48%',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    actionIcon: {
        marginBottom: 12,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2c3e50',
    },
    chatbotCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d6e6f0',
        padding: 20,
        borderRadius: 15,
        marginVertical: 15,
    },
    chatbotTextContainer: {
        marginLeft: 15,
    },
    chatbotTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    chatbotDescription: {
        fontSize: 14,
        color: '#2c3e50',
    },
    navFooter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    navButton: {
        padding: 10,
    },
});