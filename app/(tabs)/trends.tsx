import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { LineChart, BarChart, ProgressChart, PieChart } from 'react-native-chart-kit';

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
  const [selectedVital, setSelectedVital] = useState('heart_rate');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('vitals');

  // Animation values
  const chartOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.9);

  useEffect(() => {
    chartOpacity.value = withTiming(1, { duration: 1000 });
    cardScale.value = withSpring(1, { damping: 15 });
  }, [selectedVital, selectedPeriod]);

  const periods = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '3m', label: '3 Months' },
    { key: '6m', label: '6 Months' },
  ];

  const metrics = [
    { key: 'vitals', label: 'Vitals', icon: 'pulse' },
    { key: 'symptoms', label: 'Symptoms', icon: 'medical' },
    { key: 'mood', label: 'Mood', icon: 'happy' },
    { key: 'medication', label: 'Medication', icon: 'tablet-portrait' },
  ];

  const vitalTypes = [
    { 
      id: 'heart_rate', 
      name: 'Heart Rate', 
      icon: 'pulse', 
      color: '#F59E0B',
      unit: 'bpm',
      normal: { min: 60, max: 100 },
      current: 74,
      change: '+2.3%'
    },
    { 
      id: 'blood_pressure', 
      name: 'Blood Pressure', 
      icon: 'heart', 
      color: '#EF4444',
      unit: 'mmHg',
      normal: { min: 90, max: 140 },
      current: 122,
      change: '-1.2%'
    },
    { 
      id: 'weight', 
      name: 'Weight', 
      icon: 'scale', 
      color: '#10B981',
      unit: 'lbs',
      normal: { min: 150, max: 180 },
      current: 165,
      change: '-0.8%'
    },
    { 
      id: 'temperature', 
      name: 'Temperature', 
      icon: 'thermometer', 
      color: '#8B5CF6',
      unit: '°F',
      normal: { min: 97, max: 99 },
      current: 98.6,
      change: '0.0%'
    },
  ];

  // Enhanced trend data with more realistic patterns
  const getTrendData = (vitalId: string, period: string): TrendData => {
    const baseData = {
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
      }
    };
    return baseData[vitalId]?.[period] || baseData.heart_rate['7d'];
  };

  // Symptom frequency data
  const symptomData = [
    { name: 'Fatigue', population: 8, color: '#EF4444', legendFontColor: '#94A3B8', legendFontSize: 12 },
    { name: 'Nausea', population: 6, color: '#F59E0B', legendFontColor: '#94A3B8', legendFontSize: 12 },
    { name: 'Pain', population: 4, color: '#DC2626', legendFontColor: '#94A3B8', legendFontSize: 12 },
    { name: 'Headache', population: 3, color: '#7C2D12', legendFontColor: '#94A3B8', legendFontSize: 12 },
    { name: 'Other', population: 2, color: '#6B7280', legendFontColor: '#94A3B8', legendFontSize: 12 },
  ];

  // Medication adherence data
  const adherenceData = {
    data: [0.88] // 88% adherence
  };

  // Mood trend data
  const moodTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      data: [6.2, 6.8, 7.1, 7.4],
      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
      strokeWidth: 3,
    }]
  };

  const currentVital = vitalTypes.find(v => v.id === selectedVital);
  const trendData = getTrendData(selectedVital, selectedPeriod);
  const currentData = trendData.datasets[0].data;
  const latestValue = currentData[currentData.length - 1];
  const previousValue = currentData[currentData.length - 2];
  const change = latestValue - previousValue;
  const changePercent = ((change / previousValue) * 100).toFixed(1);

  const chartConfig = {
    backgroundColor: '#1E293B',
    backgroundGradientFrom: '#1E293B',
    backgroundGradientTo: '#334155',
    decimalPlaces: 1,
    color: (opacity = 1) => currentVital?.color || `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
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
      stroke: '#475569',
      strokeWidth: 1,
    },
  };

  const animatedChartStyle = useAnimatedStyle(() => ({
    opacity: chartOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const insights = [
    {
      title: 'Trend Analysis',
      value: change > 0 ? 'Improving' : change < 0 ? 'Declining' : 'Stable',
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

  const renderVitalsView = () => (
    <>
      {/* Vital Type Selector */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(600).delay(200)}
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
              <View style={[styles.vitalOptionIcon, { backgroundColor: `${vital.color}20` }]}>
                <Ionicons name={vital.icon as any} size={20} color={vital.color} />
              </View>
              <Text style={[
                styles.vitalOptionText,
                selectedVital === vital.id && { color: vital.color }
              ]}>
                {vital.name}
              </Text>
              <Text style={styles.vitalCurrentValue}>
                {vital.current} {vital.unit}
              </Text>
              <Text style={[
                styles.vitalChange,
                { color: vital.change.startsWith('+') ? '#10B981' : vital.change.startsWith('-') ? '#EF4444' : '#6B7280' }
              ]}>
                {vital.change}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Current Value Display */}
      <Animated.View 
        style={styles.currentValueCard}
        entering={FadeInDown.duration(600).delay(400)}
      >
        <View style={styles.currentValueHeader}>
          <View style={[styles.currentValueIcon, { backgroundColor: `${currentVital?.color}20` }]}>
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
        style={[styles.chartContainer, animatedChartStyle]}
        entering={FadeInDown.duration(600).delay(600)}
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
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          fromZero={false}
        />
      </Animated.View>

      {/* Insights */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(600).delay(800)}
      >
        <Text style={styles.sectionTitle}>Insights</Text>
        {insights.map((insight, index) => (
          <Animated.View
            key={insight.title}
            style={styles.insightCard}
            entering={FadeInDown.duration(400).delay(900 + index * 100)}
          >
            <View style={[styles.insightIcon, { backgroundColor: `${insight.color}20` }]}>
              <Ionicons name={insight.icon as any} size={24} color={insight.color} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={[styles.insightValue, { color: insight.color }]}>{insight.value}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
            </View>
          </Animated.View>
        ))}
      </Animated.View>
    </>
  );

  const renderSymptomsView = () => (
    <Animated.View 
      style={styles.chartContainer}
      entering={FadeInDown.duration(600).delay(400)}
    >
      <Text style={styles.chartTitle}>Symptom Distribution (Last 30 Days)</Text>
      <PieChart
        data={symptomData}
        width={chartWidth}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 10]}
        absolute
      />
    </Animated.View>
  );

  const renderMoodView = () => (
    <Animated.View 
      style={styles.chartContainer}
      entering={FadeInDown.duration(600).delay(400)}
    >
      <Text style={styles.chartTitle}>Mood Trend (Last 4 Weeks)</Text>
      <LineChart
        data={moodTrendData}
        width={chartWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        fromZero={false}
        segments={4}
      />
    </Animated.View>
  );

  const renderMedicationView = () => (
    <Animated.View 
      style={styles.adherenceContainer}
      entering={FadeInDown.duration(600).delay(400)}
    >
      <Text style={styles.chartTitle}>Medication Adherence</Text>
      <View style={styles.adherenceContent}>
        <ProgressChart
          data={adherenceData}
          width={200}
          height={200}
          strokeWidth={16}
          radius={64}
          chartConfig={{
            backgroundColor: '#1E293B',
            backgroundGradientFrom: '#1E293B',
            backgroundGradientTo: '#1E293B',
            color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
          }}
          hideLegend={true}
          style={styles.progressChart}
        />
        <View style={styles.adherenceStats}>
          <Text style={styles.adherencePercentage}>88%</Text>
          <Text style={styles.adherenceLabel}>Adherence Rate</Text>
          <Text style={styles.adherenceDescription}>
            You've taken 22 out of 25 scheduled doses this week
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Trends</Text>
        <Text style={styles.subtitle}>Analyze your health patterns over time</Text>
      </View>

      {/* Metric Selector */}
      <Animated.View 
        style={styles.metricSelector}
        entering={FadeInDown.duration(600).delay(100)}
      >
        {metrics.map((metric) => (
          <TouchableOpacity
            key={metric.key}
            style={[
              styles.metricButton,
              selectedMetric === metric.key && styles.metricButtonActive
            ]}
            onPress={() => setSelectedMetric(metric.key)}
          >
            <Ionicons 
              name={metric.icon as any} 
              size={20} 
              color={selectedMetric === metric.key ? '#FFFFFF' : '#94A3B8'} 
            />
            <Text style={[
              styles.metricText,
              selectedMetric === metric.key && styles.metricTextActive
            ]}>
              {metric.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Period Selector */}
      {selectedMetric === 'vitals' && (
        <Animated.View 
          style={styles.periodSelector}
          entering={FadeInDown.duration(600).delay(150)}
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
      )}

      {/* Dynamic Content Based on Selected Metric */}
      {selectedMetric === 'vitals' && renderVitalsView()}
      {selectedMetric === 'symptoms' && renderSymptomsView()}
      {selectedMetric === 'mood' && renderMoodView()}
      {selectedMetric === 'medication' && renderMedicationView()}

      {/* Export Options */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(600).delay(1000)}
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
  metricSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  metricButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  metricButtonActive: {
    backgroundColor: '#3B82F6',
  },
  metricText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    marginLeft: 6,
  },
  metricTextActive: {
    color: '#FFFFFF',
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  vitalSelector: {
    flexDirection: 'row',
  },
  vitalOption: {
    backgroundColor: '#334155',
    borderWidth: 2,
    borderColor: '#475569',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  vitalOptionSelected: {
    backgroundColor: '#1E293B',
    borderWidth: 2,
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
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 4,
  },
  vitalCurrentValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  vitalChange: {
    fontSize: 10,
    fontWeight: '500',
  },
  currentValueCard: {
    marginHorizontal: 20,
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    color: '#94A3B8',
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
  adherenceContainer: {
    marginHorizontal: 20,
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  adherenceContent: {
    alignItems: 'center',
  },
  progressChart: {
    borderRadius: 16,
  },
  adherenceStats: {
    alignItems: 'center',
    marginTop: 20,
  },
  adherencePercentage: {
    fontSize: 32,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  adherenceLabel: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 8,
  },
  adherenceDescription: {
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#94A3B8',
    marginBottom: 2,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  insightDescription: {
    fontSize: 12,
    color: '#64748B',
  },
  exportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exportButton: {
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
  exportText: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 8,
    textAlign: 'center',
  },
});