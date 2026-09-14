import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// 1. Hàm Generic <T> nhận mảng object bất kỳ có trường "name" và từ khóa để lọc
export function filterByName<T extends { name: string }>(
  items: T[],
  keyword: string
): T[] {
  const trimmed = keyword.trim().toLowerCase();
  if (!trimmed) {
    return items;
  }
  return items.filter((item) => item.name.toLowerCase().includes(trimmed));
}

// Định nghĩa 2 kiểu dữ liệu khác nhau cùng có trường name để kiểm tra Generic
interface Book {
  id: number;
  name: string;
  price: number;
  author: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  major: string;
}

// Dữ liệu mẫu 1: Danh sách sách
const sampleBooks: Book[] = [
  { id: 1, name: 'Lập trình React Native', price: 150000, author: 'Nguyễn Văn A' },
  { id: 2, name: 'TypeScript toàn tập', price: 180000, author: 'Trần Thị B' },
  { id: 3, name: 'Cấu trúc dữ liệu & Giải thuật', price: 120000, author: 'Lê Văn C' },
  { id: 4, name: 'Học JavaScript cơ bản', price: 95000, author: 'Phạm Minh D' },
];

// Dữ liệu mẫu 2: Danh sách học viên
const sampleStudents: Student[] = [
  { id: 101, name: 'Nguyễn Văn An', email: 'an@gmail.com', major: 'CNTT' },
  { id: 102, name: 'Trần Thị Bình', email: 'binh@gmail.com', major: 'Kỹ thuật phần mềm' },
  { id: 103, name: 'Lê Hoàng Cường', email: 'cuong@gmail.com', major: 'Khoa học máy tính' },
  { id: 104, name: 'Phạm Ngọc Dũng', email: 'dung@gmail.com', major: 'Hệ thống thông tin' },
];

export default function FilteredListScreen() {
  const [keyword, setKeyword] = useState<string>('');
  const [currentType, setCurrentType] = useState<'books' | 'students'>('books');

  // Áp dụng hàm Generic filterByName cho từng loại dữ liệu
  const filteredBooks = filterByName<Book>(sampleBooks, keyword);
  const filteredStudents = filterByName<Student>(sampleStudents, keyword);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bài tập 13: Bộ lọc danh sách</Text>
        <Text style={styles.headerSubtitle}>
          Hàm Generic filterByName&lt;T extends &#123; name: string &#125;&gt;
        </Text>
      </View>

      <View style={styles.contentCard}>
        {/* Ô nhập từ khóa */}
        <TextInput
          style={styles.input}
          placeholder="🔍 Nhập từ khóa cần lọc theo tên (name)..."
          placeholderTextColor="#94a3b8"
          value={keyword}
          onChangeText={setKeyword}
        />

        {/* Chuyển đổi dữ liệu để minh họa Generic tái sử dụng */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, currentType === 'books' && styles.tabActive]}
            onPress={() => setCurrentType('books')}
          >
            <Text style={[styles.tabText, currentType === 'books' && styles.tabTextActive]}>
              📚 Danh sách Sách (Book[])
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, currentType === 'students' && styles.tabActive]}
            onPress={() => setCurrentType('students')}
          >
            <Text style={[styles.tabText, currentType === 'students' && styles.tabTextActive]}>
              🎓 Học viên (Student[])
            </Text>
          </Pressable>
        </View>

        {/* Kết quả lọc */}
        <View style={styles.countRow}>
          <Text style={styles.resultCount}>
            Kết quả khớp: <Text style={styles.countBold}>{currentType === 'books' ? filteredBooks.length : filteredStudents.length}</Text>
          </Text>
          <Text style={styles.genericBadge}>Generic &lt;T&gt;</Text>
        </View>
      </View>

      {currentType === 'books' ? (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={styles.itemTop}>
                <Text style={styles.itemName}>📖 {item.name}</Text>
                <Text style={styles.itemPrice}>{item.price.toLocaleString()} đ</Text>
              </View>
              <Text style={styles.itemDetail}>Tác giả: {item.author} • ID #{item.id}</Text>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={styles.itemTop}>
                <Text style={styles.itemName}>👤 {item.name}</Text>
                <Text style={styles.itemBadge}>{item.major}</Text>
              </View>
              <Text style={styles.itemDetail}>Email: {item.email} • ID #{item.id}</Text>
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
    backgroundColor: '#4338ca',
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
    color: '#c7d2fe',
    marginTop: 4,
  },
  contentCard: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    marginBottom: 10,
    color: '#0f172a',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabActive: {
    backgroundColor: '#e0e7ff',
    borderColor: '#4338ca',
  },
  tabText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#4338ca',
    fontWeight: '700',
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  resultCount: {
    fontSize: 13,
    color: '#64748b',
  },
  countBold: {
    fontWeight: '700',
    color: '#0f172a',
  },
  genericBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338ca',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 24,
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
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  itemBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0369a1',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  itemDetail: {
    fontSize: 13,
    color: '#64748b',
  },
});
