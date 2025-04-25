import React, { useState, useEffect } from 'react';
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
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { Audio } from 'expo-av';

const BASE_URL = 'http://172.20.10.2:3000';
const PING_URL = `${BASE_URL}/ping`;
const TRANSCRIBE_URL = `${BASE_URL}/transcribe`;
const UPLOAD_CHUNK_URL = `${BASE_URL}/upload-chunk`;
const TRANSCRIBE_SESSION_URL = `${BASE_URL}/transcribe-session`;

const UploadScreen = () => {
  const navigation = useNavigation();
  const [fileInfo, setFileInfo] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [doctor, setDoctor] = useState('');
  const [reason, setReason] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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

  // Document picker function
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*'],
        copyToCacheDirectory: true
      });
      
      if (result.canceled === false) {
        const file = result.assets[0];
        setFileInfo({
          name: file.name,
          uri: file.uri,
          size: file.size,
          mimeType: file.mimeType,
          isRecorded: false
        });
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
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

  // Function to convert audio file to base64
  const getAudioBase64 = async (uri) => {
    try {
      console.log('Reading audio file:', uri);
      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('Successfully converted audio to base64');
      return base64Data;
    } catch (error) {
      console.error('Error reading audio file:', error);
      throw new Error('Failed to read audio file: ' + error.message);
    }
  };

  const transcribeAudio = async (fileInfo) => {
    try {
      console.log('Starting transcription for file:', fileInfo.name);
      console.log('File type:', fileInfo.mimeType);
  
      // Convert the audio file to base64
      const audioBase64 = await getAudioBase64(fileInfo.uri);
      console.log('Audio base64 length:', audioBase64.length);
  
      // Determine audio encoding based on file type
      let encoding = 'LINEAR16';
      let sampleRateHertz = 16000;
  
      // Check file extension first
      const fileExtension = fileInfo.name.split('.').pop().toLowerCase();
      if (fileExtension === 'mp3' || fileInfo.mimeType.includes('mp3')) {
        console.log('Detected MP3 format');
        encoding = 'MP3';
        sampleRateHertz = 44100; // Standard MP3 sample rate
      } else if (fileExtension === 'wav' || fileInfo.mimeType.includes('wav')) {
        console.log('Detected WAV format');
        encoding = 'LINEAR16';
        sampleRateHertz = 16000;
      } else if (fileExtension === 'm4a' || fileInfo.mimeType.includes('m4a') ||
                 fileExtension === 'aac' || fileInfo.mimeType.includes('aac')) {
        console.log('Detected M4A/AAC format');
        encoding = 'AMR';
        sampleRateHertz = 16000;
      }
  
      console.log('Using encoding:', encoding, 'with sample rate:', sampleRateHertz);
  
      // Add validation to ensure we have a non-empty base64 string
      if (!audioBase64 || audioBase64.length === 0) {
        throw new Error('Failed to read audio file: Empty base64 data');
      }
  
      // Basic validation for base64 format
      if (!/^[A-Za-z0-9+/=]+$/.test(audioBase64)) {
        console.warn('Base64 string contains invalid characters');
      }
  
      console.log('Base64 sample (first 50 chars):', audioBase64.substring(0, 50));
      
      // Try an alternative approach by sending a smaller request first
      // to verify server connectivity
      try {
        console.log('Sending ping to verify server connectivity...');
        const pingResponse = await axios.post(PING_URL, {
          message: 'Checking connection'
        }, {
          timeout: 5000
        });
        console.log('Server ping response:', pingResponse.data);
      } catch (pingError) {
        console.error('Server ping failed:', pingError.message);
        // Continue anyway, the ping endpoint might not exist
      }
      
      // Prepare the request body for Google Cloud Speech-to-Text API
      const requestBody = {
        audio: {
          content: audioBase64
        },
        config: {
          encoding: encoding,
          sampleRateHertz: sampleRateHertz,
          languageCode: 'en-US',
          enableAutomaticPunctuation: true,
          model: 'default'
        }
      };
  
      console.log('Sending request to transcription server...');
      console.log('Request config:', JSON.stringify(requestBody.config));
      
      // Using a more reliable approach with better error handling
      try {
        console.log('Attempting transcription with direct request...');
        const response = await axios.post(TRANSCRIBE_URL, requestBody, {
          headers: {
            'Content-Type': 'application/json'
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          timeout: 300000 // 5 minute timeout
        });
        
        console.log('Received response from server:', response.data);
        
        // Get audio duration
        const audioObject = new Audio.Sound();
        await audioObject.loadAsync({ uri: fileInfo.uri });
        const status = await audioObject.getStatusAsync();
        const durationInSeconds = status.durationMillis / 1000;
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
        // Process the transcription response
        const transcription = response.data.transcription;
        const wordCount = transcription.split(/\s+/).length;
  
        return {
          text: transcription,
          words: wordCount,
          duration: formattedDuration
        };
        
      } catch (directError) {
        console.error('Direct transcription request failed:', directError.message);
        console.error('Response data:', directError.response?.data);
        console.error('Response status:', directError.response?.status);
        
        // Try alternative approach with a chunked upload
        console.log('Attempting transcription with chunked upload...');
        
        // Create a session ID for this upload
        const sessionId = Date.now().toString();
        console.log('Created session ID:', sessionId);
        
        // Send the audio in chunks to avoid request size limitations
        const chunkSize = 500000; // ~500KB chunks
        const chunks = Math.ceil(audioBase64.length / chunkSize);
        console.log(`Splitting audio into ${chunks} chunks`);
        
        // Send each chunk to the server
        for (let i = 0; i < chunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, audioBase64.length);
          const chunk = audioBase64.substring(start, end);
          
          console.log(`Sending chunk ${i+1}/${chunks} (${chunk.length} bytes)`);
          
          const chunkResponse = await axios.post(UPLOAD_CHUNK_URL, {
            sessionId,
            chunkIndex: i,
            totalChunks: chunks,
            chunk
          }, {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 60000 // 1 minute timeout per chunk
          });
          
          console.log(`Chunk ${i+1} upload response:`, chunkResponse.data);
        }
        
        // Now that all chunks are uploaded, request transcription
        console.log('All chunks uploaded, requesting transcription...');
        const transcribeResponse = await axios.post(TRANSCRIBE_SESSION_URL, {
          sessionId,
          config: {
            encoding,
            sampleRateHertz,
            languageCode: 'en-US',
            enableAutomaticPunctuation: true,
            model: 'default'
          }
        }, {
          timeout: 300000 // 5 minute timeout
        });
        
        console.log('Chunked transcription response:', transcribeResponse.data);
        
        // Get audio duration
        const audioObject = new Audio.Sound();
        await audioObject.loadAsync({ uri: fileInfo.uri });
        const status = await audioObject.getStatusAsync();
        const durationInSeconds = status.durationMillis / 1000;
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
        // Process the transcription response
        const transcription = transcribeResponse.data.transcription;
        const wordCount = transcription.split(/\s+/).length;
  
        return {
          text: transcription,
          words: wordCount,
          duration: formattedDuration
        };
      }
    } catch (error) {
      console.error('Transcription error details:', error.response?.data || error.message);
      throw new Error('Failed to transcribe audio: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUpload = async () => {
    if (!fileInfo) {
      Alert.alert('Error', 'Please select an audio file first');
      return;
    }
    
    if (!doctor.trim()) {
      Alert.alert('Error', 'Please enter the doctor\'s name');
      return;
    }
  
    if (!reason.trim()) {
      Alert.alert('Error', 'Please enter the reason for visit');
      return;
    }

    setIsUploading(true);

    try {
      // Use real transcription service
      const transcriptionResult = await transcribeAudio(fileInfo);

      // Create the recording data
      const newRecording = {
        id: Date.now().toString(),
        title: reason.trim(),
        doctor: doctor.trim(),
        date: formatDate(date),
        fullDate: date.toISOString(),
        words: transcriptionResult.words,
        duration: transcriptionResult.duration,
        transcriptionText: transcriptionResult.text,
        isRecorded: false,
        audioFile: {
          name: fileInfo.name,
          uri: fileInfo.uri,
          type: fileInfo.mimeType,
        }
      };

      // Save to AsyncStorage
      const existingData = await AsyncStorage.getItem('recordings');
      let recordings = existingData ? JSON.parse(existingData) : [];
      recordings.unshift(newRecording);
      await AsyncStorage.setItem('recordings', JSON.stringify(recordings));
      
      // Navigate to Processing screen
      navigation.navigate('Processing', { 
        recordingId: newRecording.id,
        transcriptionText: transcriptionResult.text
      });
      
    } catch (error) {
      console.error('Processing error:', error);
      Alert.alert('Error', 'Failed to process recording. Please try again.');
    } finally {
      setIsUploading(false);
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
          <Text style={styles.title}>Upload Recording</Text>
        </View>
        
        {/* Upload Interface */}
        <TouchableOpacity 
          style={styles.uploadBox} 
          onPress={pickDocument}
          disabled={isUploading}
        >
          <Ionicons name="cloud-upload-outline" size={40} color="#3A1E70" />
          <Text style={styles.uploadText}>
            {fileInfo ? `Selected: ${fileInfo.name}` : 'Tap to Upload Voice Recording'}
          </Text>
          {fileInfo && (
            <Text style={styles.fileDetails}>
              {(fileInfo.size / 1024 / 1024).toFixed(2)} MB
            </Text>
          )}
        </TouchableOpacity>

        {/* Appointment Details Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
      
          <View style={styles.formGroup}>
      <Text style={styles.label}>Date of Checkup</Text>
      <TouchableOpacity 
        style={styles.dateInput} 
        onPress={() => setShowDatePicker(true)}
              disabled={isUploading}
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
              disabled={isUploading}
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
              editable={!isUploading}
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
              editable={!isUploading}
      />
          </View>
        </View>
      
        {/* Submit Button */}
      <TouchableOpacity 
          style={[styles.submitButton, isUploading && styles.disabledButton]} 
          onPress={handleUpload}
          disabled={!fileInfo || !doctor.trim() || !reason.trim() || isUploading}
      >
        {isUploading ? (
          <ActivityIndicator color="white" />
        ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={24} color="white" />
              <Text style={styles.submitButtonText}>Process Recording</Text>
            </>
        )}
      </TouchableOpacity>
      
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
    </ScrollView>
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
  uploadBox: { 
    backgroundColor: '#EFE9F7', 
    padding: 24,
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 24,
  },
  uploadText: { 
    fontSize: 16, 
    fontWeight: '600',
    color: '#3A1E70', 
    marginTop: 12,
    textAlign: 'center',
  },
  fileDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
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

export default UploadScreen;