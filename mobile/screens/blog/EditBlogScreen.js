// EditBlogScreen.js
// Màn hình sửa blog mobile

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import blogService from '../../service/blogService';
import { MaterialIcons } from '@expo/vector-icons';

const STATUS_LABELS = {
  APPROVED: { label: 'Approved', color: '#4caf50' },
  PENDING: { label: 'Pending Review', color: '#ff9800' },
  REJECTED: { label: 'Rejected', color: '#f44336' },
  UPDATING: { label: 'Updating', color: '#2196f3' },
  DRAFT: { label: 'Draft', color: '#757575' },
};
function getStatusChip(status) {
  const s = STATUS_LABELS[status?.toUpperCase()] || STATUS_LABELS.DRAFT;
  return (
    <View style={{ alignSelf: 'flex-start', backgroundColor: s.color + '22', borderColor: s.color, borderWidth: 1, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 2, marginBottom: 8 }}>
      <Text style={{ color: s.color, fontWeight: 'bold', fontSize: 13 }}>{s.label}</Text>
    </View>
  );
}

const EditBlogScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [updatedAt, setUpdatedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogService.getPostById(id);
        const post = data.data || data;
        setTitle(post.title || '');
        setContent(post.content || '');
        setThumbnail(post.thumbnail || '');
        setStatus(post.status || 'DRAFT');
        setUpdatedAt(post.updated_at || post.updatedAt || '');
      } catch (error) {
        Alert.alert('Error', 'Failed to load blog details');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleSave = async () => {
    if (!title || !content) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }
    setSaving(true);
    try {
      await blogService.updatePost(id, { title, content, thumbnailUrl: thumbnail, status });
      Alert.alert('Thành công', 'Đã cập nhật bài viết');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật bài viết');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f6f5f3' }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 8, color: '#222' }}>Edit Post</Text>
      {getStatusChip(status)}
      <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 18, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 }}>
        <Text style={{ fontWeight: 'bold', marginTop: 8, marginBottom: 4, color: '#222', fontSize: 15 }}>Title *</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, marginTop: 4, marginBottom: 8, fontSize: 16, backgroundColor: '#fafbfc', color: '#222' }}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter post title"
          placeholderTextColor="#aaa"
        />
        <Text style={{ fontWeight: 'bold', marginTop: 8, marginBottom: 4, color: '#222', fontSize: 15 }}>Content (Markdown) *</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, marginTop: 4, marginBottom: 8, fontSize: 16, backgroundColor: '#fafbfc', color: '#222', height: 120, textAlignVertical: 'top' }}
          value={content}
          onChangeText={setContent}
          placeholder="Enter post content"
          placeholderTextColor="#aaa"
          multiline
        />
        <Text style={{ fontWeight: 'bold', marginTop: 8, marginBottom: 4, color: '#222', fontSize: 15 }}>Thumbnail URL</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, marginTop: 4, marginBottom: 8, fontSize: 16, backgroundColor: '#fafbfc', color: '#222' }}
          value={thumbnail}
          onChangeText={setThumbnail}
          placeholder="Optional: Enter a URL for the post thumbnail image"
          placeholderTextColor="#aaa"
        />
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} style={{ width: 80, height: 80, borderRadius: 12, marginTop: 8, alignSelf: 'center' }} />
        ) : null}
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderRadius: 24, paddingVertical: 12, paddingHorizontal: 24, justifyContent: 'center', marginTop: 18, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, elevation: 2 }} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="save" size={20} color="#fff" style={{ marginRight: 6 }} />
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17, letterSpacing: 0.2 }}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: '#f7fafc', borderRadius: 10, padding: 12, marginTop: 12, marginBottom: 8, borderWidth: 1, borderColor: '#e0e0e0' }}>
        <Text style={{ fontWeight: 'bold', color: '#1976d2', marginBottom: 4 }}>Post Information</Text>
        <Text style={{ color: '#444', fontSize: 13, marginBottom: 2 }}>Status: {status}</Text>
        <Text style={{ color: '#444', fontSize: 13, marginBottom: 2 }}>Last Updated: {updatedAt}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: 'bold', marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default EditBlogScreen; 