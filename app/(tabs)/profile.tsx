import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

export default function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  // Animation values
  const avatarScale = useSharedValue(1);
  const cardScale = useSharedValue(0.95);

  useEffect(() => {
    cardScale.value = withSpring(1, { damping: 15 });
  }, []);

  const profileSections = [
    {
      title: 'Personal Information',
      items: [
        { label: 'Edit Profile', icon: 'person-outline', action: () => handleEditProfile(), hasArrow: true },
        { label: 'Emergency Contacts', icon: 'call-outline', action: () => handleEmergencyContacts(), hasArrow: true },
        { label: 'Insurance Information', icon: 'card-outline', action: () => handleInsurance(), hasArrow: true },
      ]
    },
    {
      title: 'Medical Information',
      items: [
        { label: 'Medical History', icon: 'medical-outline', action: () => handleMedicalHistory(), hasArrow: true },
        { label: 'Allergies & Medications', icon: 'warning-outline', action: () => handleAllergies(), hasArrow: true },
        { label: 'Care Team', icon: 'people-outline', action: () => handleCareTeam(), hasArrow: true },
      ]
    },
    {
      title: 'App Settings',
      items: [
        { 
          label: 'Notifications', 
          icon: 'notifications-outline', 
          action: () => {}, 
          hasSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: setNotificationsEnabled
        },
        { 
          label: 'Dark Mode', 
          icon: 'moon-outline', 
          action: () => {}, 
          hasSwitch: true,
          switchValue: darkModeEnabled,
          onSwitchChange: setDarkModeEnabled
        },
        { 
          label: 'Biometric Login', 
          icon: 'finger-print-outline', 
          action: () => {}, 
          hasSwitch: true,
          switchValue: biometricsEnabled,
          onSwitchChange: setBiometricsEnabled
        },
        { label: 'Privacy & Security', icon: 'shield-outline', action: () => handlePrivacy(), hasArrow: true },
        { label: 'Export Data', icon: 'download-outline', action: () => handleExportData(), hasArrow: true },
      ]
    },
    {
      title: 'Support & Information',
      items: [
        { label: 'Help Center', icon: 'help-circle-outline', action: () => handleHelp(), hasArrow: true },
        { label: 'Contact Support', icon: 'mail-outline', action: () => handleSupport(), hasArrow: true },
        { label: 'Terms of Service', icon: 'document-text-outline', action: () => handleTerms(), hasArrow: true },
        { label: 'Privacy Policy', icon: 'lock-closed-outline', action: () => handlePrivacyPolicy(), hasArrow: true },
        { label: 'App Version', icon: 'information-circle-outline', action: () => {}, value: '1.2.0' },
      ]
    }
  ];

  const healthStats = [
    { label: 'Days Tracked', value: '24', icon: 'calendar', color: '#3B82F6' },
    { label: 'Appointments', value: '8', icon: 'medical', color: '#10B981' },
    { label: 'Care Team', value: '5', icon: 'people', color: '#8B5CF6' },
    { label: 'Medications', value: '3', icon: 'tablet-portrait', color: '#F59E0B' },
  ];

  const recentActivity = [
    { action: 'Logged symptoms', time: '2 hours ago', icon: 'heart', color: '#EF4444' },
    { action: 'Took medication', time: '4 hours ago', icon: 'medical', color: '#10B981' },
    { action: 'Completed appointment', time: 'Yesterday', icon: 'checkmark-circle', color: '#3B82F6' },
    { action: 'Updated vitals', time: '2 days ago', icon: 'pulse', color: '#F59E0B' },
  ];

  const handleAvatarPress = () => {
    avatarScale.value = withSpring(0.9, {}, () => {
      avatarScale.value = withSpring(1);
    });
    
    Alert.alert(
      'Change Profile Photo',
      'Choose how you\'d like to update your profile photo',
      [
        { text: 'Camera', onPress: () => Alert.alert('Camera', 'Camera functionality would open here') },
        { text: 'Photo Library', onPress: () => Alert.alert('Library', 'Photo library would open here') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing interface would open here');
  };

  const handleEmergencyContacts = () => {
    Alert.alert('Emergency Contacts', 'Emergency contacts management would open here');
  };

  const handleInsurance = () => {
    Alert.alert('Insurance', 'Insurance information management would open here');
  };

  const handleMedicalHistory = () => {
    Alert.alert('Medical History', 'Medical history interface would open here');
  };

  const handleAllergies = () => {
    Alert.alert('Allergies & Medications', 'Allergies and medications management would open here');
  };

  const handleCareTeam = () => {
    Alert.alert('Care Team', 'Care team management would open here');
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy & Security', 'Privacy and security settings would open here');
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This will generate a comprehensive report of your health data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => Alert.alert('Success', 'Data export initiated. You\'ll receive an email when ready.') }
      ]
    );
  };

  const handleHelp = () => {
    Alert.alert('Help Center', 'Help center would open here');
  };

  const handleSupport = () => {
    Alert.alert('Contact Support', 'Support contact interface would open here');
  };

  const handleTerms = () => {
    Alert.alert('Terms of Service', 'Terms of service would open here');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy would open here');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of CareConnect?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {
          Alert.alert('Signed Out', 'You have been signed out successfully.');
        }}
      ]
    );
  };

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <Animated.View 
        style={styles.profileHeader}
        entering={FadeInDown.duration(600).delay(100)}
      >
        <Animated.View style={[styles.avatarContainer, animatedAvatarStyle]}>
          <TouchableOpacity onPress={handleAvatarPress}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' }}
              style={styles.avatar}
            />
            <View style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@email.com</Text>
        <Text style={styles.patientId}>Patient ID: #CC-12345</Text>
        
        <View style={styles.membershipBadge}>
          <Ionicons name="shield-checkmark" size={16} color="#10B981" />
          <Text style={styles.membershipText}>Verified Patient</Text>
        </View>
      </Animated.View>

      {/* Health Stats */}
      <Animated.View 
        style={[styles.statsContainer, animatedCardStyle]}
        entering={FadeInDown.duration(600).delay(200)}
      >
        <Text style={styles.statsTitle}>Health Overview</Text>
        <View style={styles.statsGrid}>
          {healthStats.map((stat, index) => (
            <Animated.View
              key={stat.label}
              style={styles.statCard}
              entering={FadeInUp.duration(400).delay(300 + index * 100)}
            >
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Recent Activity */}
      <Animated.View 
        style={styles.activityContainer}
        entering={FadeInDown.duration(600).delay(400)}
      >
        <Text style={styles.activityTitle}>Recent Activity</Text>
        {recentActivity.map((activity, index) => (
          <Animated.View
            key={index}
            style={styles.activityItem}
            entering={FadeInDown.duration(400).delay(500 + index * 100)}
          >
            <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}>
              <Ionicons name={activity.icon as any} size={16} color={activity.color} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityAction}>{activity.action}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </Animated.View>
        ))}
      </Animated.View>

      {/* Profile Sections */}
      {profileSections.map((section, sectionIndex) => (
        <Animated.View 
          key={section.title}
          style={styles.section}
          entering={FadeInDown.duration(600).delay(600 + sectionIndex * 100)}
        >
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity 
                key={item.label}
                style={[
                  styles.menuItem,
                  itemIndex === section.items.length - 1 && styles.lastMenuItem
                ]}
                onPress={item.action}
                disabled={item.hasSwitch}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconContainer}>
                    <Ionicons name={item.icon as any} size={20} color="#3B82F6" />
                  </View>
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  {item.value && (
                    <Text style={styles.menuItemValue}>{item.value}</Text>
                  )}
                  {item.hasSwitch && (
                    <Switch
                      value={item.switchValue}
                      onValueChange={item.onSwitchChange}
                      trackColor={{ false: '#475569', true: '#3B82F6' }}
                      thumbColor={item.switchValue ? '#FFFFFF' : '#94A3B8'}
                    />
                  )}
                  {item.hasArrow && (
                    <Ionicons name="chevron-forward" size={16} color="#64748B" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      ))}

      {/* Quick Actions */}
      <Animated.View 
        style={styles.quickActionsContainer}
        entering={FadeInDown.duration(600).delay(1000)}
      >
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionCard}>
            <Ionicons name="share-outline" size={24} color="#3B82F6" />
            <Text style={styles.quickActionText}>Share Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <Ionicons name="qr-code-outline" size={24} color="#10B981" />
            <Text style={styles.quickActionText}>QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <Ionicons name="print-outline" size={24} color="#8B5CF6" />
            <Text style={styles.quickActionText}>Print Summary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <Ionicons name="cloud-download-outline" size={24} color="#F59E0B" />
            <Text style={styles.quickActionText}>Backup Data</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Sign Out Button */}
      <Animated.View 
        style={styles.signOutContainer}
        entering={FadeInDown.duration(600).delay(1200)}
      >
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* App Info */}
      <Animated.View 
        style={styles.appInfo}
        entering={FadeInDown.duration(600).delay(1400)}
      >
        <Text style={styles.appInfoText}>CareConnect v1.2.0</Text>
        <Text style={styles.appInfoSubtext}>© 2024 CareConnect Health Solutions</Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#334155',
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1E293B',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 4,
  },
  patientId: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98120',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  membershipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 6,
  },
  statsContainer: {
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
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  activityContainer: {
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
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#334155',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#475569',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E40AF20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#F8FAFC',
    fontWeight: '500',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 14,
    color: '#94A3B8',
    marginRight: 8,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  quickActionText: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 8,
    textAlign: 'center',
  },
  signOutContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#7F1D1D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  signOutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  appInfoText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  appInfoSubtext: {
    fontSize: 12,
    color: '#475569',
  },
});