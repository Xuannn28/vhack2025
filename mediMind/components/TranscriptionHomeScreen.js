import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [pastRecordings, setPastRecordings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load recordings from storage when component mounts or regains focus
  useFocusEffect(
    React.useCallback(() => {
      loadRecordings();
      return () => {}; // cleanup function
    }, [])
  );
  
  // Load saved recordings from AsyncStorage
  const loadRecordings = async () => {
    try {
      setIsLoading(true);
      const recordingsData = await AsyncStorage.getItem('recordings');
      if (recordingsData) {
        setPastRecordings(JSON.parse(recordingsData));
      }
    } catch (error) {
      console.error('Failed to load recordings:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Transcription</Text>
        <Text style={styles.subtitle}>Record or upload your medical appointments</Text>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.recordButton]} 
          onPress={() => navigation.navigate('Record')}
        >
          <Ionicons name="mic" size={32} color="white" />
          <Text style={styles.actionButtonText}>Record New</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.uploadButton]} 
          onPress={() => navigation.navigate('Upload', { mode: 'upload' })}
        >
          <Ionicons name="cloud-upload-outline" size={32} color="white" />
          <Text style={styles.actionButtonText}>Upload Recording</Text>
        </TouchableOpacity>
      </View>
      
      {/* Past Recordings Section */}
      <View style={styles.pastRecordingsSection}>
        <Text style={styles.sectionTitle}>Past Recordings</Text>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3A1E70" />
          </View>
        ) : pastRecordings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#3A1E70" />
            <Text style={styles.emptyText}>No recordings yet</Text>
            <Text style={styles.emptySubtext}>Your transcribed appointments will appear here</Text>
          </View>
        ) : (
          <FlatList
            data={pastRecordings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.recordingItem}
                onPress={() => navigation.navigate('Processing', { 
                  recordingId: item.id, 
                  transcriptionText: item.transcriptionText 
                })}
              >
                <View style={styles.recordingIconContainer}>
                  <Ionicons 
                    name={item.isRecorded ? "mic" : "document-text-outline"} 
                    size={24} 
                    color="white" 
                  />
                </View>
                <View style={styles.recordingInfo}>
                  <Text style={styles.recordingTitle}>{item.title || 'Untitled'}</Text>
                  <Text style={styles.recordingDetails}>
                    {item.duration || '00:00'} | {item.words || 0} Words
                  </Text>
                  <Text style={styles.recordingDate}>{item.date || 'No date'}</Text>
                  {item.summary && (
                    <Text style={styles.recordingSummary} numberOfLines={1} ellipsizeMode="tail">
                      {item.summary}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={24} color="white" />
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AFC2D5',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3A1E70',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#3A1E70',
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  recordButton: {
    backgroundColor: '#3A1E70',
  },
  uploadButton: {
    backgroundColor: '#4A90E2',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  pastRecordingsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3A1E70',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#3A1E70',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#3A1E70',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 8,
    textAlign: 'center',
  },
  recordingItem: {
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  recordingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3A1E70',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recordingDetails: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },
  recordingDate: {
    color: '#999',
    fontSize: 12,
  },
  recordingSummary: {
    color: '#83AACE',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic'
  }
});

export default HomeScreen;