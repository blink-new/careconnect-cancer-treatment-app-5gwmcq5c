import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInLeft, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  email: string;
  phone: string;
  accessLevel: 'full' | 'limited' | 'emergency';
  isActive: boolean;
  lastAccess: string;
  avatar?: string;
  permissions: string[];
}

interface AccessPermission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
}

export default function FamilyCaregiverAccess() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [securityEnabled, setSecurityEnabled] = useState(true);
  const [pinCode, setPinCode] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [newMember, setNewMember] = useState({
    name: '',
    relationship: '',
    email: '',
    phone: '',
    accessLevel: 'limited' as 'full' | 'limited' | 'emergency'
  });

  // Animation values
  const securityCardScale = useSharedValue(0.95);
  const addButtonScale = useSharedValue(1);

  useEffect(() => {
    securityCardScale.value = withSpring(1, { damping: 15 });
  }, []);

  const familyMembers: FamilyMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Spouse',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      accessLevel: 'full',
      isActive: true,
      lastAccess: '2 hours ago',
      permissions: ['view_appointments', 'view_medications', 'view_vitals', 'emergency_contact', 'manage_appointments']
    },
    {
      id: '2',
      name: 'Michael Johnson',
      relationship: 'Son',
      email: 'michael.j@email.com',
      phone: '+1 (555) 987-6543',
      accessLevel: 'limited',
      isActive: true,
      lastAccess: '1 day ago',
      permissions: ['view_appointments', 'view_medications', 'emergency_contact']
    },
    {
      id: '3',
      name: 'Dr. Emily Chen',
      relationship: 'Primary Caregiver',
      email: 'dr.chen@hospital.com',
      phone: '+1 (555) 456-7890',
      accessLevel: 'full',
      isActive: true,
      lastAccess: '3 hours ago',
      permissions: ['view_appointments', 'view_medications', 'view_vitals', 'view_symptoms', 'view_messages', 'manage_appointments']
    },
    {
      id: '4',
      name: 'Lisa Martinez',
      relationship: 'Sister',
      email: 'lisa.martinez@email.com',
      phone: '+1 (555) 321-0987',
      accessLevel: 'emergency',
      isActive: false,
      lastAccess: '1 week ago',
      permissions: ['emergency_contact']
    }
  ];

  const accessPermissions: AccessPermission[] = [
    {
      id: 'view_appointments',
      name: 'View Appointments',
      description: 'See upcoming and past appointments',
      enabled: true,
      icon: 'calendar'
    },
    {
      id: 'view_medications',
      name: 'View Medications',
      description: 'Access medication schedules and history',
      enabled: true,
      icon: 'medical'
    },
    {
      id: 'view_vitals',
      name: 'View Vitals',
      description: 'See health monitoring data and trends',
      enabled: true,
      icon: 'fitness'
    },
    {
      id: 'view_symptoms',
      name: 'View Symptoms',
      description: 'Access symptom tracking and mood logs',
      enabled: false,
      icon: 'heart'
    },
    {
      id: 'view_messages',
      name: 'View Messages',
      description: 'Read communication with care team',
      enabled: false,
      icon: 'mail'
    },
    {
      id: 'emergency_contact',
      name: 'Emergency Contact',
      description: 'Receive emergency notifications',
      enabled: true,
      icon: 'warning'
    },
    {
      id: 'manage_appointments',
      name: 'Manage Appointments',
      description: 'Schedule and modify appointments',
      enabled: false,
      icon: 'create'
    },
    {
      id: 'medication_reminders',
      name: 'Medication Reminders',
      description: 'Receive medication reminder notifications',
      enabled: true,
      icon: 'notifications'
    }
  ];

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'full': return '#10B981';
      case 'limited': return '#F59E0B';
      case 'emergency': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case 'full': return 'shield-checkmark';
      case 'limited': return 'shield-half';
      case 'emergency': return 'shield';
      default: return 'shield-outline';
    }
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case 'spouse': return 'heart';
      case 'son': case 'daughter': return 'person';
      case 'sister': case 'brother': return 'people';
      case 'primary caregiver': case 'caregiver': return 'medical';
      default: return 'person-outline';
    }
  };

  const addFamilyMember = () => {
    if (!newMember.name || !newMember.relationship || !newMember.email) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    addButtonScale.value = withSpring(0.9, {}, () => {
      addButtonScale.value = withSpring(1);
    });

    Alert.alert(
      'Invitation Sent',
      `An invitation has been sent to ${newMember.email}. They will receive access once they accept and verify their identity.`,
      [{ text: 'OK' }]
    );

    setNewMember({
      name: '',
      relationship: '',
      email: '',
      phone: '',
      accessLevel: 'limited'
    });
    setShowAddModal(false);
  };

  const updateSecuritySettings = () => {
    if (securityEnabled && pinCode !== confirmPin) {
      Alert.alert('PIN Mismatch', 'Please ensure both PIN codes match.');
      return;
    }

    if (securityEnabled && pinCode.length < 4) {
      Alert.alert('Invalid PIN', 'PIN must be at least 4 digits long.');
      return;
    }

    Alert.alert(
      'Security Updated',
      securityEnabled 
        ? 'Family access is now protected with a PIN code.'
        : 'PIN protection has been disabled for family access.',
      [{ text: 'OK' }]
    );

    setPinCode('');
    setConfirmPin('');
    setShowSecurityModal(false);
  };

  const toggleMemberAccess = (memberId: string) => {
    Alert.alert(
      'Toggle Access',
      'This would enable/disable access for this family member.',
      [{ text: 'OK' }]
    );
  };

  const removeMember = (memberId: string, memberName: string) => {
    Alert.alert(
      'Remove Family Member',
      `Are you sure you want to remove ${memberName} from your care team? They will no longer have access to your health information.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => {
          Alert.alert('Removed', `${memberName} has been removed from your care team.`);
        }}
      ]
    );
  };

  const animatedSecurityStyle = useAnimatedStyle(() => ({
    transform: [{ scale: securityCardScale.value }],
  }));

  const animatedAddButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addButtonScale.value }],
  }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Family & Caregivers</Text>
        <Text style={styles.subtitle}>Manage who can access your health information</Text>
      </View>

      {/* Security Status */}
      <Animated.View 
        style={[styles.securityCard, animatedSecurityStyle]}
        entering={FadeInDown.duration(600).delay(100)}
      >
        <View style={styles.securityHeader}>
          <View style={[styles.securityIcon, { backgroundColor: securityEnabled ? '#10B98120' : '#F59E0B20' }]}>
            <Ionicons 
              name={securityEnabled ? "shield-checkmark" : "shield-outline"} 
              size={24} 
              color={securityEnabled ? "#10B981" : "#F59E0B"} 
            />
          </View>
          <View style={styles.securityInfo}>
            <Text style={styles.securityTitle}>
              {securityEnabled ? 'Protected Access' : 'Basic Access'}
            </Text>
            <Text style={styles.securityDescription}>
              {securityEnabled 
                ? 'Family access is protected with PIN authentication'
                : 'Consider enabling PIN protection for enhanced security'
              }
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.securityButton}
            onPress={() => setShowSecurityModal(true)}
          >
            <Text style={styles.securityButtonText}>Configure</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Quick Stats */}
      <Animated.View 
        style={styles.statsContainer}
        entering={FadeInDown.duration(600).delay(200)}
      >
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color="#3B82F6" />
          <Text style={styles.statValue}>{familyMembers.length}</Text>
          <Text style={styles.statLabel}>Total Members</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          <Text style={styles.statValue}>{familyMembers.filter(m => m.isActive).length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="shield-checkmark" size={24} color="#8B5CF6" />
          <Text style={styles.statValue}>{familyMembers.filter(m => m.accessLevel === 'full').length}</Text>
          <Text style={styles.statLabel}>Full Access</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="warning" size={24} color="#F59E0B" />
          <Text style={styles.statValue}>{familyMembers.filter(m => m.accessLevel === 'emergency').length}</Text>
          <Text style={styles.statLabel}>Emergency</Text>
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(600).delay(300)}
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <Animated.View style={animatedAddButtonStyle}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowAddModal(true)}
            >
              <Ionicons name="person-add" size={24} color="#3B82F6" />
              <Text style={styles.actionText}>Add Member</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowPermissionsModal(true)}
          >
            <Ionicons name="settings" size={24} color="#3B82F6" />
            <Text style={styles.actionText}>Permissions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share" size={24} color="#3B82F6" />
            <Text style={styles.actionText}>Share Report</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Family Members List */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(600).delay(400)}
      >
        <Text style={styles.sectionTitle}>Care Team Members ({familyMembers.length})</Text>
        {familyMembers.map((member, index) => (
          <Animated.View
            key={member.id}
            style={styles.memberCard}
            entering={FadeInDown.duration(400).delay(500 + index * 100)}
          >
            <View style={styles.memberInfo}>
              <View style={styles.memberHeader}>
                <View style={[styles.memberAvatar, { backgroundColor: `${getAccessLevelColor(member.accessLevel)}20` }]}>
                  <Ionicons 
                    name={getRelationshipIcon(member.relationship) as any} 
                    size={20} 
                    color={getAccessLevelColor(member.accessLevel)} 
                  />
                </View>
                <View style={styles.memberDetails}>
                  <View style={styles.memberNameRow}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: member.isActive ? '#10B981' : '#EF4444' }
                    ]} />
                  </View>
                  <Text style={styles.memberRelationship}>{member.relationship}</Text>
                  <Text style={styles.memberContact}>{member.email}</Text>
                </View>
                <View style={styles.memberStatus}>
                  <View style={[
                    styles.accessBadge,
                    { backgroundColor: `${getAccessLevelColor(member.accessLevel)}20` }
                  ]}>
                    <Ionicons 
                      name={getAccessLevelIcon(member.accessLevel) as any} 
                      size={14} 
                      color={getAccessLevelColor(member.accessLevel)} 
                    />
                    <Text style={[
                      styles.accessText,
                      { color: getAccessLevelColor(member.accessLevel) }
                    ]}>
                      {member.accessLevel.charAt(0).toUpperCase() + member.accessLevel.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.memberPermissions}>
                <Text style={styles.permissionsLabel}>Permissions:</Text>
                <View style={styles.permissionsList}>
                  {member.permissions.slice(0, 3).map((permission) => (
                    <View key={permission} style={styles.permissionTag}>
                      <Text style={styles.permissionTagText}>
                        {accessPermissions.find(p => p.id === permission)?.name || permission}
                      </Text>
                    </View>
                  ))}
                  {member.permissions.length > 3 && (
                    <View style={styles.permissionTag}>
                      <Text style={styles.permissionTagText}>+{member.permissions.length - 3} more</Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.memberFooter}>
                <Text style={styles.lastAccess}>Last access: {member.lastAccess}</Text>
                <View style={styles.memberActions}>
                  <TouchableOpacity 
                    style={styles.memberActionButton}
                    onPress={() => toggleMemberAccess(member.id)}
                  >
                    <Ionicons 
                      name={member.isActive ? "pause" : "play"} 
                      size={16} 
                      color="#3B82F6" 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.memberActionButton}
                    onPress={() => {
                      setSelectedMember(member);
                      setShowPermissionsModal(true);
                    }}
                  >
                    <Ionicons name="settings" size={16} color="#3B82F6" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.memberActionButton}
                    onPress={() => removeMember(member.id, member.name)}
                  >
                    <Ionicons name="trash" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        ))}
      </Animated.View>

      {/* Access Levels Info */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(600).delay(800)}
      >
        <Text style={styles.sectionTitle}>Access Levels</Text>
        <View style={styles.accessLevelsInfo}>
          <View style={styles.accessLevelItem}>
            <View style={[styles.accessLevelIcon, { backgroundColor: '#10B98120' }]}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            </View>
            <View style={styles.accessLevelContent}>
              <Text style={styles.accessLevelTitle}>Full Access</Text>
              <Text style={styles.accessLevelDescription}>
                Can view all health data, manage appointments, and receive all notifications
              </Text>
            </View>
          </View>
          
          <View style={styles.accessLevelItem}>
            <View style={[styles.accessLevelIcon, { backgroundColor: '#F59E0B20' }]}>
              <Ionicons name="shield-half" size={20} color="#F59E0B" />
            </View>
            <View style={styles.accessLevelContent}>
              <Text style={styles.accessLevelTitle}>Limited Access</Text>
              <Text style={styles.accessLevelDescription}>
                Can view basic health information and appointment schedules only
              </Text>
            </View>
          </View>
          
          <View style={styles.accessLevelItem}>
            <View style={[styles.accessLevelIcon, { backgroundColor: '#EF444420' }]}>
              <Ionicons name="shield" size={20} color="#EF4444" />
            </View>
            <View style={styles.accessLevelContent}>
              <Text style={styles.accessLevelTitle}>Emergency Only</Text>
              <Text style={styles.accessLevelDescription}>
                Only receives emergency notifications and critical health alerts
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Add Member Modal */}
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
            <Text style={styles.modalTitle}>Add Family Member</Text>
            <TouchableOpacity onPress={addFamilyMember}>
              <Text style={styles.modalSave}>Send Invite</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter full name"
                placeholderTextColor="#64748B"
                value={newMember.name}
                onChangeText={(text) => setNewMember({...newMember, name: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Relationship *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Spouse, Son, Daughter, Caregiver"
                placeholderTextColor="#64748B"
                value={newMember.relationship}
                onChangeText={(text) => setNewMember({...newMember, relationship: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter email address"
                placeholderTextColor="#64748B"
                value={newMember.email}
                onChangeText={(text) => setNewMember({...newMember, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter phone number"
                placeholderTextColor="#64748B"
                value={newMember.phone}
                onChangeText={(text) => setNewMember({...newMember, phone: text})}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Access Level *</Text>
              <View style={styles.accessLevelSelector}>
                {['full', 'limited', 'emergency'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.accessLevelOption,
                      newMember.accessLevel === level && styles.accessLevelOptionSelected,
                      { borderColor: getAccessLevelColor(level) }
                    ]}
                    onPress={() => setNewMember({...newMember, accessLevel: level as any})}
                  >
                    <Ionicons 
                      name={getAccessLevelIcon(level) as any} 
                      size={20} 
                      color={getAccessLevelColor(level)} 
                    />
                    <Text style={[
                      styles.accessLevelOptionText,
                      newMember.accessLevel === level && { color: getAccessLevelColor(level) }
                    ]}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Security Settings Modal */}
      <Modal
        visible={showSecurityModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSecurityModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Security Settings</Text>
            <TouchableOpacity onPress={updateSecuritySettings}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.securityOption}>
              <View style={styles.securityOptionInfo}>
                <Text style={styles.securityOptionTitle}>PIN Protection</Text>
                <Text style={styles.securityOptionDescription}>
                  Require a PIN code for family members to access your health data
                </Text>
              </View>
              <Switch
                value={securityEnabled}
                onValueChange={setSecurityEnabled}
                trackColor={{ false: '#475569', true: '#3B82F6' }}
                thumbColor={securityEnabled ? '#FFFFFF' : '#94A3B8'}
              />
            </View>

            {securityEnabled && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Set PIN Code *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter 4-6 digit PIN"
                    placeholderTextColor="#64748B"
                    value={pinCode}
                    onChangeText={setPinCode}
                    keyboardType="numeric"
                    secureTextEntry
                    maxLength={6}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Confirm PIN Code *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Re-enter PIN code"
                    placeholderTextColor="#64748B"
                    value={confirmPin}
                    onChangeText={setConfirmPin}
                    keyboardType="numeric"
                    secureTextEntry
                    maxLength={6}
                  />
                </View>
              </>
            )}

            <View style={styles.securityNote}>
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text style={styles.securityNoteText}>
                Family members will need to enter this PIN each time they access your health information. 
                You can change or disable this PIN at any time.
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Permissions Modal */}
      <Modal
        visible={showPermissionsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPermissionsModal(false)}>
              <Text style={styles.modalCancel}>Done</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {selectedMember ? `${selectedMember.name} Permissions` : 'Default Permissions'}
            </Text>
            <TouchableOpacity>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.permissionsDescription}>
              Configure what information this family member can access
            </Text>
            
            {accessPermissions.map((permission, index) => (
              <Animated.View
                key={permission.id}
                style={styles.permissionItem}
                entering={FadeInDown.duration(400).delay(100 + index * 50)}
              >
                <View style={[styles.permissionIcon, { backgroundColor: '#3B82F620' }]}>
                  <Ionicons name={permission.icon as any} size={20} color="#3B82F6" />
                </View>
                <View style={styles.permissionContent}>
                  <Text style={styles.permissionTitle}>{permission.name}</Text>
                  <Text style={styles.permissionDescription}>{permission.description}</Text>
                </View>
                <Switch
                  value={permission.enabled}
                  onValueChange={() => {}}
                  trackColor={{ false: '#475569', true: '#3B82F6' }}
                  thumbColor={permission.enabled ? '#FFFFFF' : '#94A3B8'}
                />
              </Animated.View>
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
  securityCard: {
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
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  securityDescription: {
    fontSize: 14,
    color: '#94A3B8',
  },
  securityButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  securityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
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
  memberCard: {
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
  memberInfo: {
    flex: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberDetails: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  memberRelationship: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 2,
  },
  memberContact: {
    fontSize: 12,
    color: '#64748B',
  },
  memberStatus: {
    alignItems: 'flex-end',
  },
  accessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  accessText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  memberPermissions: {
    marginBottom: 12,
  },
  permissionsLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 6,
  },
  permissionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  permissionTag: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  permissionTagText: {
    fontSize: 10,
    color: '#CBD5E1',
  },
  memberFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastAccess: {
    fontSize: 12,
    color: '#64748B',
  },
  memberActions: {
    flexDirection: 'row',
  },
  memberActionButton: {
    padding: 8,
    marginLeft: 4,
  },
  accessLevelsInfo: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  accessLevelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  accessLevelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accessLevelContent: {
    flex: 1,
  },
  accessLevelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  accessLevelDescription: {
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
  accessLevelSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accessLevelOption: {
    backgroundColor: '#334155',
    borderWidth: 2,
    borderColor: '#475569',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  accessLevelOptionSelected: {
    backgroundColor: '#1E293B',
  },
  accessLevelOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CBD5E1',
    marginTop: 4,
  },
  securityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  securityOptionInfo: {
    flex: 1,
    marginRight: 16,
  },
  securityOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  securityOptionDescription: {
    fontSize: 14,
    color: '#94A3B8',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1E40AF20',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  securityNoteText: {
    fontSize: 12,
    color: '#93C5FD',
    marginLeft: 8,
    flex: 1,
  },
  permissionsDescription: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  permissionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  permissionContent: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  permissionDescription: {
    fontSize: 12,
    color: '#94A3B8',
  },
});