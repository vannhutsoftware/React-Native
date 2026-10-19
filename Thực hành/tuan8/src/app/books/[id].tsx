import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAxiosError } from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import RatingStars from '../../components/RatingStars';
import { bookService, reviewService } from '../../services/bookService';
import type { AppDispatch, RootState } from '../../store';
import { clearSession } from '../../store/authSlice';
import type { Book, Review } from '../../types/book';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');
  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const loginRoute = { pathname: '/login', params: { redirect: `/books/${id}` } } as const;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setBook(null);
    setRating(0);
    setComment('');
    setFormError('');
    setMessage('');
    Promise.all([bookService.getById(id), reviewService.getByBook(id)]).then(([data, items]) => {
      if (active) { setBook(data); setReviews(items); }
    }).catch((err) => {
      if (active) setError(isAxiosError(err) && err.response?.status === 404
        ? 'Không tìm thấy sách.' : 'Không tải được chi tiết sách. Vui lòng thử lại.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [id, attempt]);

  useEffect(() => {
    if (!book) return;
    let active = true;
    setRelatedBooks([]);
    setRelatedError('');
    setRelatedLoading(true);
    bookService.getRelated(book).then((items) => {
      if (active) setRelatedBooks(items);
    }).catch(() => {
      if (active) setRelatedError('Không tải được sách liên quan.');
    }).finally(() => {
      if (active) setRelatedLoading(false);
    });
    return () => { active = false; };
  }, [book]);

  async function submitReview() {
    if (submitting || !token || !user) return;
    setFormError('');
    setMessage('');
    if (rating < 1) { setFormError('Vui lòng chọn số sao từ 1 đến 5.'); return; }
    if (!comment.trim()) { setFormError('Vui lòng nhập bình luận.'); return; }

    setSubmitting(true);
    try {
      const created = await reviewService.create({ bookId: id, rating, comment: comment.trim() }, token);
      // Chỉ thêm kết quả POST vào state; điểm trung bình được tính lại từ mảng mới.
      setReviews((items) => [...items, created]);
      setRating(0);
      setComment('');
      setMessage('Gửi đánh giá thành công.');
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        try {
          await AsyncStorage.removeItem('auth');
          dispatch(clearSession());
          router.replace(loginRoute);
        } catch {
          setFormError('Không thể xóa phiên hết hạn. Vui lòng thử lại.');
        }
      } else {
        setFormError(isAxiosError<{ message: string }>(err)
          ? (err.response?.data?.message ?? 'Không gửi được đánh giá. Vui lòng thử lại.')
          : 'Không gửi được đánh giá. Vui lòng thử lại.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !book) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.text}>{loading ? 'Đang tải chi tiết sách...' : error}</Text>
        {!loading && <Button title="Thử lại" onPress={() => setAttempt((value) => value + 1)} />}
        <Button title="Về Home" onPress={() => router.replace('/home')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList key={id} data={reviews} keyExtractor={(item) => item.id} keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View>
              <Button title="Về Home" onPress={() => router.replace('/home')} />
              <Text style={styles.heading}>{book.title}</Text>
              <Text style={styles.text}>Tác giả: {book.author}</Text>
              <Text style={styles.text}>Danh mục: {book.category}</Text>
              <Text style={styles.text}>Giá: {book.price.toLocaleString('vi-VN')} đồng</Text>
              <Text style={styles.text}>{book.description}</Text>
              <Text style={styles.section}>Đánh giá sách</Text>
              <RatingStars value={average} size={24} />
              <Text style={styles.text}>{average.toFixed(1)}/5 ({reviews.length} đánh giá)</Text>
            </View>
          }
          ListEmptyComponent={<Text style={styles.text}>Chưa có đánh giá.</Text>}
          renderItem={({ item }) => (
            <View style={styles.review}>
              <Text style={styles.userName}>{item.userName}</Text>
              <RatingStars value={item.rating} size={18} />
              <Text>{item.rating}/5 sao</Text>
              <Text style={styles.text}>{item.comment}</Text>
            </View>
          )}
          ListFooterComponent={
            <View style={styles.footer}>
              {token && user ? (
                <>
                  <Text style={styles.section}>Viết đánh giá</Text>
                  <Text>Chọn số sao</Text>
                  <RatingStars value={rating} size={30} onChange={setRating} disabled={submitting} />
                  <Text style={styles.text}>Bình luận</Text>
                  <TextInput accessibilityLabel="Bình luận" value={comment} onChangeText={setComment}
                    editable={!submitting} multiline placeholder="Nhập bình luận" style={styles.input} />
                  {!!formError && <Text accessibilityRole="alert" style={styles.error}>{formError}</Text>}
                  {!!message && <Text style={styles.success}>{message}</Text>}
                  <View style={styles.action}>
                    <Button title={submitting ? 'Đang gửi...' : 'Gửi đánh giá'} disabled={submitting} onPress={() => void submitReview()} />
                  </View>
                </>
              ) : (
                <View style={styles.action}>
                  <Text style={styles.text}>Vui lòng đăng nhập để gửi đánh giá.</Text>
                  <Button title="Đăng nhập để đánh giá" onPress={() => router.push(loginRoute)} />
                </View>
              )}
              <Text style={styles.section}>Sách liên quan</Text>
              {relatedLoading ? <Text>Đang tải sách liên quan...</Text> : relatedError ? (
                <Text style={styles.error}>{relatedError}</Text>
              ) : (
                <FlatList horizontal data={relatedBooks} keyExtractor={(item) => item.id}
                  accessibilityLabel="Danh sách sách liên quan" showsHorizontalScrollIndicator
                  ListEmptyComponent={<Text>Chưa có sách liên quan.</Text>}
                  renderItem={({ item }) => (
                    <Pressable accessibilityRole="button" accessibilityLabel={`Xem sách liên quan ${item.title}`}
                      style={styles.relatedBook}
                      onPress={() => router.push({ pathname: '/books/[id]', params: { id: item.id } })}>
                      <Text style={styles.userName}>{item.title}</Text>
                      <Text>{item.category}</Text>
                      <Text>{item.price.toLocaleString('vi-VN')} đồng</Text>
                    </Pressable>
                  )} />
              )}
            </View>
          } />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', padding: 24 },
  flex: { flex: 1 },
  heading: { fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  section: { fontSize: 20, fontWeight: '600', marginTop: 24, marginBottom: 10 },
  text: { marginVertical: 8 },
  review: { borderTopWidth: 1, borderColor: '#ddd', paddingVertical: 12 },
  userName: { fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#999', borderRadius: 4, padding: 12, minHeight: 90, textAlignVertical: 'top', fontSize: 16 },
  action: { marginTop: 16 },
  footer: { paddingBottom: 24 },
  relatedBook: { width: 200, borderWidth: 1, borderColor: '#ccc', padding: 12, marginRight: 12, gap: 8 },
  error: { color: '#b42318', marginTop: 8 },
  success: { color: '#26703c', marginTop: 8 },
});
