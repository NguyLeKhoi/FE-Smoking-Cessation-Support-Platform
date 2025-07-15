import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert, Button } from 'react-native';
import blogService from '../../service/blogService';
import BlogDetails from '../../components/blog/BlogDetails';

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
  if (!blog) return null;

  // Ưu tiên các trường content, body, description
  const blogContent = blog.content || blog.body || blog.description || '';

  return (
    <View style={{ flex: 1 }}>
      <BlogDetails
        title={blog.data?.title}
        author={
          blog.data?.first_name
            ? `${blog.data.first_name} ${blog.data.last_name || ''}`
            : 'Ẩn danh'
        }
        createdAt={
          blog.data?.created_at
            ? blog.data.created_at.slice(0, 10)
            : ''
        }
        content={blog.data?.content || blog.data?.body || blog.data?.description || ''}
        thumbnail={blog.data?.thumbnail || blog.data?.cover || blog.data?.image}
      />
      {/* <Button title="Sửa bài viết" onPress={() => navigation.navigate('EditBlog', { id: blog._id || blog.id })} /> */}
      {/* <View style={{ height: 12 }} /> */}
      {/* <Button title={deleting ? 'Đang xóa...' : 'Xóa bài viết'} color="red" onPress={handleDelete} disabled={deleting} /> */}
    </View>
  );
};

export default BlogDetailScreen; 