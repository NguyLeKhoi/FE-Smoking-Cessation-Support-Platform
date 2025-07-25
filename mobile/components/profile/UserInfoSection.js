import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import theme from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';

const UserInfoSection = ({ 
  user, 
  formData, 
  isEditing, 
  onEditToggle, 
  onInputChange, 
  onSave, 
  onOpenDrawer 
}) => {
  return (
    <View style={[styles.container, { position: 'relative' }]}>
      {/* Nút mở drawer ở góc trên trái card */}
      {onOpenDrawer && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 12,
            top: 12,
            backgroundColor: '#fff',
            borderRadius: 20,
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 2,
            borderWidth: 1,
            borderColor: '#eee',
            zIndex: 10,
          }}
          onPress={onOpenDrawer}
        >
          <Ionicons name="chevron-forward" size={22} color="#888" />
        </TouchableOpacity>
      )}
      <View style={styles.avatarSection}>
        {formData.avatar ? (
          <Image source={{ uri: formData.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {user.username ? user.username.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        )}
        
        {isEditing && (
          <TextInput
            style={styles.avatarInput}
            placeholder="Nhập URL avatar"
            value={formData.avatar}
            onChangeText={(value) => onInputChange('avatar', value)}
          />
        )}
        
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.memberSince}>Member since {user.joined}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {!isEditing ? (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={onEditToggle}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={onEditToggle}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={onSave}
              >
                <Text style={styles.saveButtonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.formRow}>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>First Name</Text>
            <TextInput
              style={[styles.textInput, !isEditing && styles.readOnlyInput]}
              value={formData.first_name}
              onChangeText={(value) => onInputChange('first_name', value)}
              editable={isEditing}
              placeholder="Enter first name"
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Last Name</Text>
            <TextInput
              style={[styles.textInput, !isEditing && styles.readOnlyInput]}
              value={formData.last_name}
              onChangeText={(value) => onInputChange('last_name', value)}
              editable={isEditing}
              placeholder="Enter last name"
            />
          </View>
        </View>

        <View style={styles.formRow}>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={[styles.textInput, styles.readOnlyInput]}
              value={formData.email}
              editable={false}
              placeholder="Email"
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <TextInput
              style={[styles.textInput, !isEditing && styles.readOnlyInput]}
              value={formData.phone_number}
              onChangeText={(value) => onInputChange('phone_number', value)}
              editable={isEditing}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Date of Birth</Text>
          {isEditing ? (
            <TextInput
              style={styles.textInput}
              value={formData.dob ? formData.dob.split('T')[0] : ''}
              onChangeText={(value) => onInputChange('dob', value)}
              placeholder="YYYY-MM-DD"
            />
          ) : (
            <Text style={styles.readOnlyText}>
              {user.dob ? user.dob.split('T')[0] : 'Chưa cung cấp'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.paper,
    borderRadius: theme.borderRadius,
    padding: theme.padding,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 48,
    color: '#666',
  },
  avatarInput: {
    borderWidth: 1,
    borderColor: theme.colors.divider,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    width: '100%',
    fontSize: 14,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  infoSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  editButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: theme.colors.divider,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  formField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.divider,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  readOnlyInput: {
    backgroundColor: '#f5f5f5',
    color: theme.colors.textSecondary,
  },
  readOnlyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    paddingVertical: 12,
  },
});

export default UserInfoSection; 