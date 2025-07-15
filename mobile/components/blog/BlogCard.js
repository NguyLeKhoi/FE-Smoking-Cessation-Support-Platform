import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import theme from '../../theme/theme';

const BlogCard = ({ title, author, createdAt, thumbnail, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    {thumbnail ? (
      <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
    ) : null}
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>Author: {author}</Text>
      <Text style={styles.meta}>Posted on: {createdAt}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.paper,
    borderRadius: theme.borderRadius,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderTopLeftRadius: theme.borderRadius,
    borderBottomLeftRadius: theme.borderRadius,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  content: {
    flex: 1,
    padding: theme.padding / 2,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 8,
    fontFamily: theme.fontFamily,
  },
  meta: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily,
  },
});

export default BlogCard; 