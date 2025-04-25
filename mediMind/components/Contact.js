import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Modal,
  Linking,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { FontAwesome5 } from '@expo/vector-icons';

// Mood tracking options
const MOODS = [
  { emoji: '😊', label: 'Happy', color: '#FFE382' },
  { emoji: '😌', label: 'Excited', color: '#FECCD0' },
  { emoji: '😟', label: 'Anxious', color: '#BBECA4' },
  { emoji: '😠', label: 'Angry', color: '#FF6666' },
  { emoji: '😢', label: 'Sad', color: '#A4D4E4' },
  { emoji: '😩', label: 'Stressed', color: '#D8C4EB' },
];

// Helpline contacts data
const CONTACTS = [
  {
    img: require('../assets/MMHA.png'),
    name: 'Malaysian Mental Health Association',
    description: 'Psychological Therapy & Support Services',
    phone: '+603 2780 6803',
    website: 'https://mmha.org.my',
    fullDescription: 'The Malaysian Mental Health Association (MMHA) is a non-profit organization that provides psychological therapy and support services. They offer counseling, psychotherapy, and mental health education to help individuals manage various mental health issues.',
  },
  {
    img: require('../assets/talian kasih 15999.jpeg'),
    name: 'Talian Kasih 15999',
    description: '24-hour Nationwide Helpline & Counselling',
    phone: '15999',
    website: 'https://www.kpwkm.gov.my',
    fullDescription: 'Talian Kasih 15999 is a 24-hour nationwide helpline and counseling service provided by the Ministry of Women, Family and Community Development. It offers assistance for various issues including domestic violence, child abuse, and mental health crises.',
  },
  {
    img: require('../assets/Befrienders.png'),
    name: 'Befrienders (Klang Valley)',
    description: 'Emotional Support & Suicide Prevention Helpline',
    phone: '+603 7627 2929',
    website: 'https://www.befrienders.org.my',
    fullDescription: 'Befrienders is a non-profit organization providing emotional support to those in distress or at risk of suicide. Their trained volunteers offer confidential and non-judgmental listening services to anyone in need of emotional support.',
  },
  // Other contact entries...
];

export default function MentalHealthPage({ navigation }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showAllContacts, setShowAllContacts] = useState(false);

  // Filter contacts based on search query
  const filteredContacts = CONTACTS.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedContacts = showAllContacts ? filteredContacts : filteredContacts.slice(0, 3);

  const handleContactPress = (contact) => {
    setSelectedContact(contact);
    setModalVisible(true);
  };

  const openWebsite = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const callPhone = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Mood Tracker Section */}
        <View style={styles.moodTrackerSection}>
          <Text style={styles.moodPrompt}>
            Tell us how you feel today so that we can understand and know you better.
          </Text>
          
          <View style={styles.moodGrid}>
            {MOODS.map((mood, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.moodOption,
                  { backgroundColor: mood.color },
                  selectedMood === mood.label && styles.selectedMood
                ]}
                onPress={() => setSelectedMood(mood.label)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.viewMoodBoardButton}>
            <Text style={styles.viewMoodBoardText}>View Mood Board</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Helplines */}
        <View style={styles.helplineCardsSection}>
          <TouchableOpacity 
            style={styles.helplineCard}
            onPress={() => callPhone('15999')}
          >
            <Image 
              source={require('../assets/talian 15999.jpeg')} 
              style={styles.helplineCardImage} 
              resizeMode="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.helplineCard}
            onPress={() => callPhone('+603 7627 2929')}
          >
            <Image 
              source={require('../assets/befrienders kl hl.jpg')} 
              style={styles.helplineCardImage} 
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>


        {/* Stress Level Assessment Section */}
        <View style={styles.stressAssessmentSection}>
          <Text style={styles.stressAssessmentTitle}>Do You Know Your Stress Level?</Text>
          <Text style={styles.stressAssessmentDescription}>
            Am I too stressed? How much stress is too much? 
            Use this short quiz to measure whether your stress level scale is too high.
          </Text>
          <Text style={styles.stressAssessmentPrompt}>Check your stress level now.</Text>
          
          <TouchableOpacity 
            style={styles.takeAssessmentButton}
            onPress={() => navigation.navigate('StressAssessment')}
          >
            <Text style={styles.takeAssessmentButtonText}>Take Assessment</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Mental Wellness Tips */}
        <View style={styles.wellnessTipsSection}>
          <View style={styles.wellnessTipsContent}>
            <Image 
              source={require('../assets/brain.png')} 
              style={styles.wellnessTipsIcon} 
            />
            <View style={styles.wellnessTipsTextContainer}>
              <Text style={styles.wellnessTipsTitle}>Pause. Relax. Breathe.</Text>
              <Text style={styles.wellnessTipsText}>
                Be kind to yourself.{"\n"}
                Your mental health matters.{"\n"}
                You matter.
              </Text>
            </View>
          </View>
        </View>

        {/* Mental Health Resources */}
        <View style={styles.resourcesSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Mental Health Resources</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search resources..."
              value={searchQuery}
              onChangeText={text => setSearchQuery(text)}
            />
          </View>

          {/* Quick Access Buttons */}
          <View style={styles.quickAccessSection}>
            <TouchableOpacity style={styles.quickAccessButton}>
              <FontAwesome5 name="book-reader" size={24} color="#006D77" />
              <Text style={styles.quickAccessText}>Articles</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAccessButton}>
              <FontAwesome5 name="headphones" size={24} color="#006D77" />
              <Text style={styles.quickAccessText}>Podcasts</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAccessButton}>
              <FontAwesome5 name="hands-helping" size={24} color="#006D77" />
              <Text style={styles.quickAccessText}>Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAccessButton}>
              <FontAwesome5 name="spa" size={24} color="#006D77" />
              <Text style={styles.quickAccessText}>Exercises</Text>
            </TouchableOpacity>
          </View>

          {/* Contact List */}
          <View style={styles.contactsListSection}>
            <Text style={styles.contactsTitle}>Helplines & Support Centers</Text>
            
            {displayedContacts.map((contact, index) => (
              <View key={index} style={styles.contactCard}>
                <TouchableOpacity onPress={() => handleContactPress(contact)}>
                  <View style={styles.contactCardContent}>
                    {contact.img ? (
                      <Image source={contact.img} style={styles.contactCardImg} />
                    ) : (
                      <View style={[styles.contactCardImg, styles.contactCardAvatar]}>
                        <Text style={styles.contactCardAvatarText}>{contact.name[0]}</Text>
                      </View>
                    )}
                    <View style={styles.contactCardBody}>
                      <Text style={styles.contactCardTitle}>{contact.name}</Text>
                      {contact.description ? <Text style={styles.contactCardDescription}>{contact.description}</Text> : null}
                      <Text style={styles.contactCardPhone}>{contact.phone}</Text>
                    </View>
                    <FeatherIcon color="#9ca3af" name="chevron-right" size={22} />
                  </View>
                </TouchableOpacity>
              </View>
            ))}
            
            {filteredContacts.length > 3 && (
              <TouchableOpacity 
                style={styles.showMoreButton}
                onPress={() => setShowAllContacts(!showAllContacts)}
              >
                <Text style={styles.showMoreButtonText}>
                  {showAllContacts ? 'Show Less' : 'Show More'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Upcoming Activities Section */}
          <View style={styles.upcomingActivitiesSection}>
            <Text style={styles.sectionTitle}>Upcoming Activities</Text>
            
            <TouchableOpacity style={styles.activityCard}>
              <View style={styles.activityDateBadge}>
                <Text style={styles.activityDateDay}>23</Text>
                <Text style={styles.activityDateMonth}>APR</Text>
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Group Therapy Session</Text>
                <Text style={styles.activityTime}>10:00 AM - 11:30 AM</Text>
                <Text style={styles.activityLocation}>MMHA Center, Kuala Lumpur</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.activityCard}>
              <View style={styles.activityDateBadge}>
                <Text style={styles.activityDateDay}>25</Text>
                <Text style={styles.activityDateMonth}>APR</Text>
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Mindfulness Workshop</Text>
                <Text style={styles.activityTime}>2:00 PM - 4:00 PM</Text>
                <Text style={styles.activityLocation}>Virtual (Zoom)</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllButtonText}>View All Activities</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Details Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {selectedContact && (
                <>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}>
                    <FeatherIcon name="x" size={24} color="#000" />
                  </TouchableOpacity>
                  
                  <Image 
                    source={selectedContact.img} 
                    style={styles.modalImage} 
                    resizeMode="contain"
                  />
                  
                  <Text style={styles.modalTitle}>{selectedContact.name}</Text>
                  <Text style={styles.modalSubtitle}>{selectedContact.description}</Text>
                  
                  <View style={styles.modalInfoSection}>
                    <Text style={styles.modalDescription}>{selectedContact.fullDescription}</Text>
                  </View>
                  
                  <View style={styles.modalContactActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => callPhone(selectedContact.phone)}>
                      <FeatherIcon name="phone" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Call</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.websiteButton]}
                      onPress={() => openWebsite(selectedContact.website)}>
                      <FeatherIcon name="globe" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Visit Website</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f0f3',
  },
  scrollContainer: { 
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  moodTrackerSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  moodPrompt: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  moodOption: {
    width: '30%',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedMood: {
    borderWidth: 2,
    borderColor: '#006D77',
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 5,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  viewMoodBoardButton: {
    alignSelf: 'center',
    marginTop: 5,
  },
  viewMoodBoardText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '500',
  },
  helplineCardsSection: {
    flexDirection: 'column', 
    alignItems: 'center',
    padding: 10,
  },
  helplineCard: {
    width: '90%',
    aspectRatio: 1.6,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  helplineCardImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.6,
    resizeMode: 'contain',
    borderRadius: 12,
  },
  helplineCardOverlay: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  helplineCardTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  helplineCardWhatsapp: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  helplineCardPhone: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  stressAssessmentSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  stressAssessmentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  stressAssessmentDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  stressAssessmentPrompt: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  takeAssessmentButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  takeAssessmentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  wellnessTipsSection: {
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
    height: 180,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#2c387e',
  },
  wellnessTipsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    height: '100%',
  },
  wellnessTipsIcon: {
    width: 70,
    height: 70,
  },
  wellnessTipsTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  wellnessTipsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  wellnessTipsText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  resourcesSection: {
    padding: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'column',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  quickAccessSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 15,
  },
  quickAccessButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '23%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickAccessText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginTop: 5,
    textAlign: 'center',
  },
  contactsListSection: {
    marginBottom: 20,
  },
  contactsTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactCardContent: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactCardImg: {
    width: 45,
    height: 45,
    borderRadius: 10,
  },
  contactCardAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9ca1ac',
  },
  contactCardAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  contactCardBody: {
    flex: 1,
    marginLeft: 15,
  },
  contactCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactCardDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  contactCardPhone: {
    fontSize: 14,
    color: '#006D77',
    fontWeight: '500',
    marginTop: 3,
  },
  showMoreButton: {
    padding: 10,
    alignItems: 'center',
  },
  showMoreButtonText: {
    color: '#006D77',
    fontSize: 15,
    fontWeight: '600',
  },
  upcomingActivitiesSection: {
    marginTop: 10,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityDateBadge: {
    width: 50,
    height: 60,
    backgroundColor: '#006D77',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  activityDateDay: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  activityDateMonth: {
    color: '#fff',
    fontSize: 14,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 14,
    color: '#666',
  },
  activityLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  viewAllButton: {
    padding: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  viewAllButtonText: {
    color: '#006D77',
    fontSize: 15,
    fontWeight: '600',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  modalImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#1d1d1d',
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#616d79',
    marginBottom: 15,
  },
  modalInfoSection: {
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalContactActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 120,
  },
  websiteButton: {
    backgroundColor: '#28a745',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});