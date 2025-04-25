import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  Alert,
  Switch,
  Linking
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data for profile
const mockProfileData = {
  fullName: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  phoneNumber: '+60 12 345 6789',
  age: '32',
  gender: 'Female',
  address: '123 Jalan Ampang, Kuala Lumpur',
  country: 'Malaysia',
  height: '165',
  weight: '58',
  bloodType: 'O+',
  allergies: 'Penicillin, Peanuts',
  medicalConditions: 'Asthma, Seasonal allergies',
  profileImage: null
};

// Mock emergency contacts
const mockEmergencyContacts = [
  { 
    id: 1, 
    name: 'Michael Johnson', 
    relationship: 'Husband', 
    phoneNumber: '+60 13 456 7890' 
  },
  { 
    id: 2, 
    name: 'Emma Wong', 
    relationship: 'Sister', 
    phoneNumber: '+60 14 567 8901' 
  }
];

const ProfileScreen = ({ navigation }) => {
  // User profile state with mock data
  const [userProfile, setUserProfile] = useState(mockProfileData);

  // Emergency contact state with mock data
  const [emergencyContacts, setEmergencyContacts] = useState(mockEmergencyContacts);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [isWearableConnected, setIsWearableConnected] = useState(true);
  
  // Wearable device mock data
  const [wearableData, setWearableData] = useState({
    deviceName: 'MediTrack Pro 3',
    model: 'MT-300',
    lastSynced: '2 hours ago',
    batteryLevel: '78%',
    heartRate: '72 bpm',
    bloodPressure: '120/80 mmHg',
    oxygenLevel: '98%',
    sleepHours: '7.5h',
    steps: '8,432'
  });

  // Load user profile data
  useEffect(() => {
    // In a real app, we would load from AsyncStorage here
    // For demo purposes, we're using the mock data directly
    console.log('Loading profile with mock data');
  }, []);

  // Save user profile data to AsyncStorage
  const saveUserProfile = async () => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
      await AsyncStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
      Alert.alert('Success', 'Profile information saved successfully');
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile information');
    }
  };

  // Update user profile field
  const handleProfileChange = (field, value) => {
    setUserProfile({
      ...userProfile,
      [field]: value
    });
  };

  // Add new emergency contact
  const addEmergencyContact = () => {
    const newContact = {
      id: emergencyContacts.length + 1,
      name: '',
      relationship: '',
      phoneNumber: ''
    };
    setEmergencyContacts([...emergencyContacts, newContact]);
  };

  // Remove emergency contact
  const removeEmergencyContact = (id) => {
    if (emergencyContacts.length > 1) {
      setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
    } else {
      Alert.alert('Cannot Remove', 'You need to have at least one emergency contact');
    }
  };

  // Update emergency contact
  const updateEmergencyContact = (id, field, value) => {
    setEmergencyContacts(
      emergencyContacts.map(contact => 
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    );
  };

  // Handle wearable device connection
  const handleWearableDevice = () => {
    navigation.navigate('Wearable Device');
  };
  
  // Connect or disconnect wearable device
  const toggleWearableConnection = () => {
    setIsWearableConnected(!isWearableConnected);
    Alert.alert(
      isWearableConnected ? 'Device Disconnected' : 'Device Connected',
      isWearableConnected ? 'Your wearable device has been disconnected.' : 'Your wearable device has been connected successfully.'
    );
  };
  
  // Call emergency contact
  const callEmergencyContact = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.navigate('Dashboard')}
          >
            <FontAwesome5 name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => isEditMode ? saveUserProfile() : setIsEditMode(true)}
          >
            <Text style={styles.editButtonText}>{isEditMode ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Information Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={userProfile.profileImage || require('../assets/profile.jpg')} 
              style={styles.avatar} 
            />
            {isEditMode && (
              <TouchableOpacity style={styles.changeAvatarButton}>
                <FontAwesome5 name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.userName}>{userProfile.fullName || 'Add Your Name'}</Text>
          
          <View style={styles.profileForm}>
            {/* Personal Information */}
            <Text style={styles.formSectionTitle}>Personal Information</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput 
                style={[styles.input, !isEditMode && styles.disabledInput]} 
                value={userProfile.fullName}
                onChangeText={(text) => handleProfileChange('fullName', text)}
                editable={isEditMode}
                placeholder="Enter your full name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput 
                style={[styles.input, !isEditMode && styles.disabledInput]} 
                value={userProfile.email}
                onChangeText={(text) => handleProfileChange('email', text)}
                editable={isEditMode}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={[styles.input, !isEditMode && styles.disabledInput]} 
                value={userProfile.phoneNumber}
                onChangeText={(text) => handleProfileChange('phoneNumber', text)}
                editable={isEditMode}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.rowContainer}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Age</Text>
                <TextInput 
                  style={[styles.input, !isEditMode && styles.disabledInput]} 
                  value={userProfile.age.toString()}
                  onChangeText={(text) => handleProfileChange('age', text)}
                  editable={isEditMode}
                  placeholder="Age"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Gender</Text>
                <TextInput 
                  style={[styles.input, !isEditMode && styles.disabledInput]} 
                  value={userProfile.gender}
                  onChangeText={(text) => handleProfileChange('gender', text)}
                  editable={isEditMode}
                  placeholder="Gender"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput 
                style={[styles.input, !isEditMode && styles.disabledInput, { height: 60 }]} 
                value={userProfile.address}
                onChangeText={(text) => handleProfileChange('address', text)}
                editable={isEditMode}
                placeholder="Enter your address"
                multiline={true}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Country</Text>
              <TextInput 
                style={[styles.input, !isEditMode && styles.disabledInput]} 
                value={userProfile.country}
                onChangeText={(text) => handleProfileChange('country', text)}
                editable={isEditMode}
                placeholder="Enter your country"
              />
            </View>
            
            {/* Medical Information */}
            <Text style={[styles.formSectionTitle, { marginTop: 16 }]}>Medical Information</Text>
            
            <View style={styles.rowContainer}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput 
                  style={[styles.input, !isEditMode && styles.disabledInput]} 
                  value={userProfile.height.toString()}
                  onChangeText={(text) => handleProfileChange('height', text)}
                  editable={isEditMode}
                  placeholder="Height"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput 
                  style={[styles.input, !isEditMode && styles.disabledInput]} 
                  value={userProfile.weight.toString()}
                  onChangeText={(text) => handleProfileChange('weight', text)}
                  editable={isEditMode}
                  placeholder="Weight"
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Blood Type</Text>
              <TextInput 
                style={[styles.input, !isEditMode && styles.disabledInput]} 
                value={userProfile.bloodType}
                onChangeText={(text) => handleProfileChange('bloodType', text)}
                editable={isEditMode}
                placeholder="Enter your blood type"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Allergies</Text>
              <TextInput 
                style={[styles.input, !isEditMode && styles.disabledInput, { height: 60 }]} 
                value={userProfile.allergies}
                onChangeText={(text) => handleProfileChange('allergies', text)}
                editable={isEditMode}
                placeholder="List any allergies"
                multiline={true}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Medical Conditions</Text>
              <TextInput 
                style={[styles.input, !isEditMode && styles.disabledInput, { height: 80 }]} 
                value={userProfile.medicalConditions}
                onChangeText={(text) => handleProfileChange('medicalConditions', text)}
                editable={isEditMode}
                placeholder="List any medical conditions"
                multiline={true}
              />
            </View>
          </View>
        </View>

        {/* Wearable Device Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Wearable Device</Text>
            <Switch
              value={isWearableConnected}
              onValueChange={toggleWearableConnection}
              trackColor={{ false: '#ccc', true: '#A4C1C9' }}
              thumbColor={isWearableConnected ? '#002147' : '#f4f3f4'}
            />
          </View>
          
          {isWearableConnected ? (
            <View>
              <View style={styles.deviceInfoContainer}>
                <View style={styles.deviceIconContainer}>
                  <FontAwesome5 name="watch" size={40} color="#002147" />
                </View>
                <View style={styles.deviceDetails}>
                  <Text style={styles.deviceName}>{wearableData.deviceName}</Text>
                  <Text style={styles.deviceModel}>Model: {wearableData.model}</Text>
                  <Text style={styles.deviceSynced}>Last synced: {wearableData.lastSynced}</Text>
                  <Text style={styles.deviceBattery}>Battery: {wearableData.batteryLevel}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <Text style={styles.healthDataTitle}>Latest Health Data</Text>
              
              <View style={styles.healthDataGrid}>
                <View style={styles.healthDataItem}>
                  <FontAwesome5 name="heartbeat" size={20} color="#d9534f" solid />
                  <Text style={styles.healthDataValue}>{wearableData.heartRate}</Text>
                  <Text style={styles.healthDataLabel}>Heart Rate</Text>
                </View>
                
                <View style={styles.healthDataItem}>
                  <FontAwesome5 name="tint" size={20} color="#5bc0de" solid />
                  <Text style={styles.healthDataValue}>{wearableData.bloodPressure}</Text>
                  <Text style={styles.healthDataLabel}>Blood Pressure</Text>
                </View>
                
                <View style={styles.healthDataItem}>
                  <FontAwesome5 name="lungs" size={20} color="#5cb85c" solid />
                  <Text style={styles.healthDataValue}>{wearableData.oxygenLevel}</Text>
                  <Text style={styles.healthDataLabel}>Oxygen Level</Text>
                </View>
                
                <View style={styles.healthDataItem}>
                  <FontAwesome5 name="moon" size={20} color="#f0ad4e" solid />
                  <Text style={styles.healthDataValue}>{wearableData.sleepHours}</Text>
                  <Text style={styles.healthDataLabel}>Sleep</Text>
                </View>
                
                <View style={styles.healthDataItem}>
                  <FontAwesome5 name="walking" size={20} color="#0275d8" solid />
                  <Text style={styles.healthDataValue}>{wearableData.steps}</Text>
                  <Text style={styles.healthDataLabel}>Steps</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.viewMoreButton} onPress={() => navigation.navigate('HealthDetails')}>
                <Text style={styles.viewMoreButtonText}>View Detailed Health Data</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.connectDeviceContainer}>
              <Text style={styles.connectDeviceText}>
                Connect your wearable device to monitor your health data in real-time.
              </Text>
              <TouchableOpacity style={styles.connectButton} onPress={handleWearableDevice}>
                <Text style={styles.connectButtonText}>Connect Device</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Emergency Contacts Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            {isEditMode && (
              <TouchableOpacity 
                style={styles.addContactButton}
                onPress={addEmergencyContact}
              >
                <FontAwesome5 name="plus" size={14} color="#fff" />
                <Text style={styles.addContactButtonText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.emergencyInfo}>
            These contacts will be notified in case of emergency and can access your medical information.
          </Text>
          
          {emergencyContacts.map((contact, index) => (
            <View key={contact.id} style={[styles.contactCard, index !== emergencyContacts.length - 1 && styles.contactCardBorder]}>
              <View style={styles.contactInfo}>
                <View style={styles.contactHeader}>
                  <Text style={styles.contactName}>{contact.name || 'Contact Name'}</Text>
                  {isEditMode && (
                    <TouchableOpacity 
                      style={styles.removeContactButton}
                      onPress={() => removeEmergencyContact(contact.id)}
                    >
                      <FontAwesome5 name="times" size={14} color="#d9534f" />
                    </TouchableOpacity>
                  )}
                </View>
                
                <View style={styles.contactField}>
                  <Text style={styles.contactLabel}>Relationship:</Text>
                  <TextInput 
                    style={[styles.contactInput, !isEditMode && styles.disabledInput]} 
                    value={contact.relationship}
                    onChangeText={(text) => updateEmergencyContact(contact.id, 'relationship', text)}
                    editable={isEditMode}
                    placeholder="Relationship"
                  />
                </View>
                
                <View style={styles.contactField}>
                  <Text style={styles.contactLabel}>Phone Number:</Text>
                  <View style={styles.phoneContainer}>
                    <TextInput 
                      style={[styles.contactInput, !isEditMode && styles.disabledInput, { flex: 1 }]} 
                      value={contact.phoneNumber}
                      onChangeText={(text) => updateEmergencyContact(contact.id, 'phoneNumber', text)}
                      editable={isEditMode}
                      placeholder="Phone Number"
                      keyboardType="phone-pad"
                    />
                    
                    {!isEditMode && (
                      <TouchableOpacity 
                        style={styles.callButton}
                        onPress={() => callEmergencyContact(contact.phoneNumber)}
                      >
                        <FontAwesome5 name="phone" size={14} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={() => navigation.navigate('Contact')}
          >
            <Text style={styles.emergencyButtonText}>Emergency Support Contacts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#002147',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    backgroundColor: '#A4C1C9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#002147',
    fontWeight: 'bold',
  },
  profileSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#002147',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#002147',
  },
  profileForm: {
    width: '100%',
  },
  formSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#002147',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#777',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002147',
  },
  // Wearable device styles
  deviceInfoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  deviceIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#e6f0f3',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  deviceDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002147',
    marginBottom: 4,
  },
  deviceModel: {
    fontSize: 14,
    marginBottom: 2,
    color: '#555',
  },
  deviceSynced: {
    fontSize: 14,
    marginBottom: 2,
    color: '#555',
  },
  deviceBattery: {
    fontSize: 14,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
  healthDataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#002147',
  },
  healthDataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  healthDataItem: {
    width: '31%',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  healthDataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#002147',
  },
  healthDataLabel: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
  viewMoreButton: {
    backgroundColor: '#002147',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  viewMoreButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  connectDeviceContainer: {
    alignItems: 'center',
    padding: 16,
  },
  connectDeviceText: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 16,
  },
  connectButton: {
    backgroundColor: '#002147',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  connectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Emergency contacts styles
  emergencyInfo: {
    color: '#555',
    marginBottom: 16,
  },
  addContactButton: {
    backgroundColor: '#002147',
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  addContactButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  contactCard: {
    marginBottom: 16,
  },
  contactCardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  contactInfo: {
    flexDirection: 'column',
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002147',
  },
  removeContactButton: {
    padding: 4,
  },
  contactField: {
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  contactInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: '#5bc0de',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emergencyButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 