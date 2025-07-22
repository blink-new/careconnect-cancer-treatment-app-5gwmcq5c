import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

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

  const familyMembers: FamilyMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Spouse',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      accessLevel: 'full',
      isActive: true,
      lastAccess: '2 hours ago'
    },
    {
      id: '2',
      name: 'Michael Johnson',
      relationship: 'Son',
      email: 'michael.j@email.com',
      phone: '+1 (555) 987-6543',
      accessLevel: 'limited',
      isActive: true,
      lastAccess: '1 day ago'
    },
    {
      id: '3',
      name: 'Dr. Emily Chen',
      relationship: 'Primary Caregiver',
      email: 'dr.chen@hospital.com',
      phone: '+1 (555) 456-7890',
      accessLevel: 'full',
      isActive: true,
      lastAccess: '3 hours ago'
    },
    {
      id: '4',
      name: 'Lisa Martinez',
      relationship: 'Sister',
      email: 'lisa.martinez@email.com',
      phone: '+1 (555) 321-0987',
      accessLevel: 'emergency',
      isActive: false,
      lastAccess: '1 week ago'
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

  const addFamilyMember = () => {
    if (!newMember.name || !newMember.relationship || !newMember.email) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Family & Caregivers</Text>
        <Text style={styles.subtitle}>Manage who can access your health information</Text>
      </View>

      {/* Security Status */}
      <Animated.View 
        style={styles.securityCard}
        entering={FadeInDown.duration(400).delay(100)}
      >
        <View style={styles.securityHeader}>
          <View style={styles.securityIcon}>
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

      {/* Quick Actions */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(200)}
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="person-add" size={24} color="#3B82F6" />
            <Text style={styles.actionText}>Add Member</Text>
          </TouchableOpacity>
          
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
        entering={FadeInDown.duration(400).delay(300)}
      >
        <Text style={styles.sectionTitle}>Care Team Members ({familyMembers.length})</Text>
        {familyMembers.map((member) => (
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberInfo}>
              <View style={styles.memberHeader}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberInitials}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.memberDetails}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRelationship}>{member.relationship}</Text>
                  <Text style={styles.memberContact}>{member.email}</Text>
                </View>
                <View style={styles.memberStatus}>
                  <View style={[
                    styles.accessBadge,
                    { backgroundColor: `${getAccessLevelColor(member.accessLevel)}15` }
                  ]}>
                    <Ionicons 
                      name={getAccessLevelIcon(member.accessLevel) as any} 
                      size={16} 
                      color={getAccessLevelColor(member.accessLevel)} 
                    />
                    <Text style={[
                      styles.accessText,
                      { color: getAccessLevelColor(member.accessLevel) }
                    ]}>
                      {member.accessLevel.charAt(0).toUpperCase() + member.accessLevel.slice(1)}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: member.isActive ? '#10B981' : '#EF4444' }
                  ]} />
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
          </View>
        ))}
      </Animated.View>

      {/* Access Levels Info */}
      <Animated.View 
        style={styles.section}
        entering={FadeInDown.duration(400).delay(400)}
      >
        <Text style={styles.sectionTitle}>Access Levels</Text>
        <View style={styles.accessLevelsInfo}>
          <View style={styles.accessLevelItem}>
            <View style={[styles.accessLevelIcon, { backgroundColor: '#10B98115' }]}>
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
            <View style={[styles.accessLevelIcon, { backgroundColor: '#F59E0B15' }]}>
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
            <View style={[styles.accessLevelIcon, { backgroundColor: '#EF444415' }]}>
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
                value={newMember.name}
                onChangeText={(text) => setNewMember({...newMember, name: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Relationship *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Spouse, Son, Daughter, Caregiver"
                value={newMember.relationship}
                onChangeText={(text) => setNewMember({...newMember, relationship: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter email address"
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
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={securityEnabled ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            {securityEnabled && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Set PIN Code *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter 4-6 digit PIN"
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
            
            {accessPermissions.map((permission) => (
              <View key={permission.id} style={styles.permissionItem}>
                <View style={styles.permissionIcon}>
                  <Ionicons name={permission.icon as any} size={20} color="#3B82F6" />
                </View>
                <View style={styles.permissionContent}>
                  <Text style={styles.permissionTitle}>{permission.name}</Text>
                  <Text style={styles.permissionDescription}>{permission.description}</Text>
                </View>
                <Switch
                  value={permission.enabled}
                  onValueChange={() => {}}
                  trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                  thumbColor={permission.enabled ? '#FFFFFF' : '#FFFFFF'}
                />
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
  securityCard: {
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
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
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
    color: '#1F2937',
    marginBottom: 4,
  },
  securityDescription: {
    fontSize: 14,
    color: '#6B7280',
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
  memberCard: {
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
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInitials: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  memberRelationship: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  memberContact: {
    fontSize: 12,
    color: '#9CA3AF',
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
    marginBottom: 4,
  },
  accessText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  memberFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastAccess: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  memberActions: {
    flexDirection: 'row',
  },
  memberActionButton: {
    padding: 8,
    marginLeft: 4,
  },
  accessLevelsInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#1F2937',
    marginBottom: 2,
  },
  accessLevelDescription: {
    fontSize: 12,
    color: '#6B7280',
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
  accessLevelSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accessLevelOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  accessLevelOptionSelected: {
    backgroundColor: '#F8FAFC',
  },
  accessLevelOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 4,
  },
  securityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  securityOptionInfo: {
    flex: 1,
    marginRight: 16,
  },
  securityOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  securityOptionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  securityNoteText: {
    fontSize: 12,
    color: '#1E40AF',
    marginLeft: 8,
    flex: 1,
  },
  permissionsDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  permissionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF4FF',
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
    color: '#1F2937',
    marginBottom: 2,
  },
  permissionDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
});