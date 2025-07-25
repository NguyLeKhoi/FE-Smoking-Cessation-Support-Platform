import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import Markdown from 'react-native-markdown-display';
import theme from '../../theme/theme';
import PostReactions from './PostReactions';
import CommentsSection from './CommentsSection';

const BlogDetails = ({ title, author, createdAt, content, thumbnail, postId, navigation }) => (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {thumbnail && (
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
      )}
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.metaContainer}>
          <Text style={styles.author}>{author}</Text>
          <Text style={styles.dateSeparator}>•</Text>
          <Text style={styles.date}>{createdAt}</Text>
        </View>
        
        <View style={styles.markdownContainer}>
          <Markdown style={markdownStyles}>{content}</Markdown>
        </View>
        
        {/* Post Reactions */}
        {postId && <PostReactions postId={postId} />}
        
        {/* Comments Section */}
        {postId && <CommentsSection postId={postId} navigation={navigation} />}
      </View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    fontFamily: theme.fontFamily,
    lineHeight: 32,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  author: {
    fontSize: 14,
    color: '#666',
    fontFamily: theme.fontFamily,
    fontWeight: '500',
  },
  dateSeparator: {
    color: '#bbb',
    marginHorizontal: 8,
    fontSize: 14,
  },
  date: {
    fontSize: 14,
    color: '#666',
    fontFamily: theme.fontFamily,
  },
  markdownContainer: {
    marginBottom: 24,
  },
});

const markdownStyles = {
  body: { 
    color: '#333', 
    fontSize: 16, 
    fontFamily: theme.fontFamily,
    lineHeight: 24,
  },
  heading1: { 
    fontSize: 22, 
    fontWeight: '700', 
    marginVertical: 12,
    color: '#1a1a1a',
  },
  heading2: { 
    fontSize: 20, 
    fontWeight: '600', 
    marginVertical: 10,
    color: '#1a1a1a',
  },
  heading3: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginVertical: 8,
    color: '#1a1a1a',
  },
  paragraph: {
    marginVertical: 8,
    lineHeight: 24,
  },
  strong: { 
    fontWeight: '600',
    color: '#1a1a1a',
  },
  em: { 
    fontStyle: 'italic',
    color: '#555',
  },
  link: { 
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  list_item: { 
    marginVertical: 4,
    paddingLeft: 8,
  },
  code_inline: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'monospace',
    fontSize: 14,
  },
  code_block: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontFamily: 'monospace',
    fontSize: 14,
  },
};

export default BlogDetails; 