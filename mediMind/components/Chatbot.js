import React, { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import Markdown from 'react-native-markdown-display';
import healthKeywords from './keywords';  
import Toast from 'react-native-root-toast';
import { RootSiblingParent } from 'react-native-root-siblings';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
const BACKEND_URL = Constants.expoConfig.extra.BACKEND_URL;

const BACKEND_URL_CHAT = `${BACKEND_URL}/chat`;
const NOTIFICATIONS_URL = `${BACKEND_URL}/notifications`;

const Chatbot = ({ navigation }) => {

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', 
      text: 'Hi, I\'m MediMind! Your personal AI healthcare assistant. Get medical information, health tips, and more. How can I help with your concerns today?', 
      isUser: false }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const flatListRef = useRef(null);

  const isHealthRelated = (text) => {
    const lower = text.toLowerCase();
    return healthKeywords.some(keyword => lower.includes(keyword));  // Check if any keyword exists in the input text
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
    
  }, [messages]);

  const extractReminderDetails = (text) => {
    const match = text.match(/- Title:\s*(.*)\n- Date:\s*(.*)\n- Time:\s*(.*)\n- Notes:\s*(.*)/i);
    if (!match) return null;

    const [_, title, date, time, notes] = match;
    return {
      title: title.trim() || 'A Reminder',
      message: notes.trim() || 'You have made a reminder for yourself.',
      time: `${date.trim()} ${time.trim()}`,
      type: 'general(not mentioned)',
    };
  };

  const handleSend = async () => {
    if (input.trim() === '') return;
    
    const userMessage = { id: Date.now().toString(), text: input, isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    const reminderDetails = extractReminderDetails(userMessage.text);

    if (reminderDetails) {
      try {
        const response = await fetch(NOTIFICATIONS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reminderDetails),
        });

        const data = await response.json();

        const botMessage = {
          id: (Date.now() + 1).toString(),
          text: response.ok ? `✅ Reminder "${reminderDetails.title}" set for ${reminderDetails.time}` : `❌ Failed to set reminder: ${data.error}`,
          isUser: false,
        };

        setMessages(prevMessages => [...prevMessages, botMessage]);

        // Show toast if reminder was set successfully
        if (response.ok) {
          Toast.show('✅ Reminder has been set successfully!', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.TOP,
            backgroundColor: '#28a745',
            opacity: 1,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            style: {
              paddingVertical: 10,  // Adds space around the text
              paddingHorizontal: 15, // Adds space on the sides
              borderRadius: 20,  // Makes the edges rounded
            }});
        } else {
          console.log('Failed to set reminder');
        }
      } catch (error) {
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          text: '❌ Error setting reminder. Please try again.',
          isUser: false,
        };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // normal health-related query
    try {

      const response = await fetch(BACKEND_URL_CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input + ". Please give a brief, clear summary" }),
      });

      const data = await response.json();
      
      let botMessageText = data.reply || "Hmm, I didn't catch that. Try again?";

      // Check if the input is health-related
      if (!isHealthRelated(input)) {
        botMessageText = "⚠️ This topic is unrelated to health. Please ask a health-related question.";
      }

      const botMessage = { 
        id: (Date.now() + 1).toString(), 
        text: botMessageText, 
        isUser: false 
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);

      
    } catch (error) {
      // Handle error from the backend or network issues
      console.error('Error getting response:', error);
      const errorMessage = { 
        id: (Date.now() + 1).toString(), 
        text: 'Sorry, I encountered an error. Please try again.', 
        isUser: false 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);

    } finally {
      setIsLoading(false);
    }
  };

  const handleSetReminderClick = () => {
    const template = `Set a reminder:\n- Title: \n- Date: \n- Time: \n- Notes: `;
    setInput(template);

    Alert.alert(
      "Reminder Template",
      "Reminder template added. Please fill in the details and send to set your reminder.",
      [{ text: "OK", style: "default" }]
    );
  };

  const renderMessage = ({ item }) => {
    const isUser = item.isUser;

    return (
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        {isUser ? (
          <Text style={[styles.messageText, styles.userText]}>
            {item.text}
          </Text>
        ) : (
          <Markdown style={markdownStyles}>{item.text}</Markdown>
        )}
      </View>
    );
  };

  return (
    <RootSiblingParent>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MediMind Assistant</Text>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
      />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0066cc" />
          <Text style={styles.loadingText}>Thinking...</Text>
        </View>
      )}
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask a medical question..."
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            (!input.trim() || isLoading) && styles.disabledButton
          ]} 

          onPress={handleSend} 

          disabled={!input.trim() || isLoading}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* Floating Set Reminder Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleSetReminderClick}
      >
        <Ionicons name="alarm" size={24} color="white" />
      </TouchableOpacity>

    </SafeAreaView>
    </RootSiblingParent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f0f3',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: 'white',
    marginHorizontal: 8,
    padding: 12,
    fontSize: 20,
    fontWeight: 'bold',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginVertical: 8,
  },
  userBubble: {
    backgroundColor: '#0066cc',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: '#333',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 24,
    minHeight: 48,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: '#0066cc',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#b3d1ff',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    backgroundColor: '#2c3e50',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});


const markdownStyles = {
  body: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  link: {
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
  paragraph: {
    marginBottom: 4,
  },
};

export default Chatbot;