import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Avatar, Menu, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../../theme/theme';
import commentService from '../../service/commentService';

const CommentCard = ({ 
  comment, 
  onReply, 
  onDelete,
  currentUserId 
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Check if current user is the owner of this comment
  const isCurrentUser = currentUserId && comment.user_id && (currentUserId === comment.user_id);
  
  // Handle different user data structures from API
  const user = comment.users || comment.user || {};
  const authorName = user.first_name || user.name 
    ? `${user.first_name || user.name} ${user.last_name || ''}`.trim()
    : 'User';
    
  // Generate avatar URL or use the one from the user object
  const avatarUrl = user.avatar || (user.first_name 
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name + ' ' + (user.last_name || ''))}&background=4285f4&color=fff`
    : 'https://ui-avatars.com/api/?name=User&background=4285f4&color=fff');

  const handleDelete = async () => {
    setMenuVisible(false);
    
    if (!currentUserId) {
      Alert.alert('Error', 'You must be logged in to delete comments');
      return;
    }
    
    if (!isCurrentUser) {
      Alert.alert('Error', 'You can only delete your own comments');
      return;
    }
    
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              if (onDelete) {
                await onDelete(comment.id);
              }
            } catch (error) {
              console.error('Error deleting comment:', error);
              Alert.alert('Error', 'Failed to delete comment');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image 
          size={48} 
          source={{ uri: avatarUrl }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <View style={styles.userMeta}>
            <Text style={styles.author}>{authorName}</Text>
            <Text style={styles.dateSeparator}>•</Text>
            <Text style={styles.date}>
              {new Date(comment.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.menuContainer}>
            {isCurrentUser && (
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <MaterialIcons name="more-horiz" size={20} color="#888" />
                  </TouchableOpacity>
                }
              >
                <Menu.Item 
                  onPress={handleDelete} 
                  title="Delete comment" 
                  leadingIcon="delete"
                  titleStyle={{ color: '#E55050' }}
                  disabled={deleting}
                />
              </Menu>
            )}
          </View>
        </View>
      </View>
      
      <Text style={styles.content}>{comment.content}</Text>
      
      <View style={styles.actions}>
        {currentUserId && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onReply && onReply(comment)}
          >
            <MaterialIcons 
              name="reply" 
              size={16} 
              color={theme.colors.textSecondary} 
            style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
        )}
        
        {!currentUserId && (
          <Text style={styles.loginPrompt}>Login to reply</Text>
        )}
      </View>
      
      {comment.replies && comment.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {comment.replies.map(reply => (
            <CommentCard 
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              currentUserId={currentUserId}
            />
          ))}
        </View>
      )}
      
      <Divider style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  menuContainer: {
    marginLeft: 'auto',
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  author: {
    fontWeight: '600',
    color: '#222',
    fontFamily: theme.fontFamily,
    fontSize: 14,
    marginRight: 8,
  },
  dateSeparator: {
    color: '#bbb',
    marginHorizontal: 4,
  },
  date: {
    fontSize: 13,
    color: '#888',
    fontFamily: theme.fontFamily,
  },
  content: {
    fontSize: 15,
    color: '#222',
    lineHeight: 22,
    marginBottom: 8,
    fontFamily: theme.fontFamily,
    marginLeft: 60, // Align with user info
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 60, // Align with content
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 4,
  },
  actionIcon: {
    marginRight: 4,
  },
  actionText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    fontFamily: theme.fontFamily,
  },
  loginPrompt: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    fontFamily: theme.fontFamily,
  },
  repliesContainer: {
    marginLeft: 60, // Align with content
    marginTop: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#e0e0e0',
    paddingLeft: 16,
  },
  divider: {
    marginTop: 12,
    backgroundColor: theme.colors.border,
  },
});

export default CommentCard;
