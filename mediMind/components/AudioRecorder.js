import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const AudioRecorder = ({ onRecordingComplete, savedRecording, onResetRecording }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [timer, setTimer] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [metering, setMetering] = useState(-160);
  const [meterHistory, setMeterHistory] = useState(Array(30).fill(-160));
  const recordingRef = useRef(null);
  
  // Animation for recording indicator
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    return () => {
      stopRecording(); // Cleanup on unmount
    };
  }, []);
  
  useEffect(() => {
    if (isRecording) {
      // Create pulsing animation for recording indicator
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  // Update meter history when metering changes
  useEffect(() => {
    if (isRecording) {
      setMeterHistory(prevHistory => {
        const newHistory = [...prevHistory.slice(1), metering];
        return newHistory;
      });
    }
  }, [metering, isRecording]);

  const startRecording = async () => {
    if (isRecording || isSaving) {
      return;
    }
    
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Please allow microphone access to record audio.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.web,
          mimeType: 'audio/m4a',
          bitsPerSecond: 128000,
        },
      });
      await newRecording.startAsync();

      recordingRef.current = newRecording;
      setIsRecording(true);
      setRecordingDuration(0);
      setMetering(-160);
      setMeterHistory(Array(30).fill(-160));

      // Start metering with more frequent updates for responsive visualization
      const meteringInterval = setInterval(async () => {
        if (recordingRef.current) {
          const status = await recordingRef.current.getStatusAsync();
          if (status.isRecording) {
            // Use a more sensitive range for metering
            const newMetering = status.metering || -160;
            setMetering(newMetering);
          }
        }
      }, 30); // Update very frequently (every 30ms) for smoother visualization

      const intervalId = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
      setTimer(intervalId);
    } catch (error) {
      console.error('startRecording error:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    try {
      const recording = recordingRef.current;
      if (!recording) return;

      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }

      setIsRecording(false);
      setIsSaving(true);
      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();
      const status = await recording.getStatusAsync();

      if (!uri) {
        throw new Error('Recording URI is not available');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
        shouldDuckAndroid: true,
      });

      recordingRef.current = null;

      // Use the actual recorded duration from status if available
      // Fall back to our timer-based duration if status doesn't have it
      const durationInSeconds = status.durationMillis 
        ? Math.floor(status.durationMillis / 1000)
        : recordingDuration;
      
      const fileInfo = {
        name: `recording-${new Date().toISOString().slice(0, 10)}.m4a`,
        uri,
        mimeType: 'audio/m4a',
        size: status.durationMillis ? Math.floor(status.durationMillis / 1000) * 1024 : recordingDuration * 1024,
        isRecorded: true,
        duration: formatTime(durationInSeconds),
        durationInSeconds: durationInSeconds
      };
      onRecordingComplete(fileInfo);
    } catch (error) {
      console.error('stopRecording error:', error);
      Alert.alert('Error', 'Failed to save recording. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset function to clear recording state
  const resetRecording = () => {
    if (recordingRef.current) {
      stopRecording();
    }
    
    setRecordingDuration(0);
    if (onResetRecording) {
      onResetRecording();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Convert metering value to a percentage (0-100) with dynamic sensitivity
  const getMeteringPercentage = (value) => {
    // Make the range more sensitive to speech patterns
    const min = -120;
    const max = -10;
    // Enhanced logarithmic scaling to better represent speech patterns
    const normalized = (value - min) / (max - min);
    const percentage = normalized * 100;
    
    // Add a multiplier to make quiet sounds more visible
    const enhancedPercentage = percentage < 20 ? percentage * 1.5 : percentage;
    
    return Math.min(Math.max(enhancedPercentage, 5), 100);
  };

  // Generate waveform bars from meter history
  const getWaveformBars = () => {
    return meterHistory.map((value, index) => {
      const baseHeight = getMeteringPercentage(value);
      
      // Speech pattern simulation (more variety based on index position)
      const speechOffset = Math.sin(index * 0.8) * 15 + Math.cos(index * 0.3) * 10;
      
      // Use a smoother transition based on index
      const transitionFactor = Math.min(1, (index + 1) / 5);
      const smoothedHeight = baseHeight * transitionFactor + speechOffset * transitionFactor;
      
      // Ensure minimum height and avoid overflows
      return Math.max(3, Math.min(100, smoothedHeight));
    });
  };

  // Render waveform for saved recording (static but speech-like pattern)
  const renderSavedWaveform = () => {
    // Generate a realistic speech-like pattern for the saved recording visualization
    return Array(30).fill(0).map((_, index) => {
      // Create a complex wave pattern that looks like speech
      const position = index / 30;
      
      // Combined sine waves of different frequencies for a speech-like appearance
      const speechPattern = 
        Math.sin(position * 20) * 10 + 
        Math.sin(position * 8) * 20 +
        Math.sin(position * 4) * 15 +
        Math.sin(position * 30) * 7;
      
      // Add some variation based on position
      const baseHeight = 30 + speechPattern;
      
      // Ensure sensible values
      return Math.max(10, Math.min(75, baseHeight));
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.recordingInfo}>
        {isRecording ? (
          <View style={styles.statusContainer}>
            <Animated.View 
              style={[
                styles.recordingIndicator, 
                { transform: [{ scale: pulseAnim }] }
              ]} 
            />
            <Text style={styles.recordingStatus}>Recording in progress</Text>
          </View>
        ) : isSaving ? (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="small" color="#3A1E70" />
            <Text style={styles.recordingStatus}>Saving recording...</Text>
          </View>
        ) : savedRecording ? (
          <View style={styles.statusContainer}>
            <Ionicons name="checkmark-circle" size={18} color="#3A1E70" />
            <Text style={styles.recordingStatus}>Recording saved</Text>
          </View>
        ) : (
          <Text style={styles.instructions}>
            Tap the button below to start recording your appointment
          </Text>
        )}
      </View>

      <View style={styles.durationContainer}>
        {isRecording && (
          <>
            <Text style={styles.durationText}>{formatTime(recordingDuration)}</Text>
            <View style={styles.waveformContainer}>
              {getWaveformBars().map((height, index) => (
                <View
                  key={index}
                  style={[
                    styles.waveformBar,
                    { height: `${height}%` }
                  ]}
                />
              ))}
            </View>
          </>
        )}
        
        {!isRecording && savedRecording && (
          <View style={styles.savedRecordingContainer}>
            <View style={styles.savedWaveformContainer}>
              {renderSavedWaveform().map((height, index) => (
                <View
                  key={index}
                  style={[
                    styles.savedWaveformBar,
                    { height: `${height}%` }
                  ]}
                />
              ))}
            </View>
            <View style={styles.savedInfoContainer}>
              <View style={styles.savedInfoItem}>
                <Ionicons name="time-outline" size={18} color="#3A1E70" />
                <Text style={styles.savedInfoText}>{savedRecording.duration}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {!savedRecording || isRecording ? (
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.stopButton]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={isSaving}
        >
          <Ionicons name={isRecording ? "stop" : "mic"} size={32} color="white" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetRecording}
        >
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      )}

      <Text style={styles.recordButtonLabel}>
        {isRecording ? 'Tap to Stop Recording' : 'Tap to Start Recording'}
      </Text>
      
      {isRecording && (
        <Text style={styles.recordingTip}>
          Speak clearly and hold your device about 8 inches from your mouth
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EFE9F7',
    borderRadius: 12,
    marginVertical: 16,
  },
  recordingInfo: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'red',
    marginRight: 8,
  },
  recordingStatus: {
    color: '#3A1E70',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
  durationContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  durationText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3A1E70',
    marginBottom: 16,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: '90%',
    backgroundColor: 'transparent',
  },
  waveformBar: {
    width: 3,
    backgroundColor: '#3A1E70',
    marginHorizontal: 2,
    borderRadius: 4,
  },
  savedRecordingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  savedWaveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: '90%',
    backgroundColor: 'transparent',
    marginBottom: 12,
  },
  savedWaveformBar: {
    width: 3,
    backgroundColor: '#3A1E70',
    marginHorizontal: 2,
    borderRadius: 4,
    opacity: 0.8,
  },
  savedInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  savedInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  savedInfoText: {
    fontSize: 14,
    color: '#3A1E70',
    fontWeight: '500',
    marginLeft: 6,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3A1E70',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  stopButton: {
    backgroundColor: 'red',
  },
  resetButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3A1E70',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  recordButtonLabel: {
    fontSize: 16,
    color: '#3A1E70',
    textAlign: 'center',
    fontWeight: '500',
  },
  instructions: {
    fontSize: 16,
    color: '#3A1E70',
    textAlign: 'center',
  },
  recordingTip: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  }
});

export default AudioRecorder;