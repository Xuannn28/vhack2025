import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AudioRecorder from './AudioRecorder';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

// Function to convert audio file to base64
const getAudioBase64 = async (uri) => {
  try {
    const base64Data = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64Data;
  } catch (error) {
    console.error('Error reading audio file:', error);
    throw new Error('Failed to read audio file');
  }
};

// Function to transcribe audio using Google Cloud Speech-to-Text API
const transcribeAudio = async (recordingInfo) => {
  try {
    const formData = new FormData();
    const fileName = recordingInfo.uri.split('/').pop();
    const fileType = fileName.split('.').pop();

    formData.append('audio', {
      uri: recordingInfo.uri,
      name: fileName,
      type: `audio/${fileType}`,
    });

    const response = await axios.post('http://10.167.62.210:3000/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const transcription = response.data.transcription;
    const wordCount = transcription.split(/\s+/).length;

    return {
      text: transcription,
      words: wordCount,
      duration: recordingInfo.duration,
    };
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio. Please try again.');
  }
};

const RecordScreen = () => {
  const navigation = useNavigation();
  const [recordingInfo, setRecordingInfo] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [doctor, setDoctor] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Format functions
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Handle recording completion
  const handleRecordingComplete = (info) => {
    if (!info || !info.uri) {
      Alert.alert('Error', 'Failed to save recording. Please try again.');
      return;
    }
    
    // Ensure we have a valid duration
    if (!info.duration || info.duration === '00:00') {
      console.warn('Recording duration is missing or zero, using fallback');
      info.duration = '00:01'; // Fallback duration
    }
    
    setRecordingInfo(info);
  };
  
  // Reset recording function - passed to AudioRecorder
  const resetRecording = () => {
    setRecordingInfo(null);
  };

  // Date and time change handlers
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setDate(newDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const handleSubmit = async () => {
    if (!recordingInfo || !recordingInfo.uri) {
      Alert.alert('Error', 'Please record an audio file first');
      return;
    }
    
    if (!doctor.trim()) {
      Alert.alert('Error', 'Please enter doctor\'s name');
      return;
    }
  
    if (!reason.trim()) {
      Alert.alert('Error', 'Please enter reason for visit');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Use the transcription service
      const transcription = await transcribeAudio(recordingInfo);
      const id = Date.now().toString();
      const formattedDate = formatDate(date);
      
      // Create the recording data
      const newRecording = {
        id,
        title: reason.trim(),
        doctor: doctor.trim(),
        date: formattedDate,
        fullDate: date.toISOString(),
        words: transcription.words || 0,
        duration: recordingInfo.duration || '00:01',
        durationInSeconds: recordingInfo.durationInSeconds || 1,
        transcriptionText: transcription.text || 'No transcription available',
        isRecorded: true,
        recordingUri: recordingInfo.uri
      };
      
      // Save the recording data
      const existingData = await AsyncStorage.getItem('recordings');
      let recordings = existingData ? JSON.parse(existingData) : [];
      recordings.unshift(newRecording);
      await AsyncStorage.setItem('recordings', JSON.stringify(recordings));
      
      // Navigate to Processing screen with the transcription data
      navigation.navigate('Processing', { 
        recordingId: id,
        transcriptionText: transcription.text
      });
      
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to process recording. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#3A1E70" />
          </TouchableOpacity>
          <Text style={styles.title}>Record Appointment</Text>
        </View>

        {/* Recording Interface */}
        <View style={styles.recordingSection}>
          <AudioRecorder 
            onRecordingComplete={handleRecordingComplete} 
            savedRecording={recordingInfo}
            onResetRecording={resetRecording}
          />
          {/* Removed duplicate recordingInfo display since it's handled by AudioRecorder */}
        </View>

        {/* Appointment Details Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Date of Checkup</Text>
            <TouchableOpacity 
              style={styles.dateInput} 
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(date)}</Text>
              <Ionicons name="calendar-outline" size={20} color="#3A1E70" />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Time of Checkup</Text>
            <TouchableOpacity 
              style={styles.dateInput} 
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.dateText}>{formatTime(date)}</Text>
              <Ionicons name="time-outline" size={20} color="#3A1E70" />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Doctor's Name</Text>
            <TextInput 
              style={styles.input} 
              value={doctor} 
              onChangeText={setDoctor}
              placeholder="Enter doctor's name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Reason for Visit</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={reason} 
              onChangeText={setReason}
              placeholder="Enter reason for visit"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            (!recordingInfo || isProcessing) && styles.disabledButton
          ]} 
          onPress={handleSubmit}
          disabled={!recordingInfo || isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={24} color="white" />
              <Text style={styles.submitButtonText}>Process Recording</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Date/Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      )}
      
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onTimeChange}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AFC2D5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3A1E70',
  },
  recordingSection: {
    backgroundColor: '#EFE9F7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  formSection: {
    backgroundColor: '#EFE9F7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A1E70',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A1E70',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#3A1E70',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  disabledButton: {
    backgroundColor: '#9E92B2',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default RecordScreen;