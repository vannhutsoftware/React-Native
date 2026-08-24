import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Course, courses } from './src/data/courses';

const ALL_CATEGORIES = 'Tất cả';
const ITEMS_PER_PAGE = 2;
const NUM_COLUMNS = 2;
const categories = [
  ALL_CATEGORIES,
  ...Array.from(new Set(courses.map((course) => course.category))),
];

type StudentSortOrder = 'default' | 'ascending' | 'descending';

const studentSortOptions: Array<{
  label: string;
  value: StudentSortOrder;
}> = [
  { label: 'Mặc định', value: 'default' },
  { label: 'Tăng dần ↑', value: 'ascending' },
  { label: 'Giảm dần ↓', value: 'descending' },
];

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <CourseListScreen />
    </SafeAreaView>
  );
}

function CourseListScreen() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [studentSortOrder, setStudentSortOrder] =
    useState<StudentSortOrder>('default');
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Chuẩn hóa từ khóa tìm kiếm
  const normalizedQuery = query.trim().toLocaleLowerCase('vi');

  // Bài tập nâng cao - Câu 8: Ghi nhớ kết quả lọc và sắp xếp
  const filteredCourses = useMemo(() => {
    const result = courses.filter((course) => {
      const matchesQuery =
        `${course.title} ${course.instructor} ${course.category}`
        .toLocaleLowerCase('vi')
        .includes(normalizedQuery);
      const matchesCategory =
        selectedCategory === ALL_CATEGORIES ||
        course.category === selectedCategory;

      return matchesQuery && matchesCategory;
    });

    // result là mảng mới nên sort không làm thay đổi dữ liệu courses gốc
    if (studentSortOrder === 'ascending') {
      result.sort((a, b) => a.students - b.students);
    } else if (studentSortOrder === 'descending') {
      result.sort((a, b) => b.students - a.students);
    }

    return result;
  }, [normalizedQuery, selectedCategory, studentSortOrder]);

  // Khi điều kiện lọc thay đổi, hiển thị lại từ trang đầu tiên
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategory, studentSortOrder]);

  const paginatedCourses = filteredCourses.slice(
    0,
    currentPage * ITEMS_PER_PAGE,
  );
  const hasMoreCourses = paginatedCourses.length < filteredCourses.length;

  const handleLoadMore = () => {
    if (!hasMoreCourses || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);

    // Giả lập thời gian tải trang tiếp theo để thấy trạng thái ở footer
    setTimeout(() => {
      setCurrentPage((page) => {
        const lastPage = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
        return Math.min(page + 1, lastPage);
      });
      setIsLoadingMore(false);
    }, 1000);
  };

  // Giả lập tải lại dữ liệu cục bộ khi kéo danh sách xuống
  const handleRefresh = () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);
    setCurrentPage(1);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Khi nhấn vào khóa học
  const openCourse = (course: Course) => {
    Alert.alert('Khóa học', course.title);
  };

  return (
    <View style={styles.screen}>
      <FlatList
        key={`course-grid-${NUM_COLUMNS}`}
        data={paginatedCourses}

        // Bài tập nâng cao - Câu 7: Hiển thị danh sách dạng lưới 2 cột
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.gridRow}

        // Bài tập nâng cao - Câu 4: Kéo xuống để làm mới
        refreshing={refreshing}
        onRefresh={handleRefresh}

        // Bài tập nâng cao - Câu 5: Phân trang khi cuộn gần cuối
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}

        keyExtractor={(item) => item.id}

        renderItem={({ item }) => (
          <CourseRow
            course={item}
            onPress={openCourse}
          />
        )}

        // Bước 9:
        // Tạo khoảng cách giữa các dòng
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}

        contentContainerStyle={styles.listContent}

        // Header cuộn cùng danh sách
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.screenTitle}>
              Course Catalog
            </Text>

            <Text style={styles.subtitle}>
              Khám phá các khóa học đang mở
            </Text>

            <View style={styles.searchContainer}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Tìm theo tên, giảng viên hoặc danh mục"
                placeholderTextColor="#8A8F98"
                returnKeyType="search"
                style={styles.searchInput}
              />

              {/* Bài tập nâng cao - Câu 1: Xóa nội dung tìm kiếm */}
              {query.length > 0 && (
                <Pressable
                  onPress={() => setQuery('')}
                  accessibilityRole="button"
                  accessibilityLabel="Xóa nội dung tìm kiếm"
                  hitSlop={8}
                  style={({ pressed }) => [
                    styles.clearButton,
                    pressed && styles.clearButtonPressed,
                  ]}
                >
                  <Text style={styles.clearButtonText}>×</Text>
                </Pressable>
              )}
            </View>

            {/* Bài tập nâng cao - Câu 2: Bộ lọc theo danh mục */}
            <Text style={styles.filterLabel}>Danh mục</Text>

            <View style={styles.categoryList}>
              {categories.map((category) => {
                const isSelected = category === selectedCategory;

                return (
                  <Pressable
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    style={({ pressed }) => [
                      styles.categoryButton,
                      isSelected && styles.categoryButtonSelected,
                      pressed && styles.categoryButtonPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        isSelected && styles.categoryButtonTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Bài tập nâng cao - Câu 3: Sắp xếp theo số sinh viên */}
            <Text style={styles.sortLabel}>Sắp xếp theo số sinh viên</Text>

            <View style={styles.sortOptions}>
              {studentSortOptions.map((option) => {
                const isSelected = option.value === studentSortOrder;

                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setStudentSortOrder(option.value)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    style={({ pressed }) => [
                      styles.sortButton,
                      isSelected && styles.sortButtonSelected,
                      pressed && styles.sortButtonPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sortButtonText,
                        isSelected && styles.sortButtonTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.resultText}>
              Tìm thấy {filteredCourses.length} khóa học · Đang hiển thị{' '}
              {paginatedCourses.length}
            </Text>
          </View>
        }

        // Hiển thị khi không có dữ liệu
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              Không tìm thấy khóa học
            </Text>

            <Text style={styles.emptyText}>
              Hãy thử tìm kiếm bằng một từ khóa khác.
            </Text>
          </View>
        }

        // Bài tập nâng cao - Câu 6: Hiển thị trạng thái tải ở cuối danh sách
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.listFooter}>
              <ActivityIndicator size="small" color="#2563eb" />
              <Text style={styles.listFooterText}>
                Đang tải thêm khóa học...
              </Text>
            </View>
          ) : !hasMoreCourses && filteredCourses.length > 0 ? (
            <View style={styles.listFooter}>
              <Text style={styles.listFooterText}>
                Đã hiển thị tất cả {filteredCourses.length} khóa học
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

interface CourseRowProps {
  course: Course;
  onPress: (course: Course) => void;
}

function CourseRow({ course, onPress }: CourseRowProps) {
  return (
    <Pressable
      // Bước 10:
      // Nhấn vào khóa học để mở Alert
      onPress={() => onPress(course)}

      style={({ pressed }) => [
        styles.courseCard,
        pressed && styles.courseCardPressed,
      ]}
    >
      <Text style={styles.courseTitle}>
        {course.title}
      </Text>

      <Text style={styles.instructor}>
        Giảng viên: {course.instructor}
      </Text>

      <View style={styles.courseFooter}>
        <Text style={styles.category}>
          {course.category}
        </Text>

        <Text style={styles.studentCount}>
          {course.students} sinh viên
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  screen: {
    flex: 1,
  },

  header: {
    paddingBottom: 16,
  },

  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 16,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#fff',
  },

  searchInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },

  clearButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
    borderRadius: 20,
  },

  clearButtonPressed: {
    backgroundColor: '#e2e8f0',
  },

  clearButtonText: {
    fontSize: 24,
    lineHeight: 26,
    color: '#64748b',
  },

  filterLabel: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },

  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 18,
    backgroundColor: '#fff',
  },

  categoryButtonSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#2563eb',
  },

  categoryButtonPressed: {
    opacity: 0.7,
  },

  categoryButtonText: {
    fontSize: 14,
    color: '#475569',
  },

  categoryButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },

  sortLabel: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },

  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 18,
    backgroundColor: '#fff',
  },

  sortButtonSelected: {
    borderColor: '#0f766e',
    backgroundColor: '#0f766e',
  },

  sortButtonPressed: {
    opacity: 0.7,
  },

  sortButtonText: {
    fontSize: 14,
    color: '#475569',
  },

  sortButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },

  resultText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 10,
  },

  listContent: {
    padding: 16,
  },

  listFooter: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },

  listFooterText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },

  // Khoảng cách giữa các dòng
  separator: {
    height: 12,
  },

  gridRow: {
    gap: 12,
    justifyContent: 'space-between',
  },

  courseCard: {
    flex: 1,
    maxWidth: '48%',
    minHeight: 170,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  courseCardPressed: {
    opacity: 0.7,
  },

  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },

  instructor: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12,
  },

  courseFooter: {
    marginTop: 'auto',
    gap: 6,
  },

  category: {
    fontSize: 13,
    color: '#2563eb',
  },

  studentCount: {
    fontSize: 13,
    color: '#64748b',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});
