import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const fakeBlogPosts = [
  {
    id: 1,
    title: "The Journey to a Smoke-Free Life",
    content: "Quitting smoking is one of the most challenging yet rewarding decisions you can make. Every day without cigarettes is a victory for your health and well-being. Remember, the first few days are the toughest, but with determination and support, you can overcome the cravings and build a healthier lifestyle.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    date: "March 15, 2024",
    author: "Dr. Sarah Johnson",
    category: "Health & Wellness"
  },
  {
    id: 2,
    title: "Understanding Nicotine Withdrawal",
    content: "Nicotine withdrawal symptoms typically peak within the first 3 days of quitting and gradually decrease over the following weeks. Common symptoms include irritability, anxiety, difficulty concentrating, and increased appetite. These are temporary and a sign that your body is healing. Stay strong and remember why you started this journey.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    date: "March 14, 2024",
    author: "Dr. Michael Chen",
    category: "Science"
  },
  {
    id: 3,
    title: "Healthy Alternatives to Smoking",
    content: "Finding healthy alternatives to smoking can help you manage cravings and maintain your quit journey. Consider activities like exercise, meditation, or engaging in hobbies that keep your hands busy. Drinking water, chewing sugar-free gum, or snacking on healthy foods can also help manage oral fixation.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    date: "March 13, 2024",
    author: "Lisa Thompson",
    category: "Lifestyle"
  },
  {
    id: 4,
    title: "The Benefits of Quitting Smoking",
    content: "Within 20 minutes of quitting, your heart rate drops. After 12 hours, carbon monoxide levels normalize. After 2 weeks, your lung function improves. After 1 year, your risk of heart disease is halved. These are just some of the immediate and long-term benefits of quitting smoking. Every smoke-free day is a step toward better health.",
    image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    date: "March 12, 2024",
    author: "Dr. James Wilson",
    category: "Health & Wellness"
  }
];

const BlogScreen = ({ navigation }) => {
  const renderBlogPost = (post) => (
    <TouchableOpacity 
      key={post.id} 
      style={styles.blogPost}
      onPress={() => navigation.navigate('BlogDetail', { post })}
    >
      <Image source={{ uri: post.image }} style={styles.blogImage} />
      <View style={styles.blogContent}>
        <Text style={styles.category}>{post.category}</Text>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.excerpt} numberOfLines={3}>
          {post.content}
        </Text>
        <View style={styles.postFooter}>
          <Text style={styles.date}>{post.date}</Text>
          <Text style={styles.author}>By {post.author}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {fakeBlogPosts.map(renderBlogPost)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  searchButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  blogPost: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blogImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  blogContent: {
    padding: 16,
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  author: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default BlogScreen; 