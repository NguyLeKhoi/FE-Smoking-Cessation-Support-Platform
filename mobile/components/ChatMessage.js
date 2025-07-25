import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatMessage = ({ message, isMe }) => (
  <View style={[styles.container, isMe ? styles.me : styles.other]}>
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    maxWidth: '70%',
    marginVertical: 4,
    padding: 10,
    borderRadius: 12,
  },
  me: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  other: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  text: {
    fontSize: 16,
  },
});

export default ChatMessage; 