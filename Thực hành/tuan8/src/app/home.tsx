import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/authService';
import type { AppDispatch, RootState } from '../store';
import { clearSession } from '../store/authSlice';
import { bookService } from '../services/bookService';
import type { Book } from '../types/book';

export default function HomeScreen() {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setBooksLoading(true);
    setBooksError('');
    bookService.getAll().then((data) => {
      if (active) setBooks(data);
    }).catch(() => {
      if (active) setBooksError('Không tải được danh sách sách.');
    }).finally(() => {
      if (active) setBooksLoading(false);
    });
    return () => { active = false; };
  }, [attempt]);

  async function logout() {
    if (loading || !token) return;
    setLoading(true);
    setError('');
    try {
      await AsyncStorage.removeItem('auth');
      dispatch(clearSession());
      router.replace('/home');
      // Xóa phiên trên máy chủ khi có mạng; đăng xuất cục bộ vẫn hoạt động khi mất mạng.
      void authService.logout(token).catch(() => {});
    } catch {
      setError('Không thể xóa phiên đăng nhập. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <Text style={styles.heading}>Home - BookStore Online</Text>
      {user ? (
        <>
          <Text>Đăng nhập thành công.</Text>
          <Text style={styles.email}>Xin chào, {user.email}</Text>
          <View style={styles.action}>
            <Button title={loading ? 'Đang đăng xuất...' : 'Đăng xuất'} disabled={loading} onPress={() => void logout()} />
          </View>
        </>
      ) : (
        <>
          <Text>Bạn chưa đăng nhập.</Text>
          <View style={styles.action}>
            <Button title="Đăng nhập / Đăng ký" onPress={() => router.push('/login')} />
          </View>
        </>
      )}
      <View style={styles.action}>
        <Button title="Thanh toán" onPress={() => router.push('/checkout')} />
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.section}>Danh sách sách</Text>
      {booksLoading && <Text>Đang tải sách...</Text>}
      {!!booksError && <View>
        <Text style={styles.error}>{booksError}</Text>
        <Button title="Thử lại" onPress={() => setAttempt((value) => value + 1)} />
      </View>}
      {!booksLoading && !booksError && books.length === 0 && <Text>Chưa có sách.</Text>}
      {books.map((book) => (
        <Pressable key={book.id} accessibilityRole="button" accessibilityLabel={`Xem ${book.title}`}
          style={styles.book} onPress={() => router.push({ pathname: '/books/[id]', params: { id: book.id } })}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text>{book.author}</Text>
          <Text>{book.price.toLocaleString('vi-VN')} đồng</Text>
          <Text style={styles.detail}>Xem chi tiết</Text>
        </Pressable>
      ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  email: { marginTop: 12 },
  action: { marginTop: 20 },
  error: { marginTop: 12, color: '#b42318' },
  section: { fontSize: 20, fontWeight: '600', marginTop: 28, marginBottom: 12 },
  book: { borderWidth: 1, borderColor: '#ccc', padding: 14, marginBottom: 12, gap: 6 },
  bookTitle: { fontSize: 17, fontWeight: '600' },
  detail: { color: '#245c99' },
});
