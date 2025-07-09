import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, Button } from 'react-native';
import blogService from '../../service/blogService';

const BlogDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const data = await blogService.getPostById(id);
      setBlog(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải chi tiết blog');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa bài viết này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa', style: 'destructive', onPress: async () => {
          setDeleting(true);
          try {
            await blogService.deletePost(id);
            Alert.alert('Thành công', 'Đã xóa bài viết');
            navigation.goBack();
          } catch (error) {
            Alert.alert('Lỗi', 'Không thể xóa bài viết');
          } finally {
            setDeleting(false);
          }
        }
      }
    ]);
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (!blog) return <Text>Không tìm thấy bài viết</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>{blog.title}</Text>
      <Text style={{ color: '#666', marginBottom: 8 }}>Tác giả: {blog.author?.name || 'Ẩn danh'}</Text>
      <Text style={{ color: '#999', marginBottom: 16 }}>Ngày đăng: {blog.createdAt?.slice(0, 10) || ''}</Text>
      <Text style={{ fontSize: 16, marginBottom: 24 }}>{blog.content}</Text>
      <Button title="Sửa bài viết" onPress={() => navigation.navigate('EditBlog', { id: blog._id })} />
      <View style={{ height: 12 }} />
      <Button title={deleting ? 'Đang xóa...' : 'Xóa bài viết'} color="red" onPress={handleDelete} disabled={deleting} />
    </View>
  );
};

export default BlogDetailScreen; 