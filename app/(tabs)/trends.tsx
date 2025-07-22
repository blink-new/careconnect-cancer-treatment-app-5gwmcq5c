import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');
const chartWidth = width - 40;

interface TrendData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

export default function TrendsAnalysis() {
  const [selectedVital, setSelectedVital] = useState('blood_pressure');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const periods = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '3m', label: '3 Months' },
    { key: '6m', label: '6 Months' },
  ];

  const vitalTypes = [
    { 
      id: 'blood_pressure', 
      name: 'Blood Pressure', 
      icon: 'heart', 
      color: '#EF4444',
      unit: 'mmHg',
      normal: { min: 90, max: 140 }
    },
    { 
      id: 'heart_rate', 
      name: 'Heart Rate', 
      icon: 'pulse', 
      color: '#F59E0B',
      unit: 'bpm',
      normal: { min: 60, max: 100 }
    },
    { 
      id: 'weight', 
      name: 'Weight', 
      icon: 'scale', 
      color: '#10B981',
      unit: 'lbs',
      normal: { min: 150, max: 180 }
    },
    { 
      id: 'temperature', 
      name: 'Temperature', 
      icon: 'thermometer', 
      color: '#8B5CF6',
      unit: '°F',
      normal: { min: 97, max: 99 }
    },
    { 
      id: 'oxygen', 
      name: 'Oxygen Saturation', 
      icon: 'fitness', 
      color: '#3B82F6',
      unit: '%',
      normal: { min: 95, max: 100 }
    },
  ];

  // Sample trend data - in real app, this would come from database
  const getTrendData = (vitalId: string, period: string): TrendData => {
    const baseData = {
      blood_pressure: {
        '7d': {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            data: [125, 118, 122, 130, 115, 120, 124],
            color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
            strokeWidth: 3,
          }]
        },
        '30d': {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            data: [122, 125, 119, 121],
            color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
            strokeWidth: 3,
          }]
        }
      },
      heart_rate: {
        '7d': {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            data: [72, 68, 75, 82, 70, 74, 76],
            color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
            strokeWidth: 3,
          }]
        },
        '30d': {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            data: [74, 72, 78, 75],
            color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
            strokeWidth: 3,
          }]
        }
      },
      weight: {
        '7d': {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            data: [165, 164, 166, 165, 163, 164, 165],
            color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
            strokeWidth: 3,
          }]
        },
        '30d': {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            data: [167, 165, 164, 163],
            color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
            strokeWidth: 3,
          }]
        }
      },
      temperature: {
        '7d': {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            data: [98.6, 98.4, 98.8, 99.1, 98.5, 98.7, 98.6],
            color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
            strokeWidth: 3,
          }]
        },
        '30d': {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            data: [98.7, 98.6, 98.8, 98.5],
            color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
            strokeWidth: 3,
          }]
        }
      },
      oxygen: {
        '7d': {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            data: [97, 98, 96, 97, 98, 97, 98],
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            strokeWidth: 3,
          }]
        },
        '30d': {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            data: [97, 97, 98, 97],
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            strokeWidth: 3,
          }]
        }
      }
    };

    return baseData[vitalId]?.[period] || baseData[vitalId]?.['7d'] || baseData.blood_pressure['7d'];
  };

  const currentVital = vitalTypes.find(v => v.id === selectedVital);
  const trendData = getTrendData(selectedVital, selectedPeriod);
  const currentData = trendData.datasets[0].data;
  const latestValue = currentData[currentData.length - 1];
  const previousValue = currentData[currentData.length - 2];
  const change = latestValue - previousValue;
  const changePercent = ((change / previousValue) * 100).toFixed(1);

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 1,
    color: (opacity = 1) => currentVital?.color || `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: currentVital?.color || '#3B82F6',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#E5E7EB',
      strokeWidth: 1,
    },
  };

  const insights = [
    {
      title: 'Trend Analysis',
      value: change > 0 ? 'Increasing' : change < 0 ? 'Decreasing' : 'Stable',
      icon: change > 0 ? 'trending-up' : change < 0 ? 'trending-down' : 'remove',
      color: change > 0 ? '#10B981' : change < 0 ? '#EF4444' : '#6B7280',
      description: `${Math.abs(parseFloat(changePercent))}% ${change > 0 ? 'increase' : 'decrease'} from last reading`
    },
    {
      title: 'Average',
      value: (currentData.reduce((a, b) => a + b, 0) / currentData.length).toFixed(1),
      icon: 'analytics',
      color: '#3B82F6',
      description: `Over the last ${selectedPeriod === '7d' ? '7 days' : selectedPeriod === '30d' ? '30 days' : selectedPeriod}`
    },
    {
      title: 'Range Status',
      value: latestValue >= (currentVital?.normal.min || 0) && latestValue <= (currentVital?.normal.max || 100) ? 'Normal' : 'Abnormal',
      icon: latestValue >= (currentVital?.normal.min || 0) && latestValue <= (currentVital?.normal.max || 100) ? 'checkmark-circle' : 'warning',
      color: latestValue >= (currentVital?.normal.min || 0) && latestValue <= (currentVital?.normal.max || 100) ? '#10B981' : '#EF4444',
      description: `Normal range: ${currentVital?.normal.min}-${currentVital?.normal.max} ${currentVital?.unit}`
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Vitals Trends</Text>
        <Text style={styles.subtitle}>Analyze your health patterns over time</Text>
      </View>

      {/* Vital Type Selector */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(100)}
      >
        <Text style={styles.sectionTitle}>Select Vital</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vitalSelector}>
          {vitalTypes.map((vital) => (
            <TouchableOpacity
              key={vital.id}
              style={[
                styles.vitalOption,
                selectedVital === vital.id && styles.vitalOptionSelected,
                { borderColor: vital.color }
              ]}
              onPress={() => setSelectedVital(vital.id)}
            >
              <View style={[styles.vitalOptionIcon, { backgroundColor: `${vital.color}15` }]}>
                <Ionicons name={vital.icon as any} size={20} color={vital.color} />
              </View>
              <Text style={[
                styles.vitalOptionText,
                selectedVital === vital.id && { color: vital.color }
              ]}>
                {vital.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Period Selector */}
      <Animated.View 
        style={styles.periodSelector}
        entering={FadeInDown.duration(400).delay(200)}
      >
        {periods.map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.periodButton,
              selectedPeriod === period.key && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod(period.key)}
          >
            <Text style={[
              styles.periodText,
              selectedPeriod === period.key && styles.periodTextActive
            ]}>
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Current Value Display */}
      <Animated.View 
        style={styles.currentValueCard}
        entering={FadeInDown.duration(400).delay(300)}
      >
        <View style={styles.currentValueHeader}>
          <View style={[styles.currentValueIcon, { backgroundColor: `${currentVital?.color}15` }]}>
            <Ionicons name={currentVital?.icon as any} size={32} color={currentVital?.color} />
          </View>
          <View style={styles.currentValueInfo}>
            <Text style={styles.currentValueLabel}>{currentVital?.name}</Text>
            <Text style={[styles.currentValue, { color: currentVital?.color }]}>
              {latestValue} {currentVital?.unit}
            </Text>
            <View style={styles.changeIndicator}>
              <Ionicons 
                name={change > 0 ? 'arrow-up' : change < 0 ? 'arrow-down' : 'remove'} 
                size={16} 
                color={change > 0 ? '#10B981' : change < 0 ? '#EF4444' : '#6B7280'} 
              />
              <Text style={[
                styles.changeText,
                { color: change > 0 ? '#10B981' : change < 0 ? '#EF4444' : '#6B7280' }
              ]}>
                {Math.abs(parseFloat(changePercent))}% from last reading
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Trend Chart */}
      <Animated.View 
        style={styles.chartContainer}
        entering={FadeInDown.duration(400).delay(400)}
      >
        <Text style={styles.chartTitle}>Trend Over Time</Text>
        <LineChart
          data={trendData}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={true}
          withHorizontalLines={true}
          fromZero={false}
        />
      </Animated.View>

      {/* Insights */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(500)}
      >
        <Text style={styles.sectionTitle}>Insights</Text>
        {insights.map((insight, index) => (
          <View key={insight.title} style={styles.insightCard}>
            <View style={[styles.insightIcon, { backgroundColor: `${insight.color}15` }]}>
              <Ionicons name={insight.icon as any} size={24} color={insight.color} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={[styles.insightValue, { color: insight.color }]}>{insight.value}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Normal Range Indicator */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(600)}
      >
        <Text style={styles.sectionTitle}>Normal Range</Text>
        <View style={styles.rangeCard}>
          <View style={styles.rangeInfo}>
            <Text style={styles.rangeLabel}>{currentVital?.name} Normal Range</Text>
            <Text style={styles.rangeValue}>
              {currentVital?.normal.min} - {currentVital?.normal.max} {currentVital?.unit}
            </Text>
          </View>
          <View style={styles.rangeIndicator}>
            <View style={styles.rangeBar}>
              <View 
                style={[
                  styles.rangeMarker,
                  { 
                    left: `${((latestValue - (currentVital?.normal.min || 0)) / ((currentVital?.normal.max || 100) - (currentVital?.normal.min || 0))) * 100}%`,
                    backgroundColor: currentVital?.color 
                  }
                ]} 
              />
            </View>
            <View style={styles.rangeLabels}>
              <Text style={styles.rangeLabelText}>{currentVital?.normal.min}</Text>
              <Text style={styles.rangeLabelText}>{currentVital?.normal.max}</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Export Options */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(700)}
      >
        <Text style={styles.sectionTitle}>Share & Export</Text>
        <View style={styles.exportOptions}>
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="share" size={24} color="#3B82F6" />
            <Text style={styles.exportText}>Share with Doctor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="download" size={24} color="#3B82F6" />
            <Text style={styles.exportText}>Export PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="print" size={24} color="#3B82F6" />
            <Text style={styles.exportText}>Print Report</Text>
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
  vitalSelector: {
    flexDirection: 'row',
  },
  vitalOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vitalOptionSelected: {
    backgroundColor: '#F8FAFC',
  },
  vitalOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  vitalOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  currentValueCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  currentValueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentValueIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  currentValueInfo: {
    flex: 1,
  },
  currentValueLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  currentValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  chartContainer: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  insightDescription: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  rangeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rangeInfo: {
    marginBottom: 16,
  },
  rangeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  rangeValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  rangeIndicator: {
    marginBottom: 8,
  },
  rangeBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    position: 'relative',
    marginBottom: 8,
  },
  rangeMarker: {
    position: 'absolute',
    top: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    transform: [{ translateX: -6 }],
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeLabelText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  exportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exportButton: {
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
  exportText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
});