import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInLeft, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

export default function Messages() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    message: ''
  });

  // Animation values
  const unreadBadgeScale = useSharedValue(1);
  const composeButtonScale = useSharedValue(1);

  useEffect(() => {
    // Pulse animation for unread messages
    const pulse = () => {
      unreadBadgeScale.value = withSpring(1.2, {}, () => {
        unreadBadgeScale.value = withSpring(1);
      });
    };
    
    const interval = setInterval(pulse, 3000);
    return () => clearInterval(interval);
  }, []);

  const filters = [
    { key: 'all', label: 'All', count: 8 },
    { key: 'unread', label: 'Unread', count: 2 },
    { key: 'care_team', label: 'Care Team', count: 5 },
    { key: 'appointments', label: 'Appointments', count: 3 },
  ];

  const messages = [
    {
      id: 1,
      sender: 'Dr. Smith',
      role: 'Oncologist',
      message: 'Your latest lab results look good. Please continue with the current treatment plan. I\'ve also updated your medication schedule.',
      time: '2 hours ago',
      unread: true,
      avatar: 'medical-outline',
      priority: 'high',
      category: 'care_team',
      attachments: ['Lab_Results_Jan2024.pdf'],
      thread: 3
    },
    {
      id: 2,
      sender: 'Nurse Jennifer',
      role: 'Care Coordinator',
      message: 'Reminder: Please take your medication with food as discussed. Also, don\'t forget to log your symptoms in the app.',
      time: '5 hours ago',
      unread: true,
      avatar: 'person-outline',
      priority: 'normal',
      category: 'care_team',
      attachments: [],
      thread: 1
    },
    {
      id: 3,
      sender: 'Dr. Johnson',
      role: 'Cardiologist',
      message: 'Thank you for sharing your symptoms tracker. Let\'s discuss this at your next appointment. Your heart rate trends look stable.',
      time: 'Yesterday',
      unread: false,
      avatar: 'heart-outline',
      priority: 'normal',
      category: 'care_team',
      attachments: [],
      thread: 2
    },
    {
      id: 4,
      sender: 'Lab Department',
      role: 'Laboratory',
      message: 'Your test results are ready. Please check your patient portal or discuss with Dr. Smith during your next visit.',
      time: '2 days ago',
      unread: false,
      avatar: 'flask-outline',
      priority: 'normal',
      category: 'care_team',
      attachments: ['CBC_Results.pdf', 'Chemistry_Panel.pdf'],
      thread: 1
    },
    {
      id: 5,
      sender: 'Appointment System',
      role: 'Automated',
      message: 'Appointment confirmed: Dr. Smith - Tomorrow at 2:00 PM. Please arrive 15 minutes early.',
      time: '3 days ago',
      unread: false,
      avatar: 'calendar-outline',
      priority: 'normal',
      category: 'appointments',
      attachments: [],
      thread: 1
    },
    {
      id: 6,
      sender: 'Physical Therapy',
      role: 'Rehabilitation',
      message: 'Great progress in today\'s session! Here are your home exercises for this week. Remember to take breaks if you feel tired.',
      time: '4 days ago',
      unread: false,
      avatar: 'fitness-outline',
      priority: 'normal',
      category: 'care_team',
      attachments: ['Home_Exercises_Week3.pdf'],
      thread: 1
    },
    {
      id: 7,
      sender: 'Pharmacy',
      role: 'Medication',
      message: 'Your prescription is ready for pickup. We\'re open until 9 PM today. Please bring your ID.',
      time: '5 days ago',
      unread: false,
      avatar: 'medical',
      priority: 'normal',
      category: 'care_team',
      attachments: [],
      thread: 1
    },
    {
      id: 8,
      sender: 'Insurance Team',
      role: 'Billing',
      message: 'Your recent claim has been processed. You may receive an explanation of benefits in the mail within 7-10 business days.',
      time: '1 week ago',
      unread: false,
      avatar: 'card-outline',
      priority: 'low',
      category: 'appointments',
      attachments: ['EOB_Summary.pdf'],
      thread: 1
    }
  ];

  const careTeamMembers = [
    { name: 'Dr. Sarah Smith', role: 'Oncologist', avatar: 'medical' },
    { name: 'Dr. Michael Johnson', role: 'Cardiologist', avatar: 'heart' },
    { name: 'Jennifer Martinez', role: 'Care Coordinator', avatar: 'person' },
    { name: 'Lisa Chen', role: 'Physical Therapist', avatar: 'fitness' },
  ];

  const filteredMessages = messages.filter(msg => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return msg.unread;
    return msg.category === selectedFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'normal': return '#3B82F6';
      case 'low': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const handleCompose = () => {
    composeButtonScale.value = withSpring(0.9, {}, () => {
      composeButtonScale.value = withSpring(1);
    });
    setShowComposeModal(true);
  };

  const sendMessage = () => {
    if (!newMessage.recipient || !newMessage.subject || !newMessage.message) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    Alert.alert(
      'Message Sent',
      `Your message has been sent to ${newMessage.recipient}.`,
      [{ text: 'OK' }]
    );

    setNewMessage({ recipient: '', subject: '', message: '' });
    setShowComposeModal(false);
  };

  const markAsRead = (messageId: number) => {
    // In a real app, this would update the message status
    Alert.alert('Message', 'Message marked as read.');
  };

  const animatedUnreadStyle = useAnimatedStyle(() => ({
    transform: [{ scale: unreadBadgeScale.value }],
  }));

  const animatedComposeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: composeButtonScale.value }],
  }));

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
          <Text style={styles.subtitle}>Communicate with your care team</Text>
        </View>

        {/* Filter Tabs */}
        <Animated.View 
          style={styles.filterContainer}
          entering={FadeInDown.duration(600).delay(100)}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterTab,
                  selectedFilter === filter.key && styles.filterTabActive
                ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter.key && styles.filterTextActive
                ]}>
                  {filter.label}
                </Text>
                <View style={[
                  styles.filterBadge,
                  selectedFilter === filter.key && styles.filterBadgeActive
                ]}>
                  <Text style={[
                    styles.filterBadgeText,
                    selectedFilter === filter.key && styles.filterBadgeTextActive
                  ]}>
                    {filter.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Unread Messages Alert */}
        {messages.filter(m => m.unread).length > 0 && (
          <Animated.View 
            style={[styles.unreadAlert, animatedUnreadStyle]}
            entering={FadeInDown.duration(600).delay(200)}
          >
            <View style={styles.unreadAlertIcon}>
              <Ionicons name="mail-unread" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.unreadAlertText}>
              You have {messages.filter(m => m.unread).length} unread messages
            </Text>
            <TouchableOpacity 
              style={styles.unreadAlertButton}
              onPress={() => setSelectedFilter('unread')}
            >
              <Text style={styles.unreadAlertButtonText}>View</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Messages List */}
        <View style={styles.messagesList}>
          {filteredMessages.map((message, index) => (
            <Animated.View
              key={message.id}
              style={[
                styles.messageCard,
                message.unread && styles.unreadCard
              ]}
              entering={FadeInDown.duration(400).delay(300 + index * 100)}
            >
              <TouchableOpacity 
                style={styles.messageContent}
                onPress={() => message.unread && markAsRead(message.id)}
              >
                <View style={styles.messageHeader}>
                  <View style={styles.senderInfo}>
                    <View style={[
                      styles.avatarContainer,
                      { backgroundColor: `${getPriorityColor(message.priority)}20` }
                    ]}>
                      <Ionicons name={message.avatar as any} size={20} color={getPriorityColor(message.priority)} />
                    </View>
                    <View style={styles.senderDetails}>
                      <View style={styles.senderNameRow}>
                        <Text style={styles.senderName}>{message.sender}</Text>
                        {message.unread && (
                          <Animated.View style={[styles.unreadDot, animatedUnreadStyle]} />
                        )}
                        {message.priority === 'high' && (
                          <View style={styles.priorityBadge}>
                            <Ionicons name="alert-circle" size={12} color="#EF4444" />
                          </View>
                        )}
                      </View>
                      <Text style={styles.senderRole}>{message.role}</Text>
                      <Text style={styles.messageTime}>{message.time}</Text>
                    </View>
                  </View>
                  {message.thread > 1 && (
                    <View style={styles.threadBadge}>
                      <Ionicons name="chatbubbles" size={12} color="#3B82F6" />
                      <Text style={styles.threadCount}>{message.thread}</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.messageText} numberOfLines={3}>
                  {message.message}
                </Text>
                
                {message.attachments.length > 0 && (
                  <View style={styles.attachmentsContainer}>
                    <Ionicons name="attach" size={14} color="#94A3B8" />
                    <Text style={styles.attachmentsText}>
                      {message.attachments.length} attachment{message.attachments.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
                
                <View style={styles.messageActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="arrow-undo-outline" size={16} color="#3B82F6" />
                    <Text style={styles.actionText}>Reply</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="share-outline" size={16} color="#94A3B8" />
                    <Text style={[styles.actionText, { color: '#94A3B8' }]}>Forward</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="bookmark-outline" size={16} color="#94A3B8" />
                    <Text style={[styles.actionText, { color: '#94A3B8' }]}>Save</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Quick Actions */}
        <Animated.View 
          style={styles.quickActionsContainer}
          entering={FadeInDown.duration(600).delay(800)}
        >
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
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
          
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionCard}>
              <Ionicons name="calendar-outline" size={32} color="#8B5CF6" />
              <Text style={styles.quickActionTitle}>Schedule Follow-up</Text>
              <Text style={styles.quickActionSubtitle}>Book your next appointment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <Ionicons name="medical-outline" size={32} color="#F59E0B" />
              <Text style={styles.quickActionTitle}>Medication Question</Text>
              <Text style={styles.quickActionSubtitle}>Ask about side effects</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Care Team Quick Contact */}
        <Animated.View 
          style={styles.careTeamContainer}
          entering={FadeInDown.duration(600).delay(1000)}
        >
          <Text style={styles.careTeamTitle}>Your Care Team</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {careTeamMembers.map((member, index) => (
              <Animated.View
                key={member.name}
                style={styles.careTeamMember}
                entering={FadeInLeft.duration(400).delay(1100 + index * 100)}
              >
                <TouchableOpacity style={styles.memberCard}>
                  <View style={[styles.memberAvatar, { backgroundColor: '#3B82F620' }]}>
                    <Ionicons name={member.avatar as any} size={20} color="#3B82F6" />
                  </View>
                  <Text style={styles.memberName}>{member.name.split(' ')[0]}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>

      {/* Floating Compose Button */}
      <Animated.View style={[styles.fab, animatedComposeStyle]}>
        <TouchableOpacity style={styles.fabButton} onPress={handleCompose}>
          <Ionicons name="create-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Compose Modal */}
      <Modal
        visible={showComposeModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowComposeModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Message</Text>
            <TouchableOpacity onPress={sendMessage}>
              <Text style={styles.modalSend}>Send</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>To *</Text>
              <View style={styles.recipientSelector}>
                {careTeamMembers.map((member) => (
                  <TouchableOpacity
                    key={member.name}
                    style={[
                      styles.recipientOption,
                      newMessage.recipient === member.name && styles.recipientOptionSelected
                    ]}
                    onPress={() => setNewMessage({...newMessage, recipient: member.name})}
                  >
                    <Ionicons name={member.avatar as any} size={16} color="#3B82F6" />
                    <Text style={styles.recipientOptionText}>{member.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Subject *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter subject"
                placeholderTextColor="#64748B"
                value={newMessage.subject}
                onChangeText={(text) => setNewMessage({...newMessage, subject: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Message *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Type your message here..."
                placeholderTextColor="#64748B"
                value={newMessage.message}
                onChangeText={(text) => setNewMessage({...newMessage, message: text})}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.messageTemplates}>
              <Text style={styles.templatesTitle}>Quick Templates</Text>
              <TouchableOpacity 
                style={styles.templateButton}
                onPress={() => setNewMessage({
                  ...newMessage, 
                  subject: 'Question about medication',
                  message: 'I have a question about my current medication. Could we schedule a time to discuss?'
                })}
              >
                <Text style={styles.templateText}>Medication Question</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.templateButton}
                onPress={() => setNewMessage({
                  ...newMessage, 
                  subject: 'Symptom update',
                  message: 'I wanted to update you on my recent symptoms and how I\'ve been feeling.'
                })}
              >
                <Text style={styles.templateText}>Symptom Update</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterTabActive: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
    marginRight: 8,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  filterBadge: {
    backgroundColor: '#475569',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: '#1E40AF',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  filterBadgeTextActive: {
    color: '#FFFFFF',
  },
  unreadAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  unreadAlertIcon: {
    marginRight: 12,
  },
  unreadAlertText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
  },
  unreadAlertButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  unreadAlertButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  messagesList: {
    paddingHorizontal: 20,
  },
  messageCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    backgroundColor: '#1E40AF10',
  },
  messageContent: {
    padding: 16,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  senderInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  senderDetails: {
    flex: 1,
  },
  senderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginRight: 8,
  },
  priorityBadge: {
    marginLeft: 4,
  },
  senderRole: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 2,
  },
  messageTime: {
    fontSize: 12,
    color: '#64748B',
  },
  threadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E40AF20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  threadCount: {
    fontSize: 10,
    color: '#3B82F6',
    marginLeft: 2,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 12,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  attachmentsText: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 6,
  },
  messageActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#475569',
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
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quickActionCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  careTeamContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 100,
  },
  careTeamTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  careTeamMember: {
    marginRight: 16,
  },
  memberCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 2,
    textAlign: 'center',
  },
  memberRole: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  fabButton: {
    backgroundColor: '#3B82F6',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1E293B',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#475569',
    backgroundColor: '#334155',
  },
  modalCancel: {
    fontSize: 16,
    color: '#94A3B8',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  modalSend: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  recipientSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recipientOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  recipientOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E40AF20',
  },
  recipientOptionText: {
    fontSize: 12,
    color: '#CBD5E1',
    marginLeft: 6,
  },
  textInput: {
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#F8FAFC',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  messageTemplates: {
    marginTop: 20,
  },
  templatesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  templateButton: {
    backgroundColor: '#334155',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#475569',
  },
  templateText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
});