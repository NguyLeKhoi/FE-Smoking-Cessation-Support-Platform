import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../theme/theme';
import CommentCard from './CommentCard';
import commentService from '../../service/commentService';
import { isAuthenticated, parseJwt } from '../../service/authService';

const CommentsSection = ({ postId, navigation }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const scrollViewRef = useRef();
  const [isMounted, setIsMounted] = useState(true);
  
  // Get current user from AsyncStorage
  const getCurrentUser = useCallback(async () => {
    try {
      // First check if user is authenticated
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        if (isMounted) {
          setCurrentUser(null);
        }
        return null;
      }

      // Get user data from storage
      const [userString, token] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('accessToken')
      ]);
      
      if (!token) {
        throw new Error('No access token found');
      }

      // Parse token to get user info
      const decoded = parseJwt(token);
      if (!decoded) {
        throw new Error('Invalid token format');
      }
      
      // Use user from storage if available, otherwise create from token
      let user = null;
      
      if (userString) {
        try {
          const parsedUser = JSON.parse(userString);
          // Validate user data
          if (parsedUser && parsedUser.id) {
            user = parsedUser;
          }
        } catch (e) {
          console.warn('Failed to parse user data from storage:', e);
        }
      }
      
      // If no valid user from storage, create from token
      if (!user) {
        user = {
          id: decoded.sub,
          email: decoded.email,
          first_name: decoded.first_name || decoded.username || 'User',
          last_name: decoded.last_name || '',
          role: decoded.role
        };
        // Save to storage for future use
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
      
      // Update state if component is still mounted
      if (isMounted) {
        setCurrentUser(user);
      }
      
      return user;
      
    } catch (error) {
      console.error('Error getting current user:', error);
      if (isMounted) {
        setCurrentUser(null);
      }
      // Clear any invalid auth data
      await Promise.all([
        AsyncStorage.removeItem('accessToken'),
        AsyncStorage.removeItem('user')
      ]);
      return null;
    }
  }, [isMounted]);
  
  // Check if user is authenticated and update state
  const checkAuth = useCallback(async () => {
    try {
      const authenticated = await isAuthenticated();
      
      if (authenticated) {
        const user = await getCurrentUser();
        return !!user;
      } else {
        if (isMounted) {
          setCurrentUser(null);
        }
        return false;
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      if (isMounted) {
        setCurrentUser(null);
      }
      return false;
    }
  }, [getCurrentUser, isMounted]);
  
  // Set up auth state listener and initial check
  useEffect(() => {
    // Initial auth check
    checkAuth();
    
    // Set up interval to check auth state periodically
    const authCheckInterval = setInterval(() => {
      checkAuth();
    }, 3000); // Check every 3 seconds
    
    // Set up focus listener to check auth when screen comes into focus
    const focusListener = navigation.addListener('focus', () => {
      checkAuth();
    });
    
    return () => {
      setIsMounted(false);
      clearInterval(authCheckInterval);
      focusListener();
    };
  }, [checkAuth, navigation]);
  
  // Process comments to build the nested structure
  const processComments = useCallback((commentsList) => {
    const commentMap = {};
    const result = [];
    
    // First pass: create a map of comments by ID and initialize replies array
    commentsList.forEach(comment => {
      comment.replies = [];
      commentMap[comment.id] = comment;
    });
    
    // Second pass: build the nested structure
    commentsList.forEach(comment => {
      if (comment.parent_comment_id && commentMap[comment.parent_comment_id]) {
        // This is a reply, add it to its parent's replies
        commentMap[comment.parent_comment_id].replies.push(comment);
      } else {
        // This is a top-level comment
        result.push(comment);
      }
    });
    
    return result;
  }, []);
  
  // Render a single comment and its replies recursively
  const renderComment = (comment, isReply = false, index = 0) => {
    // Create a unique key for each comment using its ID and index
    const commentKey = `comment-${comment.id}-${index}`;
    
    return (
      <View key={commentKey} style={[styles.commentContainer, isReply && styles.replyContainer]}>
        <CommentCard
          comment={{
            id: comment.id,
            content: comment.content,
            created_at: comment.created_at,
            // Use comment.user if it exists, otherwise use comment.users (for backward compatibility)
            user: comment.user || comment.users || { first_name: 'User', last_name: '' },
            // Also pass the user object directly to users for compatibility with web
            users: comment.users || comment.user,
            user_id: comment.user_id,
            isOwner: currentUser?.id === comment.user_id
          }}
          currentUserId={currentUser?.id}
          onReply={() => handleReply(comment)}
          onDelete={() => handleDeleteComment(comment.id)}
        />
        
        {/* Render replies if any */}
        {comment.replies && comment.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {comment.replies.map((reply, replyIndex) => 
              renderComment(reply, true, replyIndex)
            )}
          </View>
        )}
      </View>
    );
  };
  
  // Render the comment input area
  const renderCommentInput = () => {
    // Only show login prompt if not authenticated
    if (!currentUser) {
      return (
        <View style={styles.loginPrompt}>
          <Text style={styles.loginText}>Đăng nhập để bình luận</Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Login')}
            style={styles.loginButton}
            labelStyle={styles.loginButtonLabel}
          >
            Đăng nhập ngay
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.commentInputContainer}>
        {replyingTo && (
          <View style={styles.replyingToContainer}>
            <Text style={styles.replyingToText}>
              Đang trả lời {replyingTo.user?.first_name || 'người dùng'}
            </Text>
            <TouchableOpacity onPress={cancelReply} style={styles.cancelReplyButton}>
              <MaterialIcons name="close" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.inputWrapper}>
          <View style={styles.avatarContainer}>
            <MaterialIcons 
              name="account-circle" 
              size={40} 
              color={theme.colors.primary} 
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Thêm bình luận của bạn..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            minHeight={40}
            editable={true}
          />
          <Button
            mode="contained"
            onPress={handleCommentSubmit}
            loading={submitting}
            disabled={!newComment.trim() || submitting}
            style={styles.postButton}
            labelStyle={styles.postButtonLabel}
          >
            Đăng
          </Button>
        </View>
      </View>
    );
  };
  
  // Cancel reply mode
  const cancelReply = () => {
    setReplyingTo(null);
  };
  
  // Calculate total comment count including replies
  const getTotalCommentCount = useCallback(() => {
    let count = 0;
    const countComments = (commentsList) => {
      commentsList.forEach(comment => {
        count++;
        if (comment.replies && comment.replies.length > 0) {
          countComments(comment.replies);
        }
      });
    }
    countComments(comments);
    return count;
  }, [comments]);
  
  // Fetch comments for the post
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const commentsData = await commentService.getCommentsByPostId(postId);
      
      // Ensure we have valid comments data
      if (Array.isArray(commentsData)) {
        const processedComments = processComments(commentsData);
        setComments(processedComments);
      } else {
        console.warn('Unexpected comments format:', commentsData);
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      Alert.alert('Error', 'Failed to load comments');
      setComments([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  }, [postId, processComments]);
  
  // Initialize component
  const initializeComponent = async () => {
    await fetchComments();
  };
  
  useEffect(() => {
    initializeComponent();
  }, [postId]);
  
  // Handle submitting a new comment or reply
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Get current user info
      const user = await getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'You must be logged in to comment');
        navigation.navigate('Login');
        return;
      }
      
      // Create the comment
      const commentData = {
        content: newComment.trim(),
        postId: postId,
        parentId: replyingTo?.id || null,
        user: {
          id: user.id,
          first_name: user.first_name || 'User',
          last_name: user.last_name || '',
          email: user.email,
          avatar: user.avatar
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        replies: [],
        likes: 0,
        isLiked: false
      };
      
      // Optimistic update
      setComments(prev => [commentData, ...prev]);
      setNewComment('');
      setReplyingTo(null);
      
      try {
        // Submit to server
        await commentService.createComment({
          content: commentData.content,
          postId: commentData.postId,
          parentId: commentData.parentId
        });
        
        // Refresh comments to get server data
        await fetchComments();
        
      } catch (error) {
        // Revert optimistic update on error
        setComments(prev => prev.filter(c => c !== commentData));
        throw error;
      }
      
    } catch (error) {
      console.error('Error submitting comment:', error);
      Alert.alert(
        'Error', 
        error.message || 'Failed to post comment. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    console.log('Attempting to delete comment:', commentId);
    
    if (!currentUser) {
      console.log('User not logged in, showing login prompt');
      Alert.alert('Login Required', 'You must be logged in to delete comments');
      return;
    }
    
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this comment?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => console.log('User cancelled comment deletion')
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('User confirmed deletion of comment:', commentId);
              
              // Optimistic update
              setComments(prevComments => 
                prevComments.filter(comment => comment.id !== commentId)
              );
              
              // Call the delete API
              const success = await commentService.deleteComment(commentId);
              
              if (!success) {
                throw new Error('Failed to delete comment');
              }
              
              console.log('Comment deleted successfully, refreshing comments...');
              
              // Refresh comments to ensure UI is in sync with server
              await fetchComments();
              
              // Show success message
              Alert.alert('Success', 'Comment deleted successfully');
              
            } catch (error) {
              console.error('Error in handleDeleteComment:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                stack: error.stack
              });
              
              // Revert optimistic update on error
              await fetchComments();
              
              // Show detailed error message
              const errorMessage = error.response?.data?.message || 
                                error.message || 
                                'Failed to delete comment. Please try again.';
              
              Alert.alert('Error', errorMessage);
            }
          }
        }
      ]
    );
  };
  
  // Handle reply action
  const handleReply = (comment) => {
    setReplyingTo(comment);
    // Optional: Scroll to the input field
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <View style={styles.container}>
      {/* Comments List */}
      <View style={styles.commentsContainer}>
        <Text style={styles.title}>Comments ({getTotalCommentCount()})</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        ) : (
          <ScrollView 
            ref={scrollViewRef}
            style={styles.commentsList}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.commentsListContent}
            showsVerticalScrollIndicator={false}
          >
            {comments.length === 0 ? (
              <View style={styles.noCommentsContainer}>
                <Text style={styles.noComments}>No comments yet. Be the first to comment!</Text>
              </View>
            ) : (
              comments.map(comment => renderComment(comment))
            )}
            <View style={styles.spacer} />
          </ScrollView>
        )}
      </View>
      
      {/* Fixed Input Area */}
      <View style={styles.inputContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {renderCommentInput()}
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  loginPrompt: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  loginText: {
    fontSize: 14,
    color: '#666',
    fontFamily: theme.fontFamily,
  },
  loginButton: {
    borderRadius: 20,
    marginLeft: 12,
    backgroundColor: theme.colors.primary,
  },
  loginButtonLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 4,
  },
  commentsContainer: {
    flex: 1,
    paddingBottom: 80, // Space for the input area
  },
  noCommentsContainer: {
    flex: 1,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    height: 20,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    marginTop: 24,
    fontFamily: theme.fontFamily,
    paddingHorizontal: 16,
  },
  loader: {
    marginVertical: 20,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  commentsListContent: {
    paddingBottom: 16,
  },
  noComments: {
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
    fontFamily: theme.fontFamily,
    fontSize: 14,
  },
  commentInputContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  replyingToContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  replyingToText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  avatarContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxHeight: 100,
    color: '#333',
    fontFamily: theme.fontFamily,
    fontSize: 14,
    textAlignVertical: 'center',
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  postButton: {
    borderRadius: 20,
    height: 36,
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    minWidth: 80,
  },
  submitButtonLabel: {
    color: 'white',
    fontFamily: theme.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 12,
    marginVertical: 0,
    fontFamily: theme.fontFamily,
    fontSize: 14,
    marginHorizontal: 8,
  },
});

export default CommentsSection;
