import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Appointments() {
  const appointments = [
    {
      id: 1,
      title: 'Dr. Smith - Oncology',
      date: 'Today',
      time: '2:00 PM',
      type: 'Consultation',
      location: 'Cancer Center - Room 204',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Lab Work',
      date: 'Tomorrow',
      time: '9:00 AM',
      type: 'Lab Test',
      location: 'Lab Department - 2nd Floor',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Dr. Johnson - Cardiology',
      date: 'Friday, Jan 22',
      time: '11:30 AM',
      type: 'Follow-up',
      location: 'Cardiology Wing - Room 105',
      status: 'upcoming'
    },
    {
      id: 4,
      title: 'Dr. Smith - Oncology',
      date: 'Jan 15',
      time: '3:00 PM',
      type: 'Consultation',
      location: 'Cancer Center - Room 204',
      status: 'completed'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Consultation': return '#3B82F6';
      case 'Lab Test': return '#10B981';
      case 'Follow-up': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#F59E0B';
      case 'completed': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(100)}
      >
        <Text style={styles.sectionTitle}>Upcoming</Text>
        {appointments
          .filter(apt => apt.status === 'upcoming')
          .map((appointment, index) => (
            <Animated.View
              key={appointment.id}
              style={styles.appointmentCard}
              entering={FadeInDown.duration(400).delay(200 + index * 100)}
            >
              <View style={styles.appointmentHeader}>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                  <Text style={styles.appointmentDateTime}>
                    {appointment.date} at {appointment.time}
                  </Text>
                  <Text style={styles.appointmentLocation}>{appointment.location}</Text>
                </View>
                <View style={styles.appointmentMeta}>
                  <View style={[styles.typeBadge, { backgroundColor: `${getTypeColor(appointment.type)}15` }]}>
                    <Text style={[styles.typeText, { color: getTypeColor(appointment.type) }]}>
                      {appointment.type}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.appointmentActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="calendar-outline" size={16} color="#3B82F6" />
                  <Text style={styles.actionText}>Add to Calendar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="call-outline" size={16} color="#3B82F6" />
                  <Text style={styles.actionText}>Call Office</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="location-outline" size={16} color="#3B82F6" />
                  <Text style={styles.actionText}>Directions</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
      </Animated.View>

      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(500)}
      >
        <Text style={styles.sectionTitle}>Recent</Text>
        {appointments
          .filter(apt => apt.status === 'completed')
          .map((appointment, index) => (
            <Animated.View
              key={appointment.id}
              style={[styles.appointmentCard, styles.completedCard]}
              entering={FadeInDown.duration(400).delay(600 + index * 100)}
            >
              <View style={styles.appointmentHeader}>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                  <Text style={styles.appointmentDateTime}>
                    {appointment.date} at {appointment.time}
                  </Text>
                  <Text style={styles.appointmentLocation}>{appointment.location}</Text>
                </View>
                <View style={styles.appointmentMeta}>
                  <View style={[styles.statusBadge, { backgroundColor: '#10B98115' }]}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={[styles.statusText, { color: '#10B981' }]}>Completed</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.appointmentActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="document-text-outline" size={16} color="#6B7280" />
                  <Text style={[styles.actionText, { color: '#6B7280' }]}>View Notes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="repeat-outline" size={16} color="#6B7280" />
                  <Text style={[styles.actionText, { color: '#6B7280' }]}>Reschedule</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
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
  addButton: {
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
  appointmentCard: {
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
  completedCard: {
    opacity: 0.8,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  appointmentDateTime: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginBottom: 4,
  },
  appointmentLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  appointmentMeta: {
    alignItems: 'flex-end',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  moreButton: {
    padding: 4,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 12,
    color: '#3B82F6',
    marginLeft: 4,
    fontWeight: '500',
  },
});