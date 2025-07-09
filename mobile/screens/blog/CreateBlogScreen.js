// CreateBlogScreen.js
// Màn hình tạo blog mobile

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import blogService from '../../service/blogService';

const CreateBlogScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title || !content) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }
    setLoading(true);
    try {
      await blogService.createPost({ title, content });
      Alert.alert('Thành công', 'Đã tạo bài viết mới');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo bài viết');
    } finally {
      setLoading(false);
    }
  };

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
      <Button title={loading ? 'Đang tạo...' : 'Tạo bài viết'} onPress={handleCreate} disabled={loading} />
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

export default CreateBlogScreen; 