import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { assets } from '../assets/assets';
import i18n from '../translations/translations_language'; // Import the i18n instance
import Constants from 'expo-constants';

const WearableDevice = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const BACKEND_URL = Constants.expoConfig.extra.BACKEND_URL;
  const BACKEND_URL_MOCK = `${BACKEND_URL}/mock-device-data`;

  // Update language whenever the user changes the language
  useEffect(() => {
    // Example: update i18n locale based on user's selected language (replace this logic with your language preference)
    const selectedLanguage = 'english'; // Replace with your language preference logic
    i18n.locale = selectedLanguage;
    console.log("Raw BACKEND_URL:", Constants.expoConfig.extra.BACKEND_URL);
    console.log("Calling:", BACKEND_URL_MOCK);
  }, []);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const response = await fetch(BACKEND_URL_MOCK);
      const contentType = response.headers.get("content-type");
  
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Wearable data:", data);
  
        if (Array.isArray(data) && data.length > 0) {
          navigation.navigate('Wearable Patient Details', { patient: data[0] });
        } else {
          Alert.alert("No data", "No wearable data found.");
        }
      } else {
        const text = await response.text();
        console.warn("Expected JSON, got:", text);
        Alert.alert("Error", "Unexpected response from server:\n" + text);
      }
    } catch (err) {
      console.error('Connection failed:', err);
      Alert.alert('Error', 'Failed to connect to device data.');
    } finally {
      setLoading(false);
    }
  };  

  return (
    <View style={{ flex: 1, backgroundColor: "#A4C1C9", padding: 20, justifyContent: 'center', alignItems: 'center' }}>
      {/* title */}
      <Text style={{ fontSize: 30, color: "#002147",  }}>
          {i18n.t('connect_your')}{' \n'}
          <Text style={{ fontWeight: 'bold' }}>{i18n.t('wearable_device')}</Text>
      </Text>

      <Text style={{ color: "#002147", textAlign: 'center', marginTop: 20, padding: 20 }}>
        {i18n.t('connect_device_description')}
      </Text>

      <Image style={{ width: 200, height: 200, marginTop: 50, marginBottom: 50 }} source={assets.wearable_device} />

      <View style={{ width: '100%', alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            width: '100%',
            backgroundColor: "#002147",
            padding: 10,
            borderRadius: 30,
            marginTop: 10,
            alignItems: 'center'
          }}
          onPress={handleConnect}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: 'bold' }}>{i18n.t('connect_device')}</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={{ width: '100%', alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            width: '100%',
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 30,
            marginTop: 10,
            alignItems: 'center'
          }}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={{ color: "#002147", fontWeight: 'bold' }}>{i18n.t('skip_for_now')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WearableDevice;
