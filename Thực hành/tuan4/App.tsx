import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ApiErrorHandlingScreen from './ApiErrorHandlingScreen';
import FilteredListScreen from './FilteredListScreen';
import NewsFeedScreen from './NewsFeedScreen';
import PaginationScreen from './PaginationScreen';
import ProductSearchScreen from './ProductSearchScreen';
import PullToRefreshScreen from './PullToRefreshScreen';
import UserProfileScreen from './UserProfileScreen';

interface ExerciseItem {
  id: string;
  hour: string;
  badge: string;
  title: string;
  desc: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  component: React.ComponentType;
}

const exercises: ExerciseItem[] = [
  {
    id: 'bai9',
    hour: 'Giờ 1',
    badge: 'Bài tập 9',
    title: 'Danh sách tin tức (News Feed)',
    desc: 'Fetch dữ liệu từ JSONPlaceholder /posts, gán kiểu Post[], hiển thị FlatList.',
    status: 'completed',
    component: NewsFeedScreen,
  },
  {
    id: 'bai10',
    hour: 'Giờ 1',
    badge: 'Bài tập 10',
    title: 'Chi tiết người dùng (User Profile Detail)',
    desc: 'Gọi API user/1, kiểu User | null, xử lý null/undefined với Optional Chaining.',
    status: 'completed',
    component: UserProfileScreen,
  },
  {
    id: 'bai11',
    hour: 'Giờ 2',
    badge: 'Bài tập 11',
    title: 'Tìm kiếm sản phẩm (Product Search API)',
    desc: 'Hàm fetchProducts(keyword, limit) gọi DummyJSON và hiển thị kết quả.',
    status: 'completed',
    component: ProductSearchScreen,
  },
  {
    id: 'bai12',
    hour: 'Giờ 2',
    badge: 'Bài tập 12',
    title: 'Xử lý lỗi API (API Error Handling)',
    desc: 'Bắt lỗi trong catch, ép kiểu cấu trúc CustomError và thông báo Alert/UI.',
    status: 'completed',
    component: ApiErrorHandlingScreen,
  },
  {
    id: 'bai13',
    hour: 'Giờ 2',
    badge: 'Bài tập 13',
    title: 'Bộ lọc danh sách (Filtered List Generic)',
    desc: 'Viết hàm Generic <T> lọc mảng object theo trường name.',
    status: 'completed',
    component: FilteredListScreen,
  },
  {
    id: 'bai14',
    hour: 'Giờ 3',
    badge: 'Bài tập 14',
    title: 'Phân trang dữ liệu (Pagination Response)',
    desc: 'Generic Interface ApiResponse<T> áp dụng cho phân trang danh sách sản phẩm.',
    status: 'completed',
    component: PaginationScreen,
  },
  {
    id: 'bai15',
    hour: 'Giờ 3',
    badge: 'Bài tập 15',
    title: 'Tải lại trang (Pull to Refresh State)',
    desc: 'Tích hợp refreshing (boolean) vào FlatList, đồng bộ luồng bất đồng bộ.',
    status: 'completed',
    component: PullToRefreshScreen,
  },
];

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedExercise = exercises.find((ex) => ex.id === selectedId);

  if (selectedExercise && selectedExercise.component) {
    const ExerciseComponent = selectedExercise.component;
    return (
      <SafeAreaView style={styles.screenContainer}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => setSelectedId(null)}>
            <Text style={styles.backButtonText}>← Danh sách bài tập Tuần 4</Text>
          </Pressable>
          <Text style={styles.currentBadge}>{selectedExercise.badge}</Text>
        </View>
        <View style={styles.screenContent}>
          <ExerciseComponent />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTag}>THỰC HÀNH TUẦN 4</Text>
          <Text style={styles.heading}>Gọi API & Xử lý bất đồng bộ</Text>
          <Text style={styles.subtitle}>
            TypeScript trong React Native • BookStore API • JSONPlaceholder & DummyJSON
          </Text>
        </View>

        <View style={styles.sectionDivider}>
          <Text style={styles.sectionTitle}>Danh sách bài tập</Text>
        </View>

        {exercises.map((exercise) => (
          <Pressable
            key={exercise.id}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => setSelectedId(exercise.id)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.badges}>
                <Text style={styles.hourBadge}>{exercise.hour}</Text>
                <Text style={styles.badgeLabel}>{exercise.badge}</Text>
              </View>
              <Text style={[styles.statusBadge, styles.statusCompleted]}>
                ✓ Hoàn thành
              </Text>
            </View>

            <Text style={styles.cardTitle}>{exercise.title}</Text>
            <Text style={styles.cardDesc}>{exercise.desc}</Text>

            <View style={styles.actionFooter}>
              <Text style={styles.actionText}>Chạm để mở bài tập →</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#1e3a8a',
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
  },
  headerTag: {
    color: '#93c5fd',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  heading: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
  sectionDivider: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.75,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  hourBadge: {
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeLabel: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusCompleted: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  actionFooter: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    backgroundColor: '#1e3a8a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  currentBadge: {
    color: '#bfdbfe',
    fontSize: 12,
    fontWeight: '700',
    paddingRight: 6,
  },
  screenContent: {
    flex: 1,
  },
});
