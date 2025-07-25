import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  ActivityIndicator, 
  Alert, 
  StyleSheet, 
  Text,
  TouchableOpacity 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import blogService from '../../service/blogService';
import { isAuthenticated } from '../../service/authService';
import BlogDetails from '../../components/blog/BlogDetails';
import theme from '../../theme/theme';

const BlogDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [authError, setAuthError] = useState(false);

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      setAuthError(false);
      
      // Check authentication first
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        setAuthError(true);
        return;
      }
      
      const data = await blogService.getPostById(id);
      setBlog(data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      
      if (error.message === 'You need to log in to view this content') {
        setAuthError(true);
      } else {
        Alert.alert('Error', error.message || 'Failed to load blog details');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch blog when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchBlog();
      
      // Cleanup function
      return () => {
        // Any cleanup if needed
      };
    }, [fetchBlog])
  );

  const handleDelete = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', 
        style: 'destructive', 
        onPress: async () => {
          setDeleting(true);
          try {
            await blogService.deletePost(id);
            Alert.alert('Success', 'Post deleted successfully');
            navigation.goBack();
          } catch (error) {
            console.error('Delete error:', error);
            Alert.alert('Error', error.message || 'Failed to delete post');
          } finally {
            setDeleting(false);
          }
        }
      }
    ]);
  };

  const handleLoginPress = () => {
    navigation.navigate('Login', { 
      screen: 'BlogDetail', 
      params: { id } 
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (authError) {
    return (
      <View style={styles.authContainer}>
        <MaterialIcons name="lock-outline" size={64} color="#666" />
        <Text style={styles.authTitle}>Authentication Required</Text>
        <Text style={styles.authMessage}>
          You need to be logged in to view this content.
        </Text>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLoginPress}
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!blog) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#ff4444" />
        <Text style={styles.errorText}>Failed to load blog post.</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchBlog}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <BlogDetails
      title={blog.title || blog.data?.title}
      author={
        blog.author || 
        (blog.data?.first_name
          ? `${blog.data.first_name} ${blog.data.last_name || ''}`.trim()
          : 'Anonymous')
      }
      createdAt={
        blog.created_at || 
        (blog.data?.created_at ? blog.data.created_at.slice(0, 10) : '')
      }
      content={blog.content || blog.body || blog.description || blog.data?.content || blog.data?.body || blog.data?.description || ''}
      thumbnail={blog.thumbnail || blog.image || blog.data?.thumbnail || blog.data?.cover || blog.data?.image}
      postId={id}
      navigation={navigation}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  authTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  authMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  retryButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default BlogDetailScreen;