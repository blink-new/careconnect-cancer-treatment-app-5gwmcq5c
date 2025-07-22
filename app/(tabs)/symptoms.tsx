import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SymptomsTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const symptoms = [
    'Fatigue', 'Nausea', 'Pain', 'Headache', 'Dizziness', 
    'Loss of Appetite', 'Insomnia', 'Anxiety', 'Depression', 'Fever'
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

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSave = () => {
    if (selectedMood === null) {
      Alert.alert('Missing Information', 'Please select your mood rating.');
      return;
    }

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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Symptoms Tracker</Text>
        <Text style={styles.subtitle}>Track how you're feeling today</Text>
      </View>

      {/* Mood Rating Scale */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(100)}
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
                }
              ]}
              onPress={() => setSelectedMood(rating)}
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
            style={styles.moodLabel}
            entering={FadeInDown.duration(300)}
          >
            <Text style={[styles.moodLabelText, { color: getMoodColor(selectedMood) }]}>
              {selectedMood}/10 - {moodLabels[selectedMood as keyof typeof moodLabels]}
            </Text>
          </Animated.View>
        )}
      </Animated.View>

      {/* Symptoms Selection */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(200)}
      >
        <Text style={styles.sectionTitle}>Any symptoms today?</Text>
        <Text style={styles.sectionSubtitle}>Select all that apply</Text>
        
        <View style={styles.symptomsGrid}>
          {symptoms.map((symptom, index) => (
            <TouchableOpacity
              key={symptom}
              style={[
                styles.symptomButton,
                selectedSymptoms.includes(symptom) && styles.symptomButtonSelected
              ]}
              onPress={() => toggleSymptom(symptom)}
            >
              <Text style={[
                styles.symptomText,
                selectedSymptoms.includes(symptom) && styles.symptomTextSelected
              ]}>
                {symptom}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Notes Section */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(300)}
      >
        <Text style={styles.sectionTitle}>Additional Notes</Text>
        <Text style={styles.sectionSubtitle}>Any other details you'd like to share with your care team?</Text>
        
        <TextInput
          style={styles.notesInput}
          placeholder="Describe how you're feeling, any concerns, or other observations..."
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
        entering={FadeInDown.duration(400).delay(400)}
      >
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Log Today's Symptoms</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Recent Entries Preview */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(500)}
      >
        <Text style={styles.sectionTitle}>Recent Entries</Text>
        <View style={styles.recentEntry}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryDate}>Yesterday</Text>
            <View style={styles.entryMood}>
              <Text style={styles.entryMoodText}>7/10</Text>
            </View>
          </View>
          <Text style={styles.entrySymptoms}>Mild fatigue, slight nausea</Text>
        </View>
        
        <View style={styles.recentEntry}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryDate}>2 days ago</Text>
            <View style={styles.entryMood}>
              <Text style={styles.entryMoodText}>8/10</Text>
            </View>
          </View>
          <Text style={styles.entrySymptoms}>Feeling good, no major symptoms</Text>
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
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  moodNumberSelected: {
    color: '#FFFFFF',
  },
  moodLabel: {
    alignItems: 'center',
    marginTop: 8,
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  symptomButtonSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  symptomText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  symptomTextSelected: {
    color: '#FFFFFF',
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  recentEntry: {
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
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  entryMood: {
    backgroundColor: '#10B98115',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  entryMoodText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  entrySymptoms: {
    fontSize: 14,
    color: '#6B7280',
  },
});