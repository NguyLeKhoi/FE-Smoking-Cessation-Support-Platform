// EditBlogScreen.js
// Màn hình sửa blog mobile

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import blogService from '../../service/blogService';

const EditBlogScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const data = await blogService.getPostById(id);
      setTitle(data.title);
      setContent(data.content);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải chi tiết blog');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !content) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }
    setSaving(true);
    try {
      await blogService.updatePost(id, { title, content });
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
    <View style={styles.container}>
      <Text style={styles.label}>Tiêu đề</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Nhập tiêu đề"
      />
      <Text style={styles.label}>Nội dung</Text>
      <TextInput
        style={[styles.input, { height: 120 }]}
        value={content}
        onChangeText={setContent}
        placeholder="Nhập nội dung"
        multiline
      />
      <Button title={saving ? 'Đang lưu...' : 'Lưu thay đổi'} onPress={handleSave} disabled={saving} />
    </View>
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