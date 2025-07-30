import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withTiming, withSpring, interpolateColor } from 'react-native-reanimated';
import { LineChart, BarChart, ProgressChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

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

export default function VitalsMonitoring() {
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [selectedVital, setSelectedVital] = useState('heart_rate');
  const [newReading, setNewReading] = useState({
    type: '',
    value: '',
    notes: ''
  });

  // Animation values
  const heartRateValue = useSharedValue(0);
  const bloodPressureValue = useSharedValue(0);
  const temperatureValue = useSharedValue(0);
  const oxygenValue = useSharedValue(0);

  useEffect(() => {
    // Animate vital signs on load
    heartRateValue.value = withTiming(72, { duration: 1500 });
    bloodPressureValue.value = withTiming(120, { duration: 1500 });
    temperatureValue.value = withTiming(98.6, { duration: 1500 });
    oxygenValue.value = withTiming(97, { duration: 1500 });

    // Simulate real-time heart rate
    const interval = setInterval(() => {
      heartRateValue.value = withSpring(70 + Math.random() * 10);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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

  // Chart data for different vitals
  const getChartData = (vitalType: string) => {
    const baseData = {
      heart_rate: {
        labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
        datasets: [{
          data: [68, 72, 75, 78, 74, 70],
          color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
          strokeWidth: 3,
        }]
      },
      blood_pressure: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
          data: [118, 122, 120, 125, 119, 121],
          color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
          strokeWidth: 3,
        }]
      },
      temperature: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
        datasets: [{
          data: [98.4, 98.6, 98.8, 98.5, 98.7, 98.6],
          color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
          strokeWidth: 3,
        }]
      },
      oxygen: {
        labels: ['6AM', '12PM', '6PM', '12AM'],
        datasets: [{
          data: [97, 98, 96, 97],
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          strokeWidth: 3,
        }]
      }
    };
    return baseData[vitalType] || baseData.heart_rate;
  };

  const todaysStats = [
    { label: 'Readings Today', value: '8', icon: 'analytics', color: '#3B82F6' },
    { label: 'Devices Synced', value: '3', icon: 'bluetooth', color: '#10B981' },
    { label: 'Avg Heart Rate', value: '74 bpm', icon: 'pulse', color: '#F59E0B' },
    { label: 'Last BP', value: '120/80', icon: 'heart', color: '#EF4444' },
  ];

  const chartConfig = {
    backgroundColor: '#1E293B',
    backgroundGradientFrom: '#1E293B',
    backgroundGradientTo: '#334155',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#3B82F6',
    },
  };

  const animatedHeartRate = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 + (heartRateValue.value - 70) * 0.01) }],
  }));

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
        entering={FadeInDown.duration(600).delay(100)}
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

      {/* Real-time Vitals Dashboard */}
      <Animated.View 
        style={styles.vitalsGrid}
        entering={FadeInDown.duration(600).delay(200)}
      >
        <Animated.View style={[styles.vitalCard, styles.heartRateCard, animatedHeartRate]}>
          <View style={styles.vitalIcon}>
            <Ionicons name="pulse" size={24} color="#F59E0B" />
          </View>
          <Text style={styles.vitalValue}>72</Text>
          <Text style={styles.vitalUnit}>bpm</Text>
          <Text style={styles.vitalLabel}>Heart Rate</Text>
          <View style={styles.vitalTrend}>
            <Ionicons name="trending-up" size={16} color="#10B981" />
            <Text style={styles.trendText}>+2%</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.vitalCard, styles.bloodPressureCard]}>
          <View style={styles.vitalIcon}>
            <Ionicons name="heart" size={24} color="#EF4444" />
          </View>
          <Text style={styles.vitalValue}>120/80</Text>
          <Text style={styles.vitalUnit}>mmHg</Text>
          <Text style={styles.vitalLabel}>Blood Pressure</Text>
          <View style={styles.vitalTrend}>
            <Ionicons name="remove" size={16} color="#6B7280" />
            <Text style={styles.trendText}>Normal</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.vitalCard, styles.temperatureCard]}>
          <View style={styles.vitalIcon}>
            <Ionicons name="thermometer" size={24} color="#8B5CF6" />
          </View>
          <Text style={styles.vitalValue}>98.6</Text>
          <Text style={styles.vitalUnit}>°F</Text>
          <Text style={styles.vitalLabel}>Temperature</Text>
          <View style={styles.vitalTrend}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.trendText}>Normal</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.vitalCard, styles.oxygenCard]}>
          <View style={styles.vitalIcon}>
            <Ionicons name="fitness" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.vitalValue}>97</Text>
          <Text style={styles.vitalUnit}>%</Text>
          <Text style={styles.vitalLabel}>Oxygen Sat</Text>
          <View style={styles.vitalTrend}>
            <Ionicons name="trending-down" size={16} color="#F59E0B" />
            <Text style={styles.trendText}>-1%</Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Interactive Chart */}
      <Animated.View 
        style={styles.chartContainer}
        entering={FadeInDown.duration(600).delay(400)}
      >
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Vital Trends</Text>
          <View style={styles.vitalSelector}>
            {vitalTypes.slice(0, 4).map((vital) => (
              <TouchableOpacity
                key={vital.id}
                style={[
                  styles.vitalSelectorButton,
                  selectedVital === vital.id && { backgroundColor: vital.color + '20', borderColor: vital.color }
                ]}
                onPress={() => setSelectedVital(vital.id)}
              >
                <Ionicons name={vital.icon as any} size={16} color={vital.color} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <LineChart
          data={getChartData(selectedVital)}
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

      {/* Quick Actions */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(600).delay(600)}
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

      {/* Recent Readings */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(600).delay(800)}
      >
        <Text style={styles.sectionTitle}>Recent Readings</Text>
        {recentReadings.map((reading, index) => (
          <Animated.View
            key={reading.id}
            style={styles.readingCard}
            entering={FadeInDown.duration(400).delay(900 + index * 100)}
          >
            <View style={styles.readingInfo}>
              <Text style={styles.readingType}>{reading.type}</Text>
              <Text style={styles.readingValue}>
                {reading.value} {reading.unit}
              </Text>
              <Text style={styles.readingTime}>{reading.timestamp} • {reading.source}</Text>
            </View>
            <View style={[
              styles.readingStatus,
              { backgroundColor: reading.normal ? '#10B98120' : '#EF444420' }
            ]}>
              <Ionicons 
                name={reading.normal ? "checkmark-circle" : "warning"} 
                size={20} 
                color={reading.normal ? "#10B981" : "#EF4444"} 
              />
            </View>
          </Animated.View>
        ))}
      </Animated.View>

      {/* Connected Devices */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(600).delay(1200)}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Connected Devices</Text>
          <TouchableOpacity onPress={() => setShowDevicesModal(true)}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {connectedDevices.slice(0, 2).map((device, index) => (
          <Animated.View
            key={device.id}
            style={styles.deviceCard}
            entering={FadeInDown.duration(400).delay(1300 + index * 100)}
          >
            <View style={styles.deviceInfo}>
              <View style={styles.deviceHeader}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <View style={[
                  styles.deviceStatus,
                  { backgroundColor: device.connected ? '#10B98120' : '#EF444420' }
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
                <Ionicons name="battery-half" size={16} color="#94A3B8" />
                <Text style={styles.batteryText}>{device.batteryLevel}%</Text>
              </View>
            )}
          </Animated.View>
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
                placeholderTextColor="#64748B"
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
                placeholderTextColor="#64748B"
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
                    { backgroundColor: device.connected ? '#10B98120' : '#EF444420' }
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
    backgroundColor: '#334155',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#3B82F6',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  vitalCard: {
    width: (width - 60) / 2,
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 16,
    margin: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heartRateCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  bloodPressureCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  temperatureCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  oxygenCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  vitalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  vitalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  vitalUnit: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
  },
  vitalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 8,
  },
  vitalTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 4,
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
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  vitalSelector: {
    flexDirection: 'row',
  },
  vitalSelectorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#475569',
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
  actionText: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 8,
    textAlign: 'center',
  },
  readingCard: {
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
  readingInfo: {
    flex: 1,
  },
  readingType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
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
    color: '#94A3B8',
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
    color: '#F8FAFC',
    flex: 1,
  },
  deviceType: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 2,
  },
  deviceSync: {
    fontSize: 12,
    color: '#64748B',
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
    color: '#94A3B8',
    marginLeft: 4,
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
  typeSelector: {
    flexDirection: 'row',
  },
  typeOption: {
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  typeOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E40AF20',
  },
  typeOptionText: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 4,
    textAlign: 'center',
  },
  deviceModalCard: {
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