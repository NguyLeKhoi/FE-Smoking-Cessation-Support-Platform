import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const BlogCard = ({ title, author, createdAt, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.meta}>Tác giả: {author}</Text>
    <Text style={styles.meta}>Ngày đăng: {createdAt}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: '#666',
  },
});

export default BlogCard; 