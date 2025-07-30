import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const [patientName, setPatientName] = useState('Sarah');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const healthMetrics = [
    { 
      title: 'Weight balance', 
      value: '73', 
      unit: 'kg',
      subtitle: '60 kg - 70 kg',
      detail: '178 cm height',
      icon: 'scale-outline', 
      color: '#3B82F6',
      chart: [0.6, 0.8, 0.4, 0.9, 0.7, 0.5, 0.8]
    },
    { 
      title: 'Heart rate', 
      value: '90', 
      unit: 'bpm',
      subtitle: '60-100 beats per min',
      icon: 'pulse', 
      color: '#3B82F6',
      chart: [0.7, 0.9, 0.6, 0.8, 0.9, 0.7, 0.8, 0.6]
    },
    { 
      title: 'Hydration level', 
      value: '86', 
      unit: '%',
      subtitle: '100ml mineral water',
      detail: '2L per day',
      icon: 'water', 
      color: '#3B82F6',
      bgColor: '#3B82F6'
    },
    { 
      title: 'Blood cells', 
      value: '1100', 
      unit: '',
      subtitle: 'Heart rate',
      detail: 'Heart rate',
      icon: 'medical', 
      color: '#EF4444',
      chart: [0.5, 0.7, 0.6, 0.8, 0.9, 0.7, 0.6, 0.8]
    },
  ];

  const upcomingAppointments = [
    { 
      title: 'Dr. Arcadius Phina', 
      subtitle: 'Orthopedia doctor',
      time: '11:00 AM',
      endTime: '13:00 PM',
      patients: [
        { name: 'Yanto Pecol', age: '32 years', avatar: '👨' },
        { name: 'Alex Galon', age: '55 years', avatar: '👨‍🦳' }
      ]
    }
  ];

  const sleepData = {
    avgSleep: '6.2',
    deepSleep: '1.6',
    chartData: [
      { month: 'Feb', hours: 6 },
      { month: 'Mar', hours: 7 },
      { month: 'Apr', hours: 6.5 },
      { month: 'May', hours: 8 },
      { month: 'Jun', hours: 7.5 },
      { month: 'Jul', hours: 8.5 }
    ]
  };

  const MiniChart = ({ data, color = '#3B82F6', height = 40 }) => (
    <View style={[styles.miniChart, { height }]}>
      {data.map((value, index) => (
        <View
          key={index}
          style={[
            styles.chartBar,
            {
              height: `${value * 100}%`,
              backgroundColor: color,
              opacity: 0.7 + (value * 0.3)
            }
          ]}
        />
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Dark Header */}
      <View style={styles.header}>
        <Animated.View 
          style={styles.headerContent}
          entering={FadeInUp.duration(600)}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Daily healthy overview</Text>
              <Text style={styles.headerDate}>
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  day: 'numeric',
                  month: 'long'
                })}
              </Text>
              <Text style={styles.headerTime}>11:00 AM</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Health Metrics Grid */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricsGrid}>
          {healthMetrics.map((metric, index) => (
            <Animated.View
              key={metric.title}
              style={[
                styles.metricCard,
                index === 2 && styles.hydrationCard, // Special styling for hydration
                { width: index < 2 ? (width - 60) / 2 : width - 40 }
              ]}
              entering={FadeInDown.duration(500).delay(index * 150)}
            >
              <TouchableOpacity style={styles.metricContent}>
                {index < 2 ? (
                  // Weight and Heart Rate cards
                  <>
                    <View style={styles.metricHeader}>
                      <Text style={styles.metricTitle}>{metric.title}</Text>
                      <View style={styles.metricValueContainer}>
                        <Text style={styles.metricValue}>{metric.value}</Text>
                        <Text style={styles.metricUnit}>{metric.unit}</Text>
                      </View>
                    </View>
                    <Text style={styles.metricSubtitle}>{metric.subtitle}</Text>
                    {metric.detail && <Text style={styles.metricDetail}>{metric.detail}</Text>}
                    {metric.chart && (
                      <View style={styles.chartContainer}>
                        <MiniChart data={metric.chart} color={metric.color} height={30} />
                      </View>
                    )}
                  </>
                ) : index === 2 ? (
                  // Hydration card (blue background)
                  <>
                    <View style={styles.hydrationHeader}>
                      <Text style={styles.hydrationTitle}>{metric.title}</Text>
                      <View style={styles.hydrationValueContainer}>
                        <Text style={styles.hydrationValue}>{metric.value}</Text>
                        <Text style={styles.hydrationUnit}>{metric.unit}</Text>
                      </View>
                    </View>
                    <Text style={styles.hydrationSubtitle}>{metric.subtitle}</Text>
                    <Text style={styles.hydrationDetail}>{metric.detail}</Text>
                  </>
                ) : (
                  // Blood cells card
                  <>
                    <View style={styles.metricHeader}>
                      <Text style={styles.metricTitle}>{metric.title}</Text>
                      <View style={styles.metricValueContainer}>
                        <Text style={styles.metricValue}>{metric.value}</Text>
                      </View>
                    </View>
                    <Text style={styles.metricSubtitle}>{metric.subtitle}</Text>
                    <Text style={styles.metricDetail}>{metric.detail}</Text>
                    {metric.chart && (
                      <View style={styles.chartContainer}>
                        <MiniChart data={metric.chart} color={metric.color} height={30} />
                      </View>
                    )}
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Sleep Section */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(600)}
      >
        <View style={styles.sleepCard}>
          <View style={styles.sleepHeader}>
            <View style={styles.sleepIcon}>
              <Ionicons name="moon" size={20} color="#3B82F6" />
            </View>
            <Text style={styles.sleepTitle}>Sleep periodic</Text>
            <TouchableOpacity style={styles.monthlyButton}>
              <Text style={styles.monthlyText}>Monthly</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.sleepSubtitle}>Control your sleep to create great habbit</Text>
          
          <View style={styles.sleepStats}>
            <View style={styles.sleepStat}>
              <Text style={styles.sleepStatLabel}>Avg your sleep</Text>
              <Text style={styles.sleepStatValue}>{sleepData.avgSleep}</Text>
              <Text style={styles.sleepStatUnit}>Hours</Text>
              <Text style={styles.sleepTimeRange}>10 hours</Text>
            </View>
            
            <View style={styles.sleepChart}>
              {sleepData.chartData.map((item, index) => (
                <View key={item.month} style={styles.sleepChartItem}>
                  <View 
                    style={[
                      styles.sleepBar, 
                      { 
                        height: (item.hours / 10) * 80,
                        backgroundColor: index === 4 ? '#3B82F6' : '#E5E7EB'
                      }
                    ]} 
                  />
                  <Text style={styles.sleepBarLabel}>{item.month}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.deepSleepStat}>
              <View style={styles.deepSleepIcon}>
                <Ionicons name="moon" size={16} color="#3B82F6" />
              </View>
              <Text style={styles.deepSleepLabel}>Deep Sleep</Text>
              <Text style={styles.deepSleepValue}>{sleepData.deepSleep}</Text>
              <Text style={styles.deepSleepUnit}>Hours</Text>
              <Text style={styles.deepSleepRange}>6 hours</Text>
              <Text style={styles.deepSleepRange}>4 hours</Text>
              <Text style={styles.deepSleepRange}>2 hours</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Doctor's Appointment */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(700)}
      >
        <View style={styles.appointmentSection}>
          <Text style={styles.appointmentSectionTitle}>Doctor's appointment</Text>
          <Text style={styles.appointmentSectionSubtitle}>prepared to discuss with doctor</Text>
          <Text style={styles.appointmentSectionSubtitle}>Available date to consultations</Text>
          
          {/* Calendar */}
          <View style={styles.calendar}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity>
                <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.calendarGrid}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 26, 27, 28, 29, 30, 1].map((day, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={[
                      styles.calendarDay,
                      day === 4 && styles.selectedDay,
                      (day === 14 || day === 15) && styles.bookedDay,
                      day > 25 && index > 20 && styles.nextMonthDay
                    ]}
                  >
                    <Text style={[
                      styles.calendarDayText,
                      day === 4 && styles.selectedDayText,
                      (day === 14 || day === 15) && styles.bookedDayText,
                      day > 25 && index > 20 && styles.nextMonthDayText
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.calendarLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FFFFFF' }]} />
                <Text style={styles.legendText}>Available</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#6B7280' }]} />
                <Text style={styles.legendText}>Full booked</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#374151' }]} />
                <Text style={styles.legendText}>Not available</Text>
              </View>
            </View>
          </View>

          {/* Doctor Info */}
          <View style={styles.doctorInfo}>
            <View style={styles.doctorAvatar}>
              <Text style={styles.doctorAvatarText}>Dr</Text>
            </View>
            <View style={styles.doctorDetails}>
              <Text style={styles.doctorName}>Dr. Arcadius Phina</Text>
              <Text style={styles.doctorSpecialty}>Orthopedia doctor</Text>
            </View>
          </View>

          {/* Patients Today */}
          <View style={styles.patientsToday}>
            <Text style={styles.patientsTodayTitle}>Our patient today</Text>
            <View style={styles.timeSlots}>
              <View style={styles.timeSlot}>
                <Text style={styles.timeSlotTime}>11.00 AM</Text>
                <View style={styles.patientCard}>
                  <Text style={styles.patientAvatar}>👨</Text>
                  <View>
                    <Text style={styles.patientName}>Yanto Pecol</Text>
                    <Text style={styles.patientAge}>32 years</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.timeSlot}>
                <Text style={styles.timeSlotTime}>13.00 PM</Text>
                <View style={styles.patientCard}>
                  <Text style={styles.patientAvatar}>👨‍🦳</Text>
                  <View>
                    <Text style={styles.patientName}>Alex Galon</Text>
                    <Text style={styles.patientAge}>55 years</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="mail" size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="call" size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Book Consultations</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Blood Tracking */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(800)}
      >
        <View style={styles.bloodTrackingCard}>
          <View style={styles.bloodTrackingHeader}>
            <Text style={styles.bloodTrackingTitle}>Blood tracking</Text>
            <Text style={styles.bloodTrackingSubtitle}>Orthopedic Doctors</Text>
            <TouchableOpacity style={styles.todayButton}>
              <Text style={styles.todayText}>Today</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          {/* Blood tracking dots visualization */}
          <View style={styles.bloodDots}>
            {Array.from({ length: 70 }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.bloodDot,
                  {
                    backgroundColor: Math.random() > 0.7 ? '#3B82F6' : 
                                   Math.random() > 0.5 ? '#60A5FA' : '#E5E7EB'
                  }
                ]}
              />
            ))}
          </View>
          
          <View style={styles.bloodLegend}>
            <View style={styles.bloodLegendItem}>
              <View style={[styles.bloodLegendDot, { backgroundColor: '#6B7280' }]} />
              <Text style={styles.bloodLegendText}>Cholesterol levels</Text>
            </View>
            <View style={styles.bloodLegendItem}>
              <View style={[styles.bloodLegendDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={styles.bloodLegendText}>Iron levels</Text>
            </View>
            <View style={styles.bloodLegendItem}>
              <View style={[styles.bloodLegendDot, { backgroundColor: '#60A5FA' }]} />
              <Text style={styles.bloodLegendText}>Sugar level</Text>
            </View>
            <View style={styles.bloodLegendItem}>
              <View style={[styles.bloodLegendDot, { backgroundColor: '#374151' }]} />
              <Text style={styles.bloodLegendText}>Heart rate</Text>
            </View>
          </View>
          
          {/* Blood values */}
          <View style={styles.bloodValues}>
            <Text style={styles.bloodValue}>180 mcg</Text>
            <Text style={styles.bloodValue}>160 mcg</Text>
            <Text style={styles.bloodValue}>78 mcg</Text>
            <Text style={styles.bloodValue}>97 mcg</Text>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B', // Dark background
  },
  header: {
    backgroundColor: '#1E293B',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerDate: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 4,
  },
  headerTime: {
    fontSize: 14,
    color: '#64748B',
  },
  metricsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  hydrationCard: {
    backgroundColor: '#3B82F6',
    marginTop: 16,
  },
  metricContent: {
    flex: 1,
  },
  metricHeader: {
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
  },
  metricUnit: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 4,
  },
  metricSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  metricDetail: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  chartContainer: {
    marginTop: 12,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  chartBar: {
    width: 8,
    borderRadius: 4,
    minHeight: 4,
  },
  // Hydration card specific styles
  hydrationHeader: {
    marginBottom: 8,
  },
  hydrationTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '500',
  },
  hydrationValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  hydrationValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hydrationUnit: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  hydrationSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  hydrationDetail: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sleepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  sleepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sleepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sleepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  monthlyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  monthlyText: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 4,
  },
  sleepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  sleepStats: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  sleepStat: {
    marginRight: 20,
  },
  sleepStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  sleepStatValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
  },
  sleepStatUnit: {
    fontSize: 14,
    color: '#6B7280',
  },
  sleepTimeRange: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  sleepChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
    height: 80,
    marginHorizontal: 20,
  },
  sleepChartItem: {
    alignItems: 'center',
    flex: 1,
  },
  sleepBar: {
    width: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  sleepBarLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  deepSleepStat: {
    alignItems: 'flex-end',
  },
  deepSleepIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  deepSleepLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  deepSleepValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  deepSleepUnit: {
    fontSize: 12,
    color: '#6B7280',
  },
  deepSleepRange: {
    fontSize: 8,
    color: '#9CA3AF',
    marginTop: 1,
  },
  appointmentSection: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
  },
  appointmentSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  appointmentSectionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 2,
  },
  calendar: {
    marginTop: 20,
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width - 120,
    justifyContent: 'space-between',
  },
  calendarDay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedDay: {
    backgroundColor: '#FFFFFF',
  },
  bookedDay: {
    backgroundColor: '#6B7280',
  },
  nextMonthDay: {
    opacity: 0.5,
  },
  calendarDayText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  selectedDayText: {
    color: '#1E293B',
    fontWeight: '600',
  },
  bookedDayText: {
    color: '#FFFFFF',
  },
  nextMonthDayText: {
    color: '#94A3B8',
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  doctorAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 12,
    color: '#94A3B8',
  },
  patientsToday: {
    marginBottom: 20,
  },
  patientsTodayTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  timeSlots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeSlot: {
    flex: 1,
    marginHorizontal: 4,
  },
  timeSlotTime: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
    textAlign: 'center',
  },
  patientCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientAvatar: {
    fontSize: 20,
    marginRight: 8,
  },
  patientName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  patientAge: {
    fontSize: 10,
    color: '#94A3B8',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 22,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bloodTrackingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 40,
  },
  bloodTrackingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bloodTrackingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  bloodTrackingSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 12,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  todayText: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 4,
  },
  bloodDots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bloodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 2,
  },
  bloodLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bloodLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bloodLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  bloodLegendText: {
    fontSize: 10,
    color: '#6B7280',
  },
  bloodValues: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bloodValue: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});