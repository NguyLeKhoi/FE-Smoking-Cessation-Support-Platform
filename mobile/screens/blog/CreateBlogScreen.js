// CreateBlogScreen.js
// Màn hình tạo blog mobile

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import blogService from '../../service/blogService';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const MARKDOWN_GUIDE = [
  '# Heading 1',
  '## Heading 2',
  '**Bold text**',
  '*Italic text*',
  '[Link](url)',
  '![Image](url)',
  '- List item',
  '1. Numbered item',
  '`code`',
  '```code block```',
  '> Quote',
];

const POST_TYPES = [
  { value: '', label: 'Select post type' },
  { value: 'health_benefits', label: 'Health Benefits' },
  { value: 'success_stories', label: 'Success Stories' },
  { value: 'tools_and_tips', label: 'Tools & Tips' },
  { value: 'smoking_dangers', label: 'Smoking Dangers' },
  { value: 'support_resources', label: 'Support Resources' },
  { value: 'news_and_research', label: 'News & Research' },
];

function isValidUrl(url) {
  if (!url) return true; // Cho phép bỏ trống
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const CreateBlogScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('');

  const handleCreate = async () => {
    if (!title || !content || !type) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    if (thumbnail && !isValidUrl(thumbnail)) {
      Alert.alert('Error', 'Thumbnail URL is invalid. Please enter a valid URL (http/https).');
      return;
    }
    setLoading(true);
    try {
      const postData = { title, content, type };
      if (thumbnail) postData.thumbnail = thumbnail;
      await blogService.createPost(postData);
      Alert.alert('Success', 'Blog post created successfully!');
      navigation.goBack();
    } catch (error) {

      Alert.alert('Error', error?.response?.data?.message || error.message || 'Failed to create blog post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.header}>Create New Post</Text>
      <Text style={styles.subHeader}>Share your knowledge and experiences with the community.</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter post title"
          placeholderTextColor="#aaa"
        />
        <Text style={styles.label}>Post Type *</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={type}
            onValueChange={setType}
            style={styles.picker}
          >
            {POST_TYPES.map(opt => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>Content (Markdown) *</Text>
        <TextInput
          style={[styles.input, { height: 140, textAlignVertical: 'top' }]}
          value={content}
          onChangeText={setContent}
          placeholder="Enter post content"
          placeholderTextColor="#aaa"
          multiline
        />
        <Text style={styles.label}>Thumbnail URL</Text>
        <TextInput
          style={styles.input}
          value={thumbnail}
          onChangeText={setThumbnail}
          placeholder="Optional: Enter a URL for the post thumbnail image"
          placeholderTextColor="#aaa"
        />
        <Text style={styles.markdownGuideTitle}>Markdown Guide</Text>
        <View style={styles.markdownGuideBox}>
          {MARKDOWN_GUIDE.map((g, i) => (
            <Text key={i} style={styles.markdownGuideItem}>{g}</Text>
          ))}
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Publishing Info</Text>
          <Text style={styles.statusLine}><Text style={{ fontWeight: 'bold' }}>Status:</Text> Your post will be submitted for review</Text>
          <Text style={styles.statusLine}><Text style={{ fontWeight: 'bold' }}>Format:</Text> Markdown supported</Text>
        </View>
        <TouchableOpacity style={styles.createBtn} onPress={handleCreate} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="add" size={20} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.createBtnText}>Create Post</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f5f3', padding: 0 },
  header: { fontSize: 26, fontWeight: 'bold', marginTop: 24, marginBottom: 4, textAlign: 'center', color: '#222' },
  subHeader: { fontSize: 15, color: '#666', marginBottom: 18, textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginHorizontal: 8, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 4, color: '#222', fontSize: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, marginTop: 4, marginBottom: 8, fontSize: 16, backgroundColor: '#fafbfc', color: '#222' },
  createBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderRadius: 24, paddingVertical: 12, paddingHorizontal: 24, justifyContent: 'center', marginTop: 18, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, elevation: 2 },
  createBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 17, letterSpacing: 0.2 },
  markdownGuideTitle: { fontWeight: 'bold', marginTop: 18, marginBottom: 4, color: '#333', fontSize: 14 },
  markdownGuideBox: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 10, marginBottom: 8 },
  markdownGuideItem: { color: '#555', fontSize: 13, marginBottom: 2 },
  statusCard: { backgroundColor: '#f7fafc', borderRadius: 10, padding: 12, marginTop: 12, marginBottom: 8, borderWidth: 1, borderColor: '#e0e0e0' },
  statusTitle: { fontWeight: 'bold', color: '#1976d2', marginBottom: 4 },
  statusLine: { color: '#444', fontSize: 13, marginBottom: 2 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#fafbfc',
    overflow: 'hidden',
  },
  picker: {
    height: 60,
    width: '100%',
    fontSize: 16,
    paddingVertical: 8,
  },
});

export default CreateBlogScreen; 