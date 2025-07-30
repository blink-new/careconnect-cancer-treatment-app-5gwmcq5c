import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Switch, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';
import { LineChart, ProgressChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  instructions: string;
  reminderEnabled: boolean;
  taken: boolean;
  nextDose: string;
  adherenceRate: number;
}

export default function MedicationTracker() {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Zofran (Ondansetron)',
      dosage: '8mg',
      frequency: 'Every 8 hours',
      times: ['08:00', '16:00', '00:00'],
      startDate: '2024-01-15',
      instructions: 'Take with or without food. For nausea prevention.',
      reminderEnabled: true,
      taken: false,
      nextDose: '16:00',
      adherenceRate: 0.92
    },
    {
      id: '2',
      name: 'Metoclopramide',
      dosage: '10mg',
      frequency: 'Before meals',
      times: ['07:30', '12:30', '18:30'],
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      instructions: 'Take 30 minutes before meals.',
      reminderEnabled: true,
      taken: true,
      nextDose: '18:30',
      adherenceRate: 0.88
    },
    {
      id: '3',
      name: 'Lorazepam',
      dosage: '0.5mg',
      frequency: 'As needed',
      times: [],
      startDate: '2024-01-01',
      instructions: 'For anxiety. Do not exceed 2mg per day.',
      reminderEnabled: false,
      taken: false,
      nextDose: 'As needed',
      adherenceRate: 0.75
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    instructions: '',
    reminderEnabled: true
  });

  // Animation values
  const progressValue = useSharedValue(0);
  const pulseValue = useSharedValue(1);

  useEffect(() => {
    progressValue.value = withTiming(0.85, { duration: 1500 });
    
    // Pulse animation for next dose
    const pulse = () => {
      pulseValue.value = withSpring(1.1, {}, () => {
        pulseValue.value = withSpring(1);
      });
    };
    
    const interval = setInterval(pulse, 3000);
    return () => clearInterval(interval);
  }, []);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: progressValue.value }],
    opacity: progressValue.value,
  }));

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  const todaysDoses = [
    { id: '1', medication: 'Zofran', time: '08:00', taken: true, dosage: '8mg' },
    { id: '2', medication: 'Metoclopramide', time: '12:30', taken: true, dosage: '10mg' },
    { id: '3', medication: 'Zofran', time: '16:00', taken: false, dosage: '8mg', isNext: true },
    { id: '4', medication: 'Metoclopramide', time: '18:30', taken: false, dosage: '10mg' },
    { id: '5', medication: 'Zofran', time: '00:00', taken: false, dosage: '8mg' },
  ];

  // Adherence chart data
  const adherenceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [0.95, 0.88, 0.92, 0.85, 0.90, 0.87, 0.93],
      color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
      strokeWidth: 3,
    }]
  };

  const overallAdherence = {
    data: [0.88] // 88% adherence rate
  };

  const markAsTaken = (doseId: string) => {
    Alert.alert(
      'Medication Taken',
      'Great! Your medication has been logged.',
      [{ text: 'OK' }]
    );
  };

  const addMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      Alert.alert('Missing Information', 'Please fill in medication name and dosage.');
      return;
    }

    const medication: Medication = {
      id: Date.now().toString(),
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      times: [],
      startDate: new Date().toISOString().split('T')[0],
      instructions: newMedication.instructions,
      reminderEnabled: newMedication.reminderEnabled,
      taken: false,
      nextDose: 'Not scheduled',
      adherenceRate: 1.0
    };

    setMedications([...medications, medication]);
    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      instructions: '',
      reminderEnabled: true
    });
    setShowAddModal(false);
    Alert.alert('Success', 'Medication added successfully!');
  };

  const toggleReminder = (medicationId: string) => {
    setMedications(medications.map(med => 
      med.id === medicationId 
        ? { ...med, reminderEnabled: !med.reminderEnabled }
        : med
    ));
  };

  const chartConfig = {
    backgroundColor: '#1E293B',
    backgroundGradientFrom: '#1E293B',
    backgroundGradientTo: '#334155',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#10B981',
    },
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Medication Tracker</Text>
        <Text style={styles.subtitle}>Manage your medications and reminders</Text>
      </View>

      {/* Overall Adherence Card */}
      <Animated.View 
        style={styles.adherenceCard}
        entering={FadeInDown.duration(600).delay(100)}
      >
        <View style={styles.adherenceHeader}>
          <View style={styles.adherenceIcon}>
            <Ionicons name="medical" size={32} color="#10B981" />
          </View>
          <View style={styles.adherenceInfo}>
            <Text style={styles.adherenceTitle}>Medication Adherence</Text>
            <Text style={styles.adherenceSubtitle}>Last 7 days</Text>
          </View>
        </View>
        
        <Animated.View style={animatedProgressStyle}>
          <ProgressChart
            data={overallAdherence}
            width={120}
            height={120}
            strokeWidth={8}
            radius={32}
            chartConfig={{
              backgroundColor: '#1E293B',
              backgroundGradientFrom: '#1E293B',
              backgroundGradientTo: '#1E293B',
              color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
            }}
            hideLegend={true}
            style={styles.progressChart}
          />
          <View style={styles.adherencePercentage}>
            <Text style={styles.adherenceValue}>88%</Text>
            <Text style={styles.adherenceLabel}>Adherence</Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Next Dose Alert */}
      <Animated.View 
        style={[styles.nextDoseAlert, animatedPulseStyle]}
        entering={FadeInDown.duration(600).delay(200)}
      >
        <View style={styles.alertIcon}>
          <Ionicons name="time" size={24} color="#F59E0B" />
        </View>
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>Next Dose</Text>
          <Text style={styles.alertText}>Zofran 8mg at 4:00 PM</Text>
        </View>
        <TouchableOpacity style={styles.alertButton}>
          <Text style={styles.alertButtonText}>Set Reminder</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Adherence Trend Chart */}
      <Animated.View 
        style={styles.chartContainer}
        entering={FadeInDown.duration(600).delay(300)}
      >
        <Text style={styles.chartTitle}>Weekly Adherence Trend</Text>
        <LineChart
          data={adherenceData}
          width={width - 40}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          fromZero={false}
        />
      </Animated.View>

      {/* Today's Schedule */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(600).delay(400)}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          <Text style={styles.sectionSubtitle}>
            {todaysDoses.filter(d => d.taken).length} of {todaysDoses.length} doses taken
          </Text>
        </View>

        {todaysDoses.map((dose, index) => (
          <Animated.View
            key={dose.id}
            style={[
              styles.doseCard,
              dose.taken && styles.doseCardTaken,
              dose.isNext && styles.doseCardNext
            ]}
            entering={FadeInDown.duration(400).delay(500 + index * 100)}
          >
            <View style={styles.doseTime}>
              <Text style={[
                styles.doseTimeText,
                dose.taken && styles.doseTimeTextTaken
              ]}>
                {dose.time}
              </Text>
            </View>
            
            <View style={styles.doseInfo}>
              <Text style={[
                styles.doseMedication,
                dose.taken && styles.doseMedicationTaken
              ]}>
                {dose.medication}
              </Text>
              <Text style={[
                styles.doseDosage,
                dose.taken && styles.doseDosageTaken
              ]}>
                {dose.dosage}
              </Text>
            </View>

            <TouchableOpacity 
              style={[
                styles.doseButton,
                dose.taken && styles.doseButtonTaken
              ]}
              onPress={() => !dose.taken && markAsTaken(dose.id)}
              disabled={dose.taken}
            >
              <Ionicons 
                name={dose.taken ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color={dose.taken ? "#10B981" : "#64748B"} 
              />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </Animated.View>

      {/* My Medications */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(600).delay(800)}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Medications</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={20} color="#3B82F6" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {medications.map((medication, index) => (
          <Animated.View 
            key={medication.id} 
            style={styles.medicationCard}
            entering={FadeInDown.duration(400).delay(900 + index * 100)}
          >
            <View style={styles.medicationHeader}>
              <View style={styles.medicationInfo}>
                <Text style={styles.medicationName}>{medication.name}</Text>
                <Text style={styles.medicationDosage}>{medication.dosage} • {medication.frequency}</Text>
              </View>
              <View style={styles.medicationMeta}>
                <View style={styles.adherenceIndicator}>
                  <Text style={styles.adherenceRate}>{Math.round(medication.adherenceRate * 100)}%</Text>
                  <View style={[
                    styles.adherenceDot,
                    { backgroundColor: medication.adherenceRate >= 0.9 ? '#10B981' : medication.adherenceRate >= 0.8 ? '#F59E0B' : '#EF4444' }
                  ]} />
                </View>
                <Switch
                  value={medication.reminderEnabled}
                  onValueChange={() => toggleReminder(medication.id)}
                  trackColor={{ false: '#475569', true: '#3B82F6' }}
                  thumbColor={medication.reminderEnabled ? '#FFFFFF' : '#94A3B8'}
                />
              </View>
            </View>
            
            <Text style={styles.medicationInstructions}>{medication.instructions}</Text>
            
            <View style={styles.medicationFooter}>
              <View style={styles.medicationDates}>
                <Text style={styles.medicationDate}>Started: {medication.startDate}</Text>
                {medication.endDate && (
                  <Text style={styles.medicationDate}>Ends: {medication.endDate}</Text>
                )}
              </View>
              <Text style={styles.nextDoseText}>Next: {medication.nextDose}</Text>
            </View>
          </Animated.View>
        ))}
      </Animated.View>

      {/* Recent Activity */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(600).delay(1200)}
      >
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        <View style={styles.historyCard}>
          <View style={styles.historyItem}>
            <View style={styles.historyIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyText}>Took Metoclopramide 10mg</Text>
              <Text style={styles.historyTime}>12:30 PM • Today</Text>
            </View>
          </View>
          
          <View style={styles.historyItem}>
            <View style={styles.historyIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyText}>Took Zofran 8mg</Text>
              <Text style={styles.historyTime}>8:00 AM • Today</Text>
            </View>
          </View>
          
          <View style={styles.historyItem}>
            <View style={styles.historyIcon}>
              <Ionicons name="time" size={20} color="#F59E0B" />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyText}>Missed Zofran 8mg</Text>
              <Text style={styles.historyTime}>12:00 AM • Yesterday</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Add Medication Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Medication</Text>
            <TouchableOpacity onPress={addMedication}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Medication Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Zofran, Metoclopramide"
                placeholderTextColor="#64748B"
                value={newMedication.name}
                onChangeText={(text) => setNewMedication({...newMedication, name: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dosage *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 8mg, 10mg"
                placeholderTextColor="#64748B"
                value={newMedication.dosage}
                onChangeText={(text) => setNewMedication({...newMedication, dosage: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Frequency</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Every 8 hours, Before meals"
                placeholderTextColor="#64748B"
                value={newMedication.frequency}
                onChangeText={(text) => setNewMedication({...newMedication, frequency: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Instructions</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Special instructions, side effects to watch for, etc."
                placeholderTextColor="#64748B"
                value={newMedication.instructions}
                onChangeText={(text) => setNewMedication({...newMedication, instructions: text})}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.switchGroup}>
              <Text style={styles.inputLabel}>Enable Reminders</Text>
              <Switch
                value={newMedication.reminderEnabled}
                onValueChange={(value) => setNewMedication({...newMedication, reminderEnabled: value})}
                trackColor={{ false: '#475569', true: '#3B82F6' }}
                thumbColor={newMedication.reminderEnabled ? '#FFFFFF' : '#94A3B8'}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
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
  adherenceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  adherenceHeader: {
    flex: 1,
  },
  adherenceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B98120',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  adherenceInfo: {
    flex: 1,
  },
  adherenceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  adherenceSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  progressChart: {
    marginLeft: 20,
  },
  adherencePercentage: {
    position: 'absolute',
    right: 40,
    alignItems: 'center',
  },
  adherenceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
  },
  adherenceLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  nextDoseAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  alertIcon: {
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 2,
  },
  alertText: {
    fontSize: 16,
    color: '#92400E',
  },
  alertButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  alertButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chartContainer: {
    marginHorizontal: 20,
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E40AF20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 4,
  },
  doseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  doseCardTaken: {
    backgroundColor: '#065F4620',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  doseCardNext: {
    backgroundColor: '#92400E20',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  doseTime: {
    width: 60,
    marginRight: 16,
  },
  doseTimeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  doseTimeTextTaken: {
    color: '#10B981',
  },
  doseInfo: {
    flex: 1,
  },
  doseMedication: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  doseMedicationTaken: {
    color: '#10B981',
  },
  doseDosage: {
    fontSize: 14,
    color: '#94A3B8',
  },
  doseDosageTaken: {
    color: '#059669',
  },
  doseButton: {
    padding: 8,
  },
  doseButtonTaken: {
    opacity: 0.7,
  },
  medicationCard: {
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
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  medicationInfo: {
    flex: 1,
    marginRight: 16,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  medicationDosage: {
    fontSize: 14,
    color: '#94A3B8',
  },
  medicationMeta: {
    alignItems: 'flex-end',
  },
  adherenceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  adherenceRate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F8FAFC',
    marginRight: 6,
  },
  adherenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  medicationInstructions: {
    fontSize: 14,
    color: '#CBD5E1',
    marginBottom: 12,
    lineHeight: 20,
  },
  medicationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicationDates: {
    flex: 1,
  },
  medicationDate: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  nextDoseText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  historyCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyIcon: {
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 12,
    color: '#94A3B8',
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
  modalSave: {
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
    height: 80,
    textAlignVertical: 'top',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});