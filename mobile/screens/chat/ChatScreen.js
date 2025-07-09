// ChatScreen.js
// Màn hình chat mobile

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import chatService from '../../service/chatService';
import ChatMessage from '../../components/ChatMessage';

const ChatScreen = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await chatService.getAllChatRooms();
      setRooms(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách phòng chat');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId) => {
    setLoadingMessages(true);
    try {
      const data = await chatService.getChatRoomMessages(roomId);
      setMessages(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải tin nhắn');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    fetchMessages(room._id);
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {!selectedRoom ? (
        <FlatList
          data={rooms}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectRoom(item)} style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
              <Text style={{ fontWeight: 'bold' }}>{item.name || 'Phòng chat'}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => setSelectedRoom(null)} style={{ marginBottom: 8 }}>
            <Text style={{ color: 'blue' }}>{'< Quay lại danh sách phòng'}</Text>
          </TouchableOpacity>
          {loadingMessages ? (
            <ActivityIndicator size="small" />
          ) : (
            <FlatList
              data={messages}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <ChatMessage message={item.content} isMe={item.isMe} />
              )}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default ChatScreen; 