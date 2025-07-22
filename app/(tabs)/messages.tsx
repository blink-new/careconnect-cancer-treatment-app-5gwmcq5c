import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Messages() {
  const messages = [
    {
      id: 1,
      sender: 'Dr. Smith',
      role: 'Oncologist',
      message: 'Your latest lab results look good. Please continue with the current treatment plan.',
      time: '2 hours ago',
      unread: true,
      avatar: 'medical-outline'
    },
    {
      id: 2,
      sender: 'Nurse Jennifer',
      role: 'Care Coordinator',
      message: 'Reminder: Please take your medication with food as discussed.',
      time: '5 hours ago',
      unread: true,
      avatar: 'person-outline'
    },
    {
      id: 3,
      sender: 'Dr. Johnson',
      role: 'Cardiologist',
      message: 'Thank you for sharing your symptoms tracker. Let\'s discuss this at your next appointment.',
      time: 'Yesterday',
      unread: false,
      avatar: 'heart-outline'
    },
    {
      id: 4,
      sender: 'Lab Department',
      role: 'Laboratory',
      message: 'Your test results are ready. Please check your patient portal.',
      time: '2 days ago',
      unread: false,
      avatar: 'flask-outline'
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.composeButton}>
          <Ionicons name="create-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(100)}
      >
        <Text style={styles.sectionTitle}>Care Team Messages</Text>
        {messages.map((message, index) => (
          <Animated.View
            key={message.id}
            style={[styles.messageCard, message.unread && styles.unreadCard]}
            entering={FadeInDown.duration(400).delay(200 + index * 100)}
          >
            <View style={styles.messageHeader}>
              <View style={styles.avatarContainer}>
                <Ionicons name={message.avatar as any} size={24} color="#3B82F6" />
              </View>
              <View style={styles.messageInfo}>
                <View style={styles.senderInfo}>
                  <Text style={styles.senderName}>{message.sender}</Text>
                  {message.unread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.senderRole}>{message.role}</Text>
                <Text style={styles.messageTime}>{message.time}</Text>
              </View>
            </View>
            
            <Text style={styles.messageText}>{message.message}</Text>
            
            <View style={styles.messageActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="arrow-undo-outline" size={16} color="#3B82F6" />
                <Text style={styles.actionText}>Reply</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="bookmark-outline" size={16} color="#6B7280" />
                <Text style={[styles.actionText, { color: '#6B7280' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(600)}
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionCard}>
            <Ionicons name="help-circle-outline" size={32} color="#3B82F6" />
            <Text style={styles.quickActionTitle}>Ask a Question</Text>
            <Text style={styles.quickActionSubtitle}>Get help from your care team</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <Ionicons name="document-text-outline" size={32} color="#10B981" />
            <Text style={styles.quickActionTitle}>Share Symptoms</Text>
            <Text style={styles.quickActionSubtitle}>Send your daily tracker</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  composeButton: {
    backgroundColor: '#3B82F6',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  messageHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F615',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageInfo: {
    flex: 1,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
  },
  senderRole: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  messageText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  messageActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 12,
    color: '#3B82F6',
    marginLeft: 4,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});