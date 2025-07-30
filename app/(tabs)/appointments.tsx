import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInLeft, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

export default function Appointments() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Animation values
  const cardScale = useSharedValue(0.95);
  const fabScale = useSharedValue(1);

  useEffect(() => {
    cardScale.value = withSpring(1, { damping: 15 });
  }, []);

  const filters = [
    { key: 'all', label: 'All', count: 7 },
    { key: 'upcoming', label: 'Upcoming', count: 3 },
    { key: 'today', label: 'Today', count: 1 },
    { key: 'completed', label: 'Completed', count: 3 },
  ];

  const appointments = [
    {
      id: 1,
      title: 'Dr. Smith - Oncology',
      date: 'Today',
      time: '2:00 PM',
      type: 'Consultation',
      location: 'Cancer Center - Room 204',
      status: 'upcoming',
      doctor: {
        name: 'Dr. Sarah Smith',
        specialty: 'Oncologist',
        phone: '+1 (555) 123-4567',
        avatar: 'medical'
      },
      notes: 'Discuss latest lab results and treatment plan',
      isToday: true,
      isNext: true
    },
    {
      id: 2,
      title: 'Lab Work',
      date: 'Tomorrow',
      time: '9:00 AM',
      type: 'Lab Test',
      location: 'Lab Department - 2nd Floor',
      status: 'upcoming',
      doctor: {
        name: 'Lab Department',
        specialty: 'Laboratory',
        phone: '+1 (555) 987-6543',
        avatar: 'flask'
      },
      notes: 'Blood work and CBC panel',
      isToday: false,
      isNext: false
    },
    {
      id: 3,
      title: 'Dr. Johnson - Cardiology',
      date: 'Friday, Jan 22',
      time: '11:30 AM',
      type: 'Follow-up',
      location: 'Cardiology Wing - Room 105',
      status: 'upcoming',
      doctor: {
        name: 'Dr. Michael Johnson',
        specialty: 'Cardiologist',
        phone: '+1 (555) 456-7890',
        avatar: 'heart'
      },
      notes: 'Heart function monitoring',
      isToday: false,
      isNext: false
    },
    {
      id: 4,
      title: 'Dr. Smith - Oncology',
      date: 'Jan 15',
      time: '3:00 PM',
      type: 'Consultation',
      location: 'Cancer Center - Room 204',
      status: 'completed',
      doctor: {
        name: 'Dr. Sarah Smith',
        specialty: 'Oncologist',
        phone: '+1 (555) 123-4567',
        avatar: 'medical'
      },
      notes: 'Treatment plan review - went well',
      isToday: false,
      isNext: false
    },
    {
      id: 5,
      title: 'Physical Therapy',
      date: 'Jan 12',
      time: '10:00 AM',
      type: 'Therapy',
      location: 'Rehabilitation Center',
      status: 'completed',
      doctor: {
        name: 'Lisa Martinez, PT',
        specialty: 'Physical Therapist',
        phone: '+1 (555) 321-0987',
        avatar: 'fitness'
      },
      notes: 'Strength and mobility exercises',
      isToday: false,
      isNext: false
    },
    {
      id: 6,
      title: 'Nutrition Consultation',
      date: 'Jan 10',
      time: '1:00 PM',
      type: 'Consultation',
      location: 'Wellness Center - Room 301',
      status: 'completed',
      doctor: {
        name: 'Jennifer Chen, RD',
        specialty: 'Registered Dietitian',
        phone: '+1 (555) 654-3210',
        avatar: 'restaurant'
      },
      notes: 'Dietary plan adjustments made',
      isToday: false,
      isNext: false
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Consultation': return '#3B82F6';
      case 'Lab Test': return '#10B981';
      case 'Follow-up': return '#8B5CF6';
      case 'Therapy': return '#F59E0B';
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

  const filteredAppointments = appointments.filter(apt => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'today') return apt.isToday;
    return apt.status === selectedFilter;
  });

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleDirections = (location: string) => {
    const query = encodeURIComponent(location);
    Linking.openURL(`https://maps.google.com/?q=${query}`);
  };

  const addToCalendar = (appointment: any) => {
    Alert.alert(
      'Add to Calendar',
      `Would you like to add "${appointment.title}" to your calendar?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add', onPress: () => {
          // In a real app, this would generate an .ics file or use calendar API
          Alert.alert('Success', 'Appointment added to calendar!');
        }}
      ]
    );
  };

  const handleFabPress = () => {
    fabScale.value = withSpring(0.9, {}, () => {
      fabScale.value = withSpring(1);
    });
    Alert.alert(
      'Schedule Appointment',
      'This would open the appointment scheduling interface.',
      [{ text: 'OK' }]
    );
  };

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const animatedFabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Appointments</Text>
          <Text style={styles.subtitle}>Manage your healthcare schedule</Text>
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

        {/* Next Appointment Highlight */}
        {selectedFilter === 'all' || selectedFilter === 'upcoming' ? (
          <Animated.View 
            style={styles.nextAppointmentCard}
            entering={FadeInDown.duration(600).delay(200)}
          >
            <View style={styles.nextAppointmentHeader}>
              <View style={styles.nextAppointmentIcon}>
                <Ionicons name="time" size={24} color="#F59E0B" />
              </View>
              <View style={styles.nextAppointmentInfo}>
                <Text style={styles.nextAppointmentTitle}>Next Appointment</Text>
                <Text style={styles.nextAppointmentDetails}>
                  Dr. Smith - Today at 2:00 PM
                </Text>
              </View>
              <TouchableOpacity style={styles.nextAppointmentButton}>
                <Text style={styles.nextAppointmentButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : null}

        {/* Appointments List */}
        <View style={styles.appointmentsList}>
          {filteredAppointments.map((appointment, index) => (
            <Animated.View
              key={appointment.id}
              style={[
                styles.appointmentCard,
                appointment.isNext && styles.nextAppointmentHighlight,
                animatedCardStyle
              ]}
              entering={FadeInDown.duration(400).delay(300 + index * 100)}
            >
              <View style={styles.appointmentHeader}>
                <View style={styles.appointmentInfo}>
                  <View style={styles.appointmentTitleRow}>
                    <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                    {appointment.isNext && (
                      <View style={styles.nextBadge}>
                        <Text style={styles.nextBadgeText}>NEXT</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.appointmentDateTime}>
                    {appointment.date} at {appointment.time}
                  </Text>
                  <View style={styles.appointmentLocationRow}>
                    <Ionicons name="location" size={14} color="#94A3B8" />
                    <Text style={styles.appointmentLocation}>{appointment.location}</Text>
                  </View>
                </View>
                <View style={styles.appointmentMeta}>
                  <View style={[styles.typeBadge, { backgroundColor: `${getTypeColor(appointment.type)}20` }]}>
                    <Text style={[styles.typeText, { color: getTypeColor(appointment.type) }]}>
                      {appointment.type}
                    </Text>
                  </View>
                  <View style={styles.doctorInfo}>
                    <View style={[styles.doctorAvatar, { backgroundColor: `${getTypeColor(appointment.type)}20` }]}>
                      <Ionicons name={appointment.doctor.avatar as any} size={16} color={getTypeColor(appointment.type)} />
                    </View>
                    <View>
                      <Text style={styles.doctorName}>{appointment.doctor.name}</Text>
                      <Text style={styles.doctorSpecialty}>{appointment.doctor.specialty}</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              {appointment.notes && (
                <View style={styles.appointmentNotes}>
                  <Ionicons name="document-text" size={14} color="#94A3B8" />
                  <Text style={styles.notesText}>{appointment.notes}</Text>
                </View>
              )}
              
              <View style={styles.appointmentActions}>
                {appointment.status === 'upcoming' ? (
                  <>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => addToCalendar(appointment)}
                    >
                      <Ionicons name="calendar-outline" size={16} color="#3B82F6" />
                      <Text style={styles.actionText}>Add to Calendar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleCall(appointment.doctor.phone)}
                    >
                      <Ionicons name="call-outline" size={16} color="#3B82F6" />
                      <Text style={styles.actionText}>Call Office</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDirections(appointment.location)}
                    >
                      <Ionicons name="location-outline" size={16} color="#3B82F6" />
                      <Text style={styles.actionText}>Directions</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="document-text-outline" size={16} color="#94A3B8" />
                      <Text style={[styles.actionText, { color: '#94A3B8' }]}>View Notes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="repeat-outline" size={16} color="#94A3B8" />
                      <Text style={[styles.actionText, { color: '#94A3B8' }]}>Reschedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="star-outline" size={16} color="#94A3B8" />
                      <Text style={[styles.actionText, { color: '#94A3B8' }]}>Rate Visit</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Quick Stats */}
        <Animated.View 
          style={styles.statsContainer}
          entering={FadeInDown.duration(600).delay(800)}
        >
          <Text style={styles.statsTitle}>This Month</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color="#3B82F6" />
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>Total Appointments</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color="#F59E0B" />
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="people" size={24} color="#8B5CF6" />
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Providers</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View style={[styles.fab, animatedFabStyle]}>
        <TouchableOpacity style={styles.fabButton} onPress={handleFabPress}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
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
  nextAppointmentCard: {
    marginHorizontal: 20,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  nextAppointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextAppointmentIcon: {
    marginRight: 12,
  },
  nextAppointmentInfo: {
    flex: 1,
  },
  nextAppointmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 2,
  },
  nextAppointmentDetails: {
    fontSize: 16,
    color: '#92400E',
  },
  nextAppointmentButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  nextAppointmentButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  appointmentsList: {
    paddingHorizontal: 20,
  },
  appointmentCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  nextAppointmentHighlight: {
    borderWidth: 1,
    borderColor: '#F59E0B',
    backgroundColor: '#92400E10',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  appointmentInfo: {
    flex: 1,
    marginRight: 16,
  },
  appointmentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    flex: 1,
  },
  nextBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  nextBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  appointmentDateTime: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginBottom: 4,
  },
  appointmentLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentLocation: {
    fontSize: 14,
    color: '#94A3B8',
    marginLeft: 4,
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
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  doctorName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  doctorSpecialty: {
    fontSize: 10,
    color: '#94A3B8',
  },
  appointmentNotes: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  notesText: {
    fontSize: 14,
    color: '#CBD5E1',
    marginLeft: 8,
    flex: 1,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#475569',
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
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 100,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
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
});