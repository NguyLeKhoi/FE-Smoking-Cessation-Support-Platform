import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Alert, Button } from 'react-native';
import blogService from '../../service/blogService';
import BlogCard from '../../components/BlogCard';

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
      const data = await blogService.getAllPosts();
      setBlogs(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách blog');
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (item) => {
    navigation.navigate('BlogDetail', { id: item._id });
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Tạo bài viết mới" onPress={() => navigation.navigate('CreateBlog')} />
      <FlatList
        data={blogs}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <BlogCard
            title={item.title}
            author={item.author?.name || 'Ẩn danh'}
            createdAt={item.createdAt?.slice(0, 10) || ''}
            onPress={() => handlePress(item)}
          />
        )}
      />
    </View>
  );
};

export default BlogScreen; 