
import React, { useState, useEffect } from 'react';


import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import axios from 'axios';
import Constants from 'expo-constants';

const BACKEND_URL = Constants.expoConfig.extra.BACKEND_URL;

// const NOTIFICATIONS = [
//   {
//     id: '1',
//     title: 'Appointment Reminder',
//     message: 'You have an appointment with Dr. Lee tomorrow at 10:00 AM.',
//     time: '2 hours ago',
//     read: false,
//     type: 'appointment',
//   },
//   {
//     id: '2',
//     title: 'Medication Reminder',
//     message: 'It\'s time to take your daily vitamin supplement.',
//     time: '5 hours ago',
//     read: true,
//     type: 'medication',
//   },
//   {
//     id: '3',
//     title: 'Health Tip',
//     message: 'Staying hydrated can help maintain your energy levels throughout the day.',
//     time: '1 day ago',
//     read: true,
//     type: 'tip',
//   },
//   {
//     id: '4',
//     title: 'Vaccine Available',
//     message: 'Influenza shots are now available at your local clinic.',
//     time: '2 days ago',
//     read: false,
//     type: 'vaccine',
//   },
//   {
//     id: '5',
//     title: 'Mental Health Check-in',
//     message: 'How are you feeling today? Take a moment to reflect on your mental wellbeing.',
//     time: '3 days ago',
//     read: true,
//     type: 'mental',
//   },
//   {
//     id: '6',
//     title: 'New Doctor Available',
//     message: 'Dr. Michael Chen is now available for appointments.',
//     time: '5 days ago',
//     read: true,
//     type: 'doctor',
//   },
// ];



const BACKEND_URL_NOTI = `${BACKEND_URL}/notifications`;

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from the backend
  useEffect(() => {
    axios.get(BACKEND_URL_NOTI)
      .then(response => {
        setNotifications(response.data);
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      });
  }, []);

  // Function to mark a notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Function to handle notification press
  const handleNotificationPress = (notification) => {
    // Mark as read when pressed
    markAsRead(notification.id);
    
    switch(notification.type) {
      case 'appointment':
        console.log('Navigate to appointment details');
        break;
      case 'medication':
        console.log('Navigate to medication details');
        break;
      case 'vaccine':
        console.log('Navigate to vaccine info');
        break;
      case 'mental':
        console.log('Navigate to mental health check');
        break;
      case 'doctor':
        console.log('Navigate to doctor profile');
        break;
      default:
        console.log('No specific navigation for this notification type');
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'appointment':
        return <Ionicons name="calendar" size={24} color="#0066cc" />;
      case 'medication':
        return <Ionicons name="medical" size={24} color="#ff6b6b" />;
      case 'tip':
        return <Ionicons name="bulb" size={24} color="#feca57" />;
      case 'vaccine':
        return <Ionicons name="fitness" size={24} color="#1dd1a1" />;
      case 'mental':
        return <Ionicons name="heart" size={24} color="#ff9ff3" />;
      case 'doctor':
        return <Ionicons name="person" size={24} color="#54a0ff" />;
      default:
        return <Ionicons name="notifications" size={24} color="#778ca3" />;
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationIconContainer}>
        {getNotificationIcon(item.type)}
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>
          {item.title}
          {!item.read && <View style={styles.unreadDot} />}
        </Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#A4C1C9" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>
            You have {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
          </Text>
          {unreadCount > 0 && (
            <Text style={styles.summarySuggestion}>
              Tap on a notification to view details
            </Text>
          )}
        </View>
      </View>
      
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notificationsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No notifications</Text>
          <Text style={styles.emptySubText}>
            You don't have any notifications at the moment.
          </Text>
        </View>
      )}
      
      {notifications.length > 0 && (
        <TouchableOpacity 
          style={styles.clearAllButton}
          onPress={clearAllNotifications}
        >
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f0f3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2c3e50',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  markAllText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  summaryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summaryBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  summarySuggestion: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  notificationsList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 80,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  unreadNotification: {
    backgroundColor: '#E6F7FF',
    borderLeftWidth: 4,
    borderLeftColor: '#006D77',
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#006D77',
    marginLeft: 6,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '80%',
  },
  clearAllButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#006D77',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearAllText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotificationsScreen;