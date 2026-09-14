import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { API_ENDPOINTS, Post } from './api';

export default function NewsFeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Hàm gọi API lấy danh sách bài viết
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_ENDPOINTS.POSTS);

      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }

      const data = await response.json();
      // Ép kiểu an toàn bằng Type Assertion (as Post[]) theo yêu cầu đề bài
      const postList = data as Post[];
      setPosts(postList);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã xảy ra lỗi không xác định khi tải dữ liệu.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Lọc theo từ khóa tìm kiếm
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchText.toLowerCase()) ||
      post.body.toLowerCase().includes(searchText.toLowerCase()) ||
      post.id.toString() === searchText.trim()
  );

  const renderPostItem = ({ item }: { item: Post }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => setSelectedPost(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.badgeId}>
          <Text style={styles.badgeIdText}>#{item.id}</Text>
        </View>
        <View style={styles.badgeUser}>
          <Text style={styles.badgeUserText}>User ID: {item.userId}</Text>
        </View>
      </View>

      <Text style={styles.postTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.postBody} numberOfLines={3}>
        {item.body}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.readMoreText}>Xem chi tiết →</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Header thông tin bài tập */}
      <View style={styles.header}>
        <Text style={styles.title}>Bài tập 9: Danh sách tin tức</Text>
        <Text style={styles.subtitle}>
          Fetch dữ liệu từ JSONPlaceholder & ép kiểu TypeScript (data as Post[])
        </Text>
      </View>

      {/* Thanh công cụ: Tìm kiếm & Nút làm mới */}
      <View style={styles.toolbar}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Tìm bài viết theo tiêu đề hoặc ID..."
          placeholderTextColor="#94a3b8"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Pressable
          style={({ pressed }) => [styles.refreshBtn, pressed && styles.btnPressed]}
          onPress={fetchPosts}
        >
          <Text style={styles.refreshBtnText}>Tải lại</Text>
        </Pressable>
      </View>

      {/* Thông tin số lượng */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          Tổng số bài viết: <Text style={styles.statsBold}>{posts.length}</Text>
          {searchText.trim() ? ` (Khớp: ${filteredPosts.length})` : ''}
        </Text>
        <Text style={styles.apiTag}>GET /posts</Text>
      </View>

      {/* Trạng thái tải dữ liệu */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Đang gọi API và nạp dữ liệu Post[]...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Không thể tải bài viết</Text>
          <Text style={styles.errorDescription}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={fetchPosts}>
            <Text style={styles.retryBtnText}>Thử lại</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPostItem}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không tìm thấy bài viết nào phù hợp.</Text>
            </View>
          }
        />
      )}

      {/* Modal chi tiết bài viết */}
      <Modal
        visible={selectedPost !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPost(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.badgeId}>
                <Text style={styles.badgeIdText}>Post #{selectedPost?.id}</Text>
              </View>
              <Pressable
                style={styles.closeBtn}
                onPress={() => setSelectedPost(null)}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.modalAuthor}>
              Tác giả: User #{selectedPost?.userId}
            </Text>
            <Text style={styles.modalTitle}>{selectedPost?.title}</Text>
            <View style={styles.modalDivider} />
            <Text style={styles.modalBody}>{selectedPost?.body}</Text>

            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setSelectedPost(null)}
            >
              <Text style={styles.modalCloseButtonText}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 13,
    color: '#93c5fd',
    marginTop: 4,
    lineHeight: 18,
  },
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  refreshBtn: {
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  refreshBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  btnPressed: {
    opacity: 0.8,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  statsText: {
    fontSize: 13,
    color: '#64748b',
  },
  statsBold: {
    fontWeight: '700',
    color: '#0f172a',
  },
  apiTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284c7',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardPressed: {
    backgroundColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeId: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeIdText: {
    color: '#1d4ed8',
    fontWeight: '700',
    fontSize: 12,
  },
  badgeUser: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeUserText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '500',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 22,
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  postBody: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  cardFooter: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#475569',
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 4,
  },
  errorDescription: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 480,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: 'bold',
  },
  modalAuthor: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 6,
    lineHeight: 24,
    textTransform: 'capitalize',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  modalBody: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 23,
  },
  modalCloseButton: {
    backgroundColor: '#2563eb',
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
