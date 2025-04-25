import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { summarizeText } from './apiHelper'; 

const { width } = Dimensions.get('window');

const ProcessingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { recordingId, transcriptionText } = route.params;
  
  const [recording, setRecording] = useState(null);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSummarizing, setIsSummarizing] = useState(true);
  const [showFullText, setShowFullText] = useState(false);
  const [summaryPoints, setSummaryPoints] = useState([]);

  useEffect(() => {
    const fetchRecording = async () => {
      try {
        const data = await AsyncStorage.getItem('recordings');
        if (data) {
          const recordings = JSON.parse(data);
          const currentRecording = recordings.find(r => r.id === recordingId);
          if (currentRecording) {
            setRecording(currentRecording);
            
            // Start summarization
            try {
              setIsSummarizing(true);
              const summaryText = await summarizeText(transcriptionText);
              setSummary(summaryText);
              
              // Extract key points from summary (split by periods or bullet points)
              const points = summaryText
                .split(/(?:\. |\n- |\n•)/)
                .filter(point => point.trim().length > 10)
                .map(point => point.trim())
                .slice(0, 5); // Limit to 5 key points
              
              setSummaryPoints(points);
              
              // Update the recording with the summary
              const updatedRecordings = recordings.map(r => {
                if (r.id === recordingId) {
                  return { ...r, summary: summaryText, transcriptionText: transcriptionText };
                }
                return r;
              });
              
              await AsyncStorage.setItem('recordings', JSON.stringify(updatedRecordings));
            } catch (summaryError) {
              console.error('Summary error:', summaryError);
              Alert.alert('Warning', 'Transcription complete, but summary generation failed.');
              setSummary('Summary not available.');
            } finally {
              setIsSummarizing(false);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching recording:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecording();
  }, [recordingId, transcriptionText]);

  const handleFinish = () => {
    navigation.navigate('HomeScreen');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3A1E70" />
        <Text style={styles.loadingText}>Loading appointment details...</Text>
      </View>
    );
  }

  const formatTranscript = (text) => {
    if (!text) return "";
    return text.replace(/\n\n/g, '\n').trim();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFE9F7" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Appointment Summary</Text>
            <Text style={styles.subtitle}>{recording?.title}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleFinish}>
            <Ionicons name="close-circle" size={32} color="#3A1E70" />
          </TouchableOpacity>
        </View>

        {recording && (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <View style={styles.detailRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="person" size={20} color="#fff" />
                </View>
                <Text style={styles.detailText}>Dr. {recording.doctor}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="calendar" size={20} color="#fff" />
                </View>
                <Text style={styles.detailText}>{recording.date}</Text>
              </View>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={22} color="#3A1E70" />
                  <Text style={styles.statValue}>{recording.duration}</Text>
                  <Text style={styles.statLabel}>Duration</Text>
                </View>
                
                <View style={styles.statDivider} />
                
                <View style={styles.statItem}>
                  <Ionicons name="text-outline" size={22} color="#3A1E70" />
                  <Text style={styles.statValue}>{recording.words}</Text>
                  <Text style={styles.statLabel}>Words</Text>
                </View>
              </View>
            </View>

            <View style={styles.transcriptSection}>
              <Text style={styles.sectionTitle}>Key Takeaways</Text>
              
              {isSummarizing ? (
                <View style={styles.loadingSummary}>
                  <ActivityIndicator size="small" color="#3A1E70" />
                  <Text style={styles.loadingText}>Analyzing appointment...</Text>
                </View>
              ) : (
                <View style={styles.summaryContent}>
                  {summaryPoints.length > 0 ? (
                    summaryPoints.map((point, index) => (
                      <View key={index} style={styles.summaryPoint}>
                        <View style={styles.bulletPoint} />
                        <Text style={styles.summaryPointText}>{point}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.summaryText}>{summary}</Text>
                  )}
                </View>
              )}
            </View>

            <View style={styles.transcriptSection}>
              <View style={styles.transcriptHeader}>
                <Text style={styles.sectionTitle}>Full Transcript</Text>
                <TouchableOpacity 
                  style={styles.viewButtonContainer} 
                  onPress={() => setShowFullText(!showFullText)}
                >
                  <Text style={styles.viewButtonText}>
                    {showFullText ? 'Hide' : 'View'}
                  </Text>
                  <Ionicons 
                    name={showFullText ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color="#3A1E70" 
                  />
                </TouchableOpacity>
              </View>
              
              {showFullText && (
                <View style={styles.transcriptContent}>
                  <Text style={styles.transcriptText}>
                    {formatTranscript(recording.transcriptionText)}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
              <Ionicons name="checkmark-circle-outline" size={20} color="white" />
              <Text style={styles.finishButtonText}>Save and Return Home</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#AFC2D5',
  },
  container: {
    flex: 1,
    backgroundColor: '#AFC2D5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#AFC2D5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#3A1E70',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 20,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3A1E70',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B4E9C',
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#EFE9F7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: '#3A1E70',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(58, 30, 112, 0.1)',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(58, 30, 112, 0.1)',
    height: '80%',
    alignSelf: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A1E70',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B4E9C',
    marginTop: 2,
  },
  transcriptSection: {
    backgroundColor: '#EFE9F7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transcriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A1E70',
  },
  viewButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(58, 30, 112, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewButtonText: {
    color: '#3A1E70',
    fontWeight: '600',
    marginRight: 4,
  },
  transcriptText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  transcriptContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(58, 30, 112, 0.1)',
  },
  summaryContent: {
    marginTop: 16,
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  summaryPoint: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3A1E70',
    marginTop: 8,
    marginRight: 12,
  },
  summaryPointText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  loadingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  finishButton: {
    backgroundColor: '#3A1E70',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ProcessingScreen;