import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Alert, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import userService from '../../service/userService';
import blogService from '../../service/blogService';
import BlogCard from '../../components/blog/BlogCard';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const STATUS_LABELS = {
  APPROVED: { label: 'Approved', color: '#4caf50' },
  PENDING: { label: 'Pending', color: '#ff9800' },
  REJECTED: { label: 'Rejected', color: '#f44336' },
  UPDATING: { label: 'Updating', color: '#2196f3' },
  DRAFT: { label: 'Draft', color: '#757575' },
};

function getStatusChip(status) {
  const s = STATUS_LABELS[status?.toUpperCase()] || STATUS_LABELS.DRAFT;
  return (
    <View style={[styles.chip, { backgroundColor: s.color + '22', borderColor: s.color }]}> 
      <Text style={[styles.chipText, { color: s.color }]}>{s.label}</Text>
    </View>
  );
}

function getStatusCount(blogs, status) {
  return blogs.filter(b => (b.status || '').toUpperCase() === status).length;
}

const PAGE_SIZE = 5;

const MyBlogScreen = () => {
  const navigation = useNavigation();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchMyBlogs();
    const unsubscribe = navigation.addListener('focus', fetchMyBlogs);
    return unsubscribe;
  }, [navigation]);

  const fetchMyBlogs = async () => {
    setLoading(true);
    try {
      const data = await userService.fetchCurrentUserPosts();
      setBlogs(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load your posts.');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    navigation.navigate('EditBlog', { id: item._id || item.id });
  };

  const handleDelete = (item) => {
    Alert.alert('Confirm', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          setDeletingId(item._id || item.id);
          try {
            await blogService.deletePost(item._id || item.id);
            setBlogs(blogs.filter(b => (b._id || b.id) !== (item._id || item.id)));
            Alert.alert('Success', 'Post deleted successfully.');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete post.');
          } finally {
            setDeletingId(null);
          }
        }
      }
    ]);
  };

  const handleCreate = () => {
    navigation.navigate('CreateBlog');
  };

  const pagedBlogs = blogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(blogs.length / PAGE_SIZE);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <FlatList
      data={pagedBlogs}
      keyExtractor={item => item._id || item.id}
      ListHeaderComponent={
        <>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>My Posts ({blogs.length})</Text>
            <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
              <MaterialIcons name="add" size={20} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.createBtnText}>Create New Post</Text>
            </TouchableOpacity>
          </View>
          {blogs.length > 0 && (
            <View style={styles.chipRow}>
              <View style={styles.chipStat}>{getStatusChip('APPROVED')}<Text style={styles.chipCount}>{getStatusCount(blogs, 'APPROVED')}</Text></View>
              <View style={styles.chipStat}>{getStatusChip('PENDING')}<Text style={styles.chipCount}>{getStatusCount(blogs, 'PENDING')}</Text></View>
              <View style={styles.chipStat}>{getStatusChip('REJECTED')}<Text style={styles.chipCount}>{getStatusCount(blogs, 'REJECTED')}</Text></View>
              <View style={styles.chipStat}>{getStatusChip('UPDATING')}<Text style={styles.chipCount}>{getStatusCount(blogs, 'UPDATING')}</Text></View>
            </View>
          )}
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.cardRow}>
          {item.thumbnail ? (
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          ) : null}
          <View style={styles.cardContent}>
            {getStatusChip(item.status)}
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardPreview} numberOfLines={2}>{item.content}</Text>
            <Text style={styles.cardDate}>Created on: {item.createdAt?.slice(0, 10) || item.created_at?.slice(0, 10) || ''}</Text>
          </View>
          <View style={styles.actionCol}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(item)}>
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item)} disabled={deletingId === (item._id || item.id)}>
              <Text style={[styles.actionText, { color: 'red' }]}>{deletingId === (item._id || item.id) ? 'Deleting...' : 'Delete'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>You haven't created any posts yet</Text>
          <Text style={styles.emptyDesc}>Share your knowledge and experiences with the community by creating your first post.</Text>
        </View>
      }
      ListFooterComponent={
        totalPages > 1 && (
          <View style={styles.paginationRow}>
            <TouchableOpacity disabled={page === 1} onPress={() => setPage(page - 1)} style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}>
              <Text style={styles.pageBtnText}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.pageInfo}>Page {page} / {totalPages}</Text>
            <TouchableOpacity disabled={page === totalPages} onPress={() => setPage(page + 1)} style={[styles.pageBtn, page === totalPages && styles.pageBtnDisabled]}>
              <Text style={styles.pageBtnText}>{'>'}</Text>
            </TouchableOpacity>
          </View>
        )
      }
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    />
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: '#fff', borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2, padding: 16, gap: 12 },
  thumbnail: { width: 64, height: 64, borderRadius: 12, marginRight: 16, backgroundColor: '#eee' },
  cardContent: { flex: 1, justifyContent: 'center' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  cardPreview: { fontSize: 15, color: '#555', marginBottom: 6 },
  cardDate: { fontSize: 13, color: '#888', marginTop: 2 },
  chip: { alignSelf: 'flex-start', marginBottom: 6, marginRight: 8 },
  actionCol: { flexDirection: 'column', marginLeft: 8, gap: 4 },
  actionBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#f5f5f5', marginBottom: 4 },
  actionText: { fontSize: 15, color: '#1976d2', fontWeight: 'bold' },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'nowrap',
    gap: 8,
  },
  chipStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 0,
    minWidth: 80,
    justifyContent: 'center',
  },
  chipText: { fontSize: 13, fontWeight: 'bold' },
  chipCount: { marginLeft: 4, fontWeight: 'bold', color: '#333' },
  emptyCard: { backgroundColor: '#fff', borderRadius: 12, padding: 24, alignItems: 'center', marginTop: 32, marginBottom: 32, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#888', marginBottom: 8 },
  emptyDesc: { fontSize: 15, color: '#666', marginBottom: 16, textAlign: 'center' },
  paginationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, marginBottom: 8 },
  pageBtn: { padding: 8, borderRadius: 8, backgroundColor: '#eee', marginHorizontal: 8 },
  pageBtnDisabled: { backgroundColor: '#f5f5f5' },
  pageBtnText: { fontSize: 18, fontWeight: 'bold', color: '#1976d2' },
  pageInfo: { fontSize: 15, color: '#333', fontWeight: '500' },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
    marginTop: 8,
  },
  createBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});

export default MyBlogScreen; 