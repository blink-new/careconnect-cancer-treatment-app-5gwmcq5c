import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface VitalReading {
  id: string;
  type: string;
  value: string;
  unit: string;
  timestamp: string;
  source: string;
  normal: boolean;
}

interface HealthDevice {
  id: string;
  name: string;
  type: string;
  connected: boolean;
  lastSync: string;
  batteryLevel?: number;
}

const { width } = Dimensions.get('window');

export default function VitalsMonitoring() {
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [newReading, setNewReading] = useState({
    type: '',
    value: '',
    notes: ''
  });

  const periods = ['Today', 'Week', 'Month', '3 Months'];

  const vitalTypes = [
    { id: 'blood_pressure', name: 'Blood Pressure', icon: 'heart', color: '#EF4444', unit: 'mmHg' },
    { id: 'heart_rate', name: 'Heart Rate', icon: 'pulse', color: '#F59E0B', unit: 'bpm' },
    { id: 'temperature', name: 'Temperature', icon: 'thermometer', color: '#8B5CF6', unit: '°F' },
    { id: 'weight', name: 'Weight', icon: 'scale', color: '#10B981', unit: 'lbs' },
    { id: 'oxygen', name: 'Oxygen Saturation', icon: 'fitness', color: '#3B82F6', unit: '%' },
    { id: 'glucose', name: 'Blood Glucose', icon: 'water', color: '#EC4899', unit: 'mg/dL' },
  ];

  const recentReadings: VitalReading[] = [
    { id: '1', type: 'Blood Pressure', value: '120/80', unit: 'mmHg', timestamp: '2 hours ago', source: 'Manual Entry', normal: true },
    { id: '2', type: 'Heart Rate', value: '72', unit: 'bpm', timestamp: '3 hours ago', source: 'Apple Watch', normal: true },
    { id: '3', type: 'Weight', value: '165', unit: 'lbs', timestamp: 'This morning', source: 'Smart Scale', normal: true },
    { id: '4', type: 'Temperature', value: '98.6', unit: '°F', timestamp: 'Yesterday', source: 'Manual Entry', normal: true },
    { id: '5', type: 'Oxygen Saturation', value: '97', unit: '%', timestamp: 'Yesterday', source: 'Pulse Oximeter', normal: false },
  ];

  const connectedDevices: HealthDevice[] = [
    { id: '1', name: 'Apple Watch Series 9', type: 'Smartwatch', connected: true, lastSync: '5 minutes ago', batteryLevel: 85 },
    { id: '2', name: 'Withings Body+ Scale', type: 'Smart Scale', connected: true, lastSync: '2 hours ago', batteryLevel: 92 },
    { id: '3', name: 'Omron Blood Pressure Monitor', type: 'BP Monitor', connected: false, lastSync: '2 days ago' },
    { id: '4', name: 'Fitbit Charge 5', type: 'Fitness Tracker', connected: true, lastSync: '1 hour ago', batteryLevel: 67 },
  ];

  const todaysStats = [
    { label: 'Readings Today', value: '8', icon: 'analytics', color: '#3B82F6' },
    { label: 'Devices Synced', value: '3', icon: 'bluetooth', color: '#10B981' },
    { label: 'Avg Heart Rate', value: '74 bpm', icon: 'pulse', color: '#F59E0B' },
    { label: 'Last BP', value: '120/80', icon: 'heart', color: '#EF4444' },
  ];

  const addReading = () => {
    if (!newReading.type || !newReading.value) {
      Alert.alert('Missing Information', 'Please select a vital type and enter a value.');
      return;
    }

    Alert.alert('Success', 'Vital reading added successfully!');
    setNewReading({ type: '', value: '', notes: '' });
    setShowAddModal(false);
  };

  const connectDevice = (deviceId: string) => {
    Alert.alert(
      'Connect Device',
      'This would normally open the device pairing interface. For demo purposes, this device is now connected.',
      [{ text: 'OK' }]
    );
  };

  const syncDevice = (deviceId: string) => {
    Alert.alert(
      'Syncing Device',
      'Syncing data from your device...',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Vitals</Text>
        <Text style={styles.subtitle}>Monitor your health metrics and device data</Text>
      </View>

      {/* Period Selector */}
      <Animated.View 
        style={styles.periodSelector}
        entering={FadeInDown.duration(400).delay(100)}
      >
        {periods.map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodText,
              selectedPeriod === period && styles.periodTextActive
            ]}>
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Quick Stats */}
      <Animated.View 
        style={styles.statsContainer}
        entering={FadeInDown.duration(400).delay(200)}
      >
        {todaysStats.map((stat, index) => (
          <View key={stat.label} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
              <Ionicons name={stat.icon as any} size={20} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(300)}
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add-circle" size={24} color="#3B82F6" />
            <Text style={styles.actionText}>Add Reading</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowDevicesModal(true)}
          >
            <Ionicons name="bluetooth" size={24} color="#3B82F6" />
            <Text style={styles.actionText}>Manage Devices</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share" size={24} color="#3B82F6" />
            <Text style={styles.actionText}>Share Report</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Vital Types Grid */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(400)}
      >
        <Text style={styles.sectionTitle}>Track Vitals</Text>
        <View style={styles.vitalsGrid}>
          {vitalTypes.map((vital) => (
            <TouchableOpacity key={vital.id} style={styles.vitalCard}>
              <View style={[styles.vitalIcon, { backgroundColor: `${vital.color}15` }]}>
                <Ionicons name={vital.icon as any} size={24} color={vital.color} />
              </View>
              <Text style={styles.vitalName}>{vital.name}</Text>
              <Text style={styles.vitalUnit}>{vital.unit}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Recent Readings */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(500)}
      >
        <Text style={styles.sectionTitle}>Recent Readings</Text>
        {recentReadings.map((reading) => (
          <View key={reading.id} style={styles.readingCard}>
            <View style={styles.readingInfo}>
              <Text style={styles.readingType}>{reading.type}</Text>
              <Text style={styles.readingValue}>
                {reading.value} {reading.unit}
              </Text>
              <Text style={styles.readingTime}>{reading.timestamp} • {reading.source}</Text>
            </View>
            <View style={[
              styles.readingStatus,
              { backgroundColor: reading.normal ? '#10B98115' : '#EF444415' }
            ]}>
              <Ionicons 
                name={reading.normal ? "checkmark-circle" : "warning"} 
                size={20} 
                color={reading.normal ? "#10B981" : "#EF4444"} 
              />
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Connected Devices */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(600)}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Connected Devices</Text>
          <TouchableOpacity onPress={() => setShowDevicesModal(true)}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {connectedDevices.slice(0, 2).map((device) => (
          <View key={device.id} style={styles.deviceCard}>
            <View style={styles.deviceInfo}>
              <View style={styles.deviceHeader}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <View style={[
                  styles.deviceStatus,
                  { backgroundColor: device.connected ? '#10B98115' : '#EF444415' }
                ]}>
                  <View style={[
                    styles.deviceStatusDot,
                    { backgroundColor: device.connected ? '#10B981' : '#EF4444' }
                  ]} />
                  <Text style={[
                    styles.deviceStatusText,
                    { color: device.connected ? '#10B981' : '#EF4444' }
                  ]}>
                    {device.connected ? 'Connected' : 'Disconnected'}
                  </Text>
                </View>
              </View>
              <Text style={styles.deviceType}>{device.type}</Text>
              <Text style={styles.deviceSync}>Last sync: {device.lastSync}</Text>
            </View>
            {device.batteryLevel && (
              <View style={styles.batteryContainer}>
                <Ionicons name="battery-half" size={16} color="#6B7280" />
                <Text style={styles.batteryText}>{device.batteryLevel}%</Text>
              </View>
            )}
          </View>
        ))}
      </Animated.View>

      {/* Add Reading Modal */}
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
            <Text style={styles.modalTitle}>Add Vital Reading</Text>
            <TouchableOpacity onPress={addReading}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Vital Type *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeSelector}>
                {vitalTypes.map((vital) => (
                  <TouchableOpacity
                    key={vital.id}
                    style={[
                      styles.typeOption,
                      newReading.type === vital.name && styles.typeOptionSelected
                    ]}
                    onPress={() => setNewReading({...newReading, type: vital.name})}
                  >
                    <Ionicons name={vital.icon as any} size={20} color={vital.color} />
                    <Text style={styles.typeOptionText}>{vital.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Value *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter reading value"
                value={newReading.value}
                onChangeText={(text) => setNewReading({...newReading, value: text})}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Any additional notes about this reading..."
                value={newReading.notes}
                onChangeText={(text) => setNewReading({...newReading, notes: text})}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Devices Modal */}
      <Modal
        visible={showDevicesModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowDevicesModal(false)}>
              <Text style={styles.modalCancel}>Done</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Health Devices</Text>
            <TouchableOpacity>
              <Text style={styles.modalSave}>Add Device</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {connectedDevices.map((device) => (
              <View key={device.id} style={styles.deviceModalCard}>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceType}>{device.type}</Text>
                  <Text style={styles.deviceSync}>Last sync: {device.lastSync}</Text>
                </View>
                
                <View style={styles.deviceActions}>
                  <View style={[
                    styles.deviceStatus,
                    { backgroundColor: device.connected ? '#10B98115' : '#EF444415' }
                  ]}>
                    <View style={[
                      styles.deviceStatusDot,
                      { backgroundColor: device.connected ? '#10B981' : '#EF4444' }
                    ]} />
                    <Text style={[
                      styles.deviceStatusText,
                      { color: device.connected ? '#10B981' : '#EF4444' }
                    ]}>
                      {device.connected ? 'Connected' : 'Disconnected'}
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.deviceActionButton}
                    onPress={() => device.connected ? syncDevice(device.id) : connectDevice(device.id)}
                  >
                    <Text style={styles.deviceActionText}>
                      {device.connected ? 'Sync' : 'Connect'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#3B82F6',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
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
    color: '#1F2937',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
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
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vitalCard: {
    width: (width - 60) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vitalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  vitalName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 2,
  },
  vitalUnit: {
    fontSize: 10,
    color: '#6B7280',
  },
  readingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  readingInfo: {
    flex: 1,
  },
  readingType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  readingValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
  },
  readingTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  readingStatus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  deviceType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  deviceSync: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  deviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deviceStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  deviceStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
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
    color: '#1F2937',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
  },
  typeOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  typeOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF4FF',
  },
  typeOptionText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 4,
    textAlign: 'center',
  },
  deviceModalCard: {
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
  deviceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  deviceActionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deviceActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});