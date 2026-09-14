import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { API_ENDPOINTS, Post } from './api';

export default function PullToRefreshScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const loadPostsData = async (isPullToRefresh: boolean = false) => {
    if (isPullToRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await fetch(API_ENDPOINTS.POSTS);
      const json = await res.json();

      const rawPosts = (json as Post[]).slice(0, 8);
      const displayPosts = isPullToRefresh
        ? [...rawPosts].sort(() => Math.random() - 0.5)
        : rawPosts;

      setPosts(displayPosts);
      setLastUpdated(new Date().toLocaleTimeString('vi-VN'));
    } catch (err: unknown) {
      console.error('Lỗi khi tải dữ liệu:', err);
    } finally {
      if (isPullToRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadPostsData(false);
  }, []);

  const onRefresh = () => {
    loadPostsData(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bài tập 15: Tải lại trang (Pull to Refresh)</Text>
        <Text style={styles.headerSubtitle}>
          Đồng bộ trạng thái loading ban đầu và refreshing trên FlatList
        </Text>
      </View>

      {/* Thanh trạng thái cập nhật */}
      <View style={styles.statusBar}>
        <View>
          <Text style={styles.statusText}>
            Lần cập nhật cuối: <Text style={styles.boldText}>{lastUpdated || 'Đang nạp...'}</Text>
          </Text>
          <Text style={styles.subText}>Kéo danh sách xuống để làm mới (Pull to refresh)</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.refreshBtn, pressed && styles.btnPressed]}
          onPress={onRefresh}
        >
          <Text style={styles.refreshBtnText}>🔄 Làm mới</Text>
        </Pressable>
      </View>

      {/* Hiển thị Loading ban đầu */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Đang nạp dữ liệu lần đầu...</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2563eb']}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemId}>Bài #{item.id}</Text>
                <Text style={styles.itemAuthor}>User: {item.userId}</Text>
              </View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemBody}>{item.body}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#bfdbfe',
    marginTop: 4,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  statusText: {
    fontSize: 13,
    color: '#334155',
  },
  subText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  boldText: {
    fontWeight: '700',
    color: '#0f172a',
  },
  refreshBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  btnPressed: {
    opacity: 0.8,
  },
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  center: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
    fontSize: 14,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  itemAuthor: {
    fontSize: 12,
    color: '#64748b',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  itemBody: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
});
