import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Dashboard() {
  const stats = [
    { title: 'Upcoming Appointments', value: '3', icon: 'calendar', color: '#3B82F6' },
    { title: 'Medications Today', value: '5', icon: 'medical', color: '#10B981' },
    { title: 'Unread Messages', value: '2', icon: 'mail', color: '#F59E0B' },
    { title: 'Vitals Tracked', value: '8', icon: 'fitness', color: '#8B5CF6' },
  ];

  const upcomingAppointments = [
    { title: 'Dr. Smith - Oncology', date: 'Today, 2:00 PM', type: 'Consultation' },
    { title: 'Lab Work', date: 'Tomorrow, 9:00 AM', type: 'Lab Test' },
    { title: 'Dr. Johnson - Cardiology', date: 'Friday, 11:30 AM', type: 'Follow-up' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning!</Text>
        <Text style={styles.subtitle}>How are you feeling today?</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <Animated.View
            key={stat.title}
            style={[styles.statCard, { borderLeftColor: stat.color }]}
            entering={FadeInDown.duration(400).delay(index * 100)}
          >
            <View style={styles.statContent}>
              <View style={[styles.iconContainer, { backgroundColor: `${stat.color}15` }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <View style={styles.statText}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
            </View>
          </Animated.View>
        ))}
      </View>

      {/* Quick Actions */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(400)}
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="medical" size={24} color="#3B82F6" />
            <Text style={styles.actionText}>Take Medication</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="fitness" size={24} color="#3B82F6" />
            <Text style={styles.actionText}>Log Vitals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart" size={24} color="#3B82F6" />
            <Text style={styles.actionText}>Log Symptoms</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Upcoming Appointments */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(500)}
      >
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        {upcomingAppointments.map((appointment, index) => (
          <View key={index} style={styles.appointmentCard}>
            <View style={styles.appointmentContent}>
              <Text style={styles.appointmentTitle}>{appointment.title}</Text>
              <Text style={styles.appointmentDate}>{appointment.date}</Text>
              <View style={[styles.typeBadge, { backgroundColor: '#3B82F615' }]}>
                <Text style={[styles.typeText, { color: '#3B82F6' }]}>{appointment.type}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        ))}
      </Animated.View>

      {/* Medication Reminders */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(600)}
      >
        <Text style={styles.sectionTitle}>Medication Reminders</Text>
        <View style={styles.medicationReminder}>
          <View style={styles.reminderIcon}>
            <Ionicons name="time" size={24} color="#F59E0B" />
          </View>
          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>Next Dose</Text>
            <Text style={styles.reminderText}>Zofran 8mg at 4:00 PM</Text>
          </View>
          <TouchableOpacity style={styles.reminderButton}>
            <Text style={styles.reminderButtonText}>Mark Taken</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.todaysMeds}>
          <Text style={styles.todaysMedsTitle}>Today's Progress</Text>
          <View style={styles.medsProgress}>
            <Text style={styles.medsProgressText}>3 of 5 doses taken</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '60%' }]} />
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Health Vitals Summary */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(700)}
      >
        <Text style={styles.sectionTitle}>Latest Vitals</Text>
        <View style={styles.vitalsContainer}>
          <View style={styles.vitalItem}>
            <View style={[styles.vitalIcon, { backgroundColor: '#EF444415' }]}>
              <Ionicons name="heart" size={20} color="#EF4444" />
            </View>
            <View style={styles.vitalInfo}>
              <Text style={styles.vitalLabel}>Blood Pressure</Text>
              <Text style={styles.vitalValue}>120/80 mmHg</Text>
              <Text style={styles.vitalTime}>2 hours ago</Text>
            </View>
          </View>
          
          <View style={styles.vitalItem}>
            <View style={[styles.vitalIcon, { backgroundColor: '#F59E0B15' }]}>
              <Ionicons name="pulse" size={20} color="#F59E0B" />
            </View>
            <View style={styles.vitalInfo}>
              <Text style={styles.vitalLabel}>Heart Rate</Text>
              <Text style={styles.vitalValue}>72 bpm</Text>
              <Text style={styles.vitalTime}>3 hours ago</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Treatment Progress */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(800)}
      >
        <Text style={styles.sectionTitle}>Treatment Progress</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>Current Cycle</Text>
            <Text style={styles.progressValue}>3 of 6</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
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
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
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
  actionText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  appointmentDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  medicationReminder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  reminderIcon: {
    marginRight: 12,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 2,
  },
  reminderText: {
    fontSize: 16,
    color: '#92400E',
  },
  reminderButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  reminderButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  todaysMeds: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todaysMedsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  medsProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  medsProgressText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 16,
  },
  vitalsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vitalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vitalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vitalInfo: {
    flex: 1,
  },
  vitalLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  vitalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  vitalTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});