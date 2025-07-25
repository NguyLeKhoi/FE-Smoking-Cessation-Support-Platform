import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { getNotifications } from '../../service/notificationService';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.data?.data || res.data || []);
    } catch (err) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title || 'Notification'}</Text>
      <Text style={styles.body}>{item.body || item.content || ''}</Text>
      <Text style={styles.time}>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#3f332b" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id || item._id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>No notifications</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#3f332b' },
  item: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 16, marginBottom: 12 },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  body: { color: '#333', fontSize: 14, marginBottom: 4 },
  time: { color: '#888', fontSize: 12, textAlign: 'right' },
  empty: { textAlign: 'center', color: '#888', marginTop: 40 }
});

export default NotificationScreen; 