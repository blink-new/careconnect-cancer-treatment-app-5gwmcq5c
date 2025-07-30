import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor, runOnJS } from 'react-native-reanimated';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function SymptomsTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showMoodChart, setShowMoodChart] = useState(false);

  // Animation values
  const moodScale = useSharedValue(1);
  const submitButtonScale = useSharedValue(1);
  const chartOpacity = useSharedValue(0);

  useEffect(() => {
    // Show mood chart after component mounts
    setTimeout(() => {
      chartOpacity.value = withTiming(1, { duration: 1000 });
      setShowMoodChart(true);
    }, 500);
  }, []);

  const symptoms = [
    { name: 'Fatigue', icon: 'battery-dead', color: '#EF4444' },
    { name: 'Nausea', icon: 'sad', color: '#F59E0B' },
    { name: 'Pain', icon: 'flash', color: '#DC2626' },
    { name: 'Headache', icon: 'skull', color: '#7C2D12' },
    { name: 'Dizziness', icon: 'refresh', color: '#8B5CF6' },
    { name: 'Loss of Appetite', icon: 'restaurant', color: '#059669' },
    { name: 'Insomnia', icon: 'moon', color: '#1E40AF' },
    { name: 'Anxiety', icon: 'heart-dislike', color: '#BE185D' },
    { name: 'Depression', icon: 'cloud-drizzle', color: '#374151' },
    { name: 'Fever', icon: 'thermometer', color: '#DC2626' }
  ];

  const moodLabels = {
    1: 'Terrible',
    2: 'Very Bad',
    3: 'Bad',
    4: 'Poor',
    5: 'Fair',
    6: 'Okay',
    7: 'Good',
    8: 'Very Good',
    9: 'Great',
    10: 'Excellent'
  };

  // Sample mood data for the last 7 days
  const moodData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [6, 7, 5, 8, 7, 6, selectedMood || 7],
      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
      strokeWidth: 3,
    }]
  };

  // Symptom frequency data
  const symptomFrequencyData = {
    labels: ['Fatigue', 'Nausea', 'Pain', 'Headache', 'Anxiety'],
    datasets: [{
      data: [8, 6, 4, 3, 2],
      colors: [
        (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
        (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
        (opacity = 1) => `rgba(220, 38, 38, ${opacity})`,
        (opacity = 1) => `rgba(124, 45, 18, ${opacity})`,
        (opacity = 1) => `rgba(190, 24, 93, ${opacity})`,
      ]
    }]
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleMoodSelect = (rating: number) => {
    setSelectedMood(rating);
    moodScale.value = withSpring(1.2, {}, () => {
      moodScale.value = withSpring(1);
    });
  };

  const handleSave = () => {
    if (selectedMood === null) {
      Alert.alert('Missing Information', 'Please select your mood rating.');
      return;
    }

    submitButtonScale.value = withSpring(0.95, {}, () => {
      submitButtonScale.value = withSpring(1);
    });

    // Here you would save to your backend/database
    Alert.alert(
      'Symptoms Logged', 
      `Your symptoms have been recorded for today. Mood: ${selectedMood}/10 (${moodLabels[selectedMood as keyof typeof moodLabels]})`
    );
    
    // Reset form
    setSelectedMood(null);
    setSelectedSymptoms([]);
    setNotes('');
  };

  const getMoodColor = (rating: number) => {
    if (rating <= 3) return '#EF4444'; // Red
    if (rating <= 5) return '#F59E0B'; // Orange
    if (rating <= 7) return '#EAB308'; // Yellow
    return '#10B981'; // Green
  };

  const getMoodEmoji = (rating: number) => {
    if (rating <= 2) return '😢';
    if (rating <= 4) return '😞';
    if (rating <= 6) return '😐';
    if (rating <= 8) return '🙂';
    return '😊';
  };

  const chartConfig = {
    backgroundColor: '#1E293B',
    backgroundGradientFrom: '#1E293B',
    backgroundGradientTo: '#334155',
    decimalPlaces: 0,
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

  const animatedMoodStyle = useAnimatedStyle(() => ({
    transform: [{ scale: moodScale.value }],
  }));

  const animatedSubmitStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submitButtonScale.value }],
  }));

  const animatedChartStyle = useAnimatedStyle(() => ({
    opacity: chartOpacity.value,
  }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Symptoms Tracker</Text>
        <Text style={styles.subtitle}>Track how you're feeling today</Text>
      </View>

      {/* Mood Trend Chart */}
      <Animated.View 
        style={[styles.chartContainer, animatedChartStyle]}
        entering={FadeInDown.duration(600).delay(100)}
      >
        <Text style={styles.chartTitle}>7-Day Mood Trend</Text>
        <LineChart
          data={moodData}
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
          segments={4}
        />
      </Animated.View>

      {/* Mood Rating Scale */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(600).delay(300)}
      >
        <Text style={styles.sectionTitle}>How is your mood today?</Text>
        <Text style={styles.sectionSubtitle}>Rate from 1 (terrible) to 10 (excellent)</Text>
        
        <View style={styles.moodContainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
            <TouchableOpacity
              key={rating}
              style={[
                styles.moodButton,
                selectedMood === rating && {
                  backgroundColor: getMoodColor(rating),
                  borderColor: getMoodColor(rating),
                  transform: [{ scale: 1.1 }],
                }
              ]}
              onPress={() => handleMoodSelect(rating)}
            >
              <Text style={[
                styles.moodNumber,
                selectedMood === rating && styles.moodNumberSelected
              ]}>
                {rating}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {selectedMood && (
          <Animated.View 
            style={[styles.moodLabel, animatedMoodStyle]}
            entering={FadeInUp.duration(400)}
          >
            <Text style={styles.moodEmoji}>{getMoodEmoji(selectedMood)}</Text>
            <Text style={[styles.moodLabelText, { color: getMoodColor(selectedMood) }]}>
              {selectedMood}/10 - {moodLabels[selectedMood as keyof typeof moodLabels]}
            </Text>
          </Animated.View>
        )}
      </Animated.View>

      {/* Symptoms Selection */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(600).delay(500)}
      >
        <Text style={styles.sectionTitle}>Any symptoms today?</Text>
        <Text style={styles.sectionSubtitle}>Select all that apply</Text>
        
        <View style={styles.symptomsGrid}>
          {symptoms.map((symptom, index) => (
            <Animated.View
              key={symptom.name}
              entering={FadeInDown.duration(400).delay(600 + index * 50)}
            >
              <TouchableOpacity
                style={[
                  styles.symptomButton,
                  selectedSymptoms.includes(symptom.name) && {
                    backgroundColor: symptom.color + '20',
                    borderColor: symptom.color,
                  }
                ]}
                onPress={() => toggleSymptom(symptom.name)}
              >
                <View style={[
                  styles.symptomIcon,
                  { backgroundColor: symptom.color + '20' }
                ]}>
                  <Ionicons 
                    name={symptom.icon as any} 
                    size={20} 
                    color={symptom.color} 
                  />
                </View>
                <Text style={[
                  styles.symptomText,
                  selectedSymptoms.includes(symptom.name) && { 
                    color: symptom.color,
                    fontWeight: '600'
                  }
                ]}>
                  {symptom.name}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Symptom Frequency Chart */}
      <Animated.View 
        style={styles.chartContainer}
        entering={FadeInDown.duration(600).delay(800)}
      >
        <Text style={styles.chartTitle}>Most Common Symptoms (Last 30 Days)</Text>
        <BarChart
          data={symptomFrequencyData}
          width={width - 40}
          height={200}
          chartConfig={chartConfig}
          style={styles.chart}
          withInnerLines={false}
          withHorizontalLabels={true}
          withVerticalLabels={false}
          fromZero={true}
          showBarTops={false}
        />
      </Animated.View>

      {/* Notes Section */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(600).delay(1000)}
      >
        <Text style={styles.sectionTitle}>Additional Notes</Text>
        <Text style={styles.sectionSubtitle}>Any other details you'd like to share with your care team?</Text>
        
        <TextInput
          style={styles.notesInput}
          placeholder="Describe how you're feeling, any concerns, or other observations..."
          placeholderTextColor="#64748B"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </Animated.View>

      {/* Save Button */}
      <Animated.View 
        style={styles.saveContainer}
        entering={FadeInDown.duration(600).delay(1200)}
      >
        <Animated.View style={animatedSubmitStyle}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Log Today's Symptoms</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Recent Entries Preview */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(600).delay(1400)}
      >
        <Text style={styles.sectionTitle}>Recent Entries</Text>
        
        <Animated.View 
          style={styles.recentEntry}
          entering={FadeInDown.duration(400).delay(1500)}
        >
          <View style={styles.entryHeader}>
            <Text style={styles.entryDate}>Yesterday</Text>
            <View style={styles.entryMood}>
              <Text style={styles.entryMoodEmoji}>🙂</Text>
              <Text style={styles.entryMoodText}>7/10</Text>
            </View>
          </View>
          <View style={styles.entrySymptoms}>
            <View style={styles.symptomTag}>
              <Text style={styles.symptomTagText}>Mild fatigue</Text>
            </View>
            <View style={styles.symptomTag}>
              <Text style={styles.symptomTagText}>Slight nausea</Text>
            </View>
          </View>
          <Text style={styles.entryNotes}>Feeling better after morning medication</Text>
        </Animated.View>
        
        <Animated.View 
          style={styles.recentEntry}
          entering={FadeInDown.duration(400).delay(1600)}
        >
          <View style={styles.entryHeader}>
            <Text style={styles.entryDate}>2 days ago</Text>
            <View style={styles.entryMood}>
              <Text style={styles.entryMoodEmoji}>😊</Text>
              <Text style={styles.entryMoodText}>8/10</Text>
            </View>
          </View>
          <View style={styles.entrySymptoms}>
            <Text style={styles.noSymptomsText}>No major symptoms reported</Text>
          </View>
          <Text style={styles.entryNotes}>Great day overall, energy levels good</Text>
        </Animated.View>
      </Animated.View>

      {/* Insights Card */}
      <Animated.View 
        style={styles.insightsCard}
        entering={FadeInDown.duration(600).delay(1800)}
      >
        <View style={styles.insightsHeader}>
          <Ionicons name="analytics" size={24} color="#3B82F6" />
          <Text style={styles.insightsTitle}>Weekly Insights</Text>
        </View>
        <View style={styles.insightsList}>
          <View style={styles.insightItem}>
            <Ionicons name="trending-up" size={16} color="#10B981" />
            <Text style={styles.insightText}>Mood improved by 15% this week</Text>
          </View>
          <View style={styles.insightItem}>
            <Ionicons name="time" size={16} color="#F59E0B" />
            <Text style={styles.insightText}>Fatigue most common in mornings</Text>
          </View>
          <View style={styles.insightItem}>
            <Ionicons name="medical" size={16} color="#8B5CF6" />
            <Text style={styles.insightText}>Symptoms reduced after medication</Text>
          </View>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 16,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  moodButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#334155',
    borderWidth: 2,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  moodNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  moodNumberSelected: {
    color: '#FFFFFF',
  },
  moodLabel: {
    alignItems: 'center',
    marginTop: 8,
    padding: 16,
    backgroundColor: '#334155',
    borderRadius: 12,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomButton: {
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    minWidth: (width - 60) / 2,
    alignItems: 'center',
  },
  symptomIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  symptomText: {
    fontSize: 14,
    color: '#CBD5E1',
    fontWeight: '500',
    textAlign: 'center',
  },
  notesInput: {
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#F8FAFC',
    minHeight: 100,
  },
  saveContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  recentEntry: {
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
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  entryMood: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  entryMoodEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  entryMoodText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  entrySymptoms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  symptomTag: {
    backgroundColor: '#EF444420',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  symptomTagText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  noSymptomsText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  entryNotes: {
    fontSize: 14,
    color: '#94A3B8',
  },
  insightsCard: {
    marginHorizontal: 20,
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginLeft: 12,
  },
  insightsList: {
    gap: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightText: {
    fontSize: 14,
    color: '#CBD5E1',
    marginLeft: 12,
  },
});