import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../theme/theme';
import reactionService from '../../service/reactionService';
import { isAuthenticated } from '../../service/authService';

const PostReactions = ({ postId }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reacting, setReacting] = useState(false);

  // Get current user from AsyncStorage
  const getCurrentUser = useCallback(async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        setCurrentUser(user);
        return user;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
    return null;
  }, []);

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      await getCurrentUser();
    }
    return authenticated;
  }, [getCurrentUser]);

  // Fetch reactions for the post
  const fetchReactions = useCallback(async () => {
    try {
      setLoading(true);
      const reactionsData = await reactionService.getReactionsByPostId(postId);
      setReactions(reactionsData || []);
      
      // Find current user's reaction if logged in
      if (currentUser && reactionsData) {
        const userReactionData = reactionsData.find(
          reaction => reaction.user_id === currentUser.id
        );
        setUserReaction(userReactionData || null);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
      setReactions([]);
    } finally {
      setLoading(false);
    }
  }, [postId, currentUser]);

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      await checkAuth();
      await fetchReactions();
    };
    
    initializeComponent();
  }, [postId]);

  // Refetch reactions when user changes
  useEffect(() => {
    if (currentUser) {
      fetchReactions();
    }
  }, [currentUser, fetchReactions]);

  // Handle reaction toggle
  const handleReaction = async (reactionType) => {
    console.log(`Toggling reaction: ${reactionType}`);
    
    if (!currentUser) {
      console.log('User not logged in, showing login prompt');
      Alert.alert('Login Required', 'Please login to react to posts');
      return;
    }

    setReacting(true);
    try {
      console.log('Current user reaction:', userReaction);
      
      // Get the current reaction type (if any)
      const currentReactionType = userReaction?.type;
      
      // If clicking the same reaction type, remove it
      if (currentReactionType === reactionType) {
        console.log('Removing existing reaction');
        await reactionService.deleteReaction(userReaction.id);
        setUserReaction(null);
        console.log('Reaction removed successfully');
      } 
      // If clicking a different reaction type, update it
      else if (userReaction) {
        console.log(`Changing reaction from ${currentReactionType} to ${reactionType}`);
        await reactionService.deleteReaction(userReaction.id);
        console.log('Old reaction deleted, creating new one');
        
        const newReaction = await reactionService.createReaction({
          type: reactionType,
          post_id: postId
        });
        
        console.log('New reaction created:', newReaction);
        setUserReaction({
          id: newReaction.id,
          type: reactionType
        });
      }
      // If no existing reaction, create a new one
      else {
        console.log(`Adding new ${reactionType} reaction`);
        const newReaction = await reactionService.createReaction({
          type: reactionType,
          post_id: postId
        });
        
        console.log('Reaction added successfully:', newReaction);
        setUserReaction({
          id: newReaction.id,
          type: reactionType
        });
      }

      // Refresh reactions to get updated counts
      console.log('Refreshing reactions...');
      await fetchReactions();
      console.log('Reactions refreshed');
      
    } catch (error) {
      console.error('Error in handleReaction:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      
      Alert.alert(
        'Error', 
        error.response?.data?.message || error.message || 'Failed to update reaction. Please try again.'
      );
    } finally {
      setReacting(false);
      console.log('Reaction handling completed');
    }
  };

  // Get reaction counts by type
  const getReactionCount = (type) => {
    return reactions.filter(reaction => reaction.type === type).length;
  };

  // Check if current user has reacted with specific type
  const hasUserReacted = (type) => {
    return userReaction?.type === type;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }

  const likeCount = getReactionCount('LIKE');
  const loveCount = getReactionCount('LOVE');
  const totalReactions = reactions.length;

  return (
    <View style={styles.container}>
      <View style={styles.reactionsRow}>
        {/* Heart/Love Button */}
        <TouchableOpacity
          style={styles.reactionButton}
          onPress={() => handleReaction('LOVE')}
          disabled={reacting}
        >
          <MaterialIcons
            name={hasUserReacted('LOVE') ? "favorite" : "favorite-border"}
            size={18}
            color={hasUserReacted('LOVE') ? '#e91e63' : '#666'}
          />
          <Text style={[
            styles.reactionCount,
            hasUserReacted('LOVE') && { color: '#e91e63' }
          ]}>
            {loveCount}
          </Text>
        </TouchableOpacity>

        {/* Like Button */}
        <TouchableOpacity
          style={styles.reactionButton}
          onPress={() => handleReaction('LIKE')}
          disabled={reacting}
        >
          <MaterialIcons
            name={hasUserReacted('LIKE') ? "thumb-up" : "thumb-up-off-alt"}
            size={18}
            color={hasUserReacted('LIKE') ? theme.colors.primary : '#666'}
          />
          <Text style={[
            styles.reactionCount,
            hasUserReacted('LIKE') && { color: theme.colors.primary }
          ]}>
            {likeCount}
          </Text>
        </TouchableOpacity>
      </View>

      {!currentUser && (
        <Text style={styles.loginPrompt}>Login to react to this post</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  reactionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 16,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
  reactionButtonActive: {
    backgroundColor: '#e3f2fd',
  },
  reactionCount: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
    fontFamily: theme.fontFamily,
  },
  reactionCountActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  totalReactions: {
    marginLeft: 'auto',
    fontSize: 13,
    color: '#666',
    fontFamily: theme.fontFamily,
    fontWeight: '500',
  },
  loginPrompt: {
    fontSize: 13,
    color: theme.colors.primary,
    textAlign: 'left',
    marginTop: 8,
    fontFamily: theme.fontFamily,
  },
});

export default PostReactions;
