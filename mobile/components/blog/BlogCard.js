import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = width - 32; // 16px padding on each side

const BlogCard = ({ title, author, createdAt, thumbnail, content, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image 
      source={{ uri: thumbnail || 'https://source.unsplash.com/random/600x400?smoking-cessation' }}
      style={styles.thumbnail}
    />
    <View style={styles.content}>
      <View style={styles.authorDateRow}>
        <Text style={styles.author}>{author}</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.date}>{createdAt}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      {content && (
        <Text style={styles.preview} numberOfLines={2}>
          {content.replace(/[#*`]/g, '').substring(0, 100)}...
        </Text>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  thumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  authorDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  dot: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
    lineHeight: 24,
  },
  preview: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default BlogCard; 