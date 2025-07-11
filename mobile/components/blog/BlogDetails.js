import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import Markdown from 'react-native-markdown-display';
import theme from '../../theme/theme';

const BlogDetails = ({ title, author, createdAt, content, thumbnail }) => (
  <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      {thumbnail ? (
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
      ) : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>Author: {author}</Text>
      <Text style={styles.meta}>Posted on: {createdAt}</Text>
      <Markdown style={markdownStyles}>{content}</Markdown>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.paper,
    borderRadius: theme.borderRadius,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    padding: theme.padding,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    borderRadius: theme.borderRadius,
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 8,
    fontFamily: theme.fontFamily,
  },
  meta: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily,
    marginBottom: 4,
  },
});

const markdownStyles = {
  body: { color: theme.colors.textPrimary, fontSize: 16, fontFamily: theme.fontFamily },
  heading1: { fontSize: 22, fontWeight: 'bold', marginVertical: 8 },
  heading2: { fontSize: 20, fontWeight: 'bold', marginVertical: 8 },
  strong: { fontWeight: 'bold' },
  em: { fontStyle: 'italic' },
  link: { color: theme.colors.primary },
  list_item: { marginVertical: 4 },
};

export default BlogDetails; 