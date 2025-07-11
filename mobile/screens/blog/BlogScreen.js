import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Alert, Text } from 'react-native';
import blogService from '../../service/blogService';
import BlogCard from '../../components/blog/BlogCard';

const BlogScreen = ({ navigation }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
    const unsubscribe = navigation.addListener('focus', fetchBlogs);
    return unsubscribe;
  }, [navigation]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await blogService.getAllPosts();
      let postsData = [];
      if (response && response.data && Array.isArray(response.data)) {
        postsData = response.data;
      } else if (Array.isArray(response)) {
        postsData = response;
      } else {
        postsData = [];
      }
      postsData = postsData.filter(post => post.status === 'APPROVED');
      setBlogs(postsData);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách blog');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (item) => {
    navigation.navigate('BlogDetail', { id: item._id || item.id });
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* <Button title="Tạo bài viết mới" onPress={() => navigation.navigate('CreateBlog')} /> */}
      {blogs.length === 0 ? (
        <Text style={{ marginTop: 32, textAlign: 'center' }}>Không có bài viết nào</Text>
      ) : (
        <FlatList
          data={blogs}
          keyExtractor={item => item._id || item.id}
          renderItem={({ item }) => (
            <BlogCard
              title={item.title}
              author={item.author?.name || item.first_name || item.last_name || 'Ẩn danh'}
              createdAt={item.createdAt?.slice(0, 10) || item.created_at?.slice(0, 10) || ''}
              thumbnail={item.thumbnail || item.cover || item.image}
              onPress={() => handlePress(item)}
            />
          )}
        />
      )}
    </View>
  );
};

export default BlogScreen; 