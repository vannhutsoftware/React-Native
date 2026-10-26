import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Action, Field, money, Page, styles } from '../../components/Common';
import RatingStars from '../../components/RatingStars';
import { bookService } from '../../services/bookService';
import { reviewService } from '../../services/reviewService';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/authSlice';
import { addToCart } from '../../store/cartSlice';
import type { Book, Review } from '../../types';
import { errorMessage, statusOf } from '../../utils/errors';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // Đổi key để các state/draft không bị lẫn khi mở cuốn sách liên quan.
  return <BookDetail key={id} bookId={Number(id)} />;
}

function BookDetail({ bookId }: { bookId: number }) {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth.session);
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Book[]>([]);
  const [relatedError, setRelatedError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingError, setRatingError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setRelatedError('');
    setRelated([]);
    async function load() {
      try {
        if (!Number.isInteger(bookId) || bookId <= 0) throw new Error('Mã sách không hợp lệ.');
        const [info, list] = await Promise.all([bookService.getById(bookId), reviewService.getByBook(bookId)]);
        if (!active) return;
        setBook(info);
        setReviews(list);
        // Lỗi sách liên quan không che thông tin sách và đánh giá đã tải được.
        bookService.getRelated(info).then((data) => { if (active) setRelated(data); })
          .catch((err: unknown) => { if (active) setRelatedError(errorMessage(err)); });
      } catch (err) {
        if (active) setError(errorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [bookId, attempt]);

  const average = useMemo(() => reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0, [reviews]);

  async function submitReview() {
    if (!session || busy) return;
    const invalidRating = !Number.isInteger(rating) || rating < 1 || rating > 5;
    setRatingError(invalidRating ? 'Vui lòng chọn điểm từ 1 đến 5.' : '');
    setCommentError(!comment.trim() ? 'Vui lòng nhập bình luận.' : '');
    setSubmitError('');
    setMessage('');
    if (invalidRating || !comment.trim()) return;
    setBusy(true);
    try {
      const created = await reviewService.create({ bookId, userId: session.user.id,
        userName: session.user.name, rating, comment: comment.trim() });
      setReviews((previous) => [created, ...previous]);
      setRating(0);
      setComment('');
      setMessage('Đã gửi đánh giá.');
    } catch (err) {
      if (statusOf(err) === 401) await dispatch(logout());
      setSubmitError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function deleteReview(reviewId: number) {
    if (busy) return;
    setBusy(true);
    setSubmitError('');
    setMessage('');
    try {
      await reviewService.remove(reviewId);
      setReviews((previous) => previous.filter((review) => review.id !== reviewId));
      setMessage('Đã xoá đánh giá.');
    } catch (err) {
      if (statusOf(err) === 401) await dispatch(logout());
      setSubmitError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page title="Chi tiết sách">
      <Action title="Về trang chủ" onPress={() => router.replace('/')} />
      {loading ? <ActivityIndicator /> : error || !book ? <>
        <Text style={styles.error}>{error || 'Không tìm thấy sách.'}</Text>
        <Action title="Thử lại" onPress={() => setAttempt((n) => n + 1)} />
      </> : <>
        <Image source={{ uri: book.image }} style={styles.cover} accessibilityLabel={`Bìa ${book.title}`} />
        <Text style={styles.title}>{book.title}</Text>
        <Text>Tác giả: {book.author}</Text><Text>Thể loại: {book.category}</Text>
        <Text>Giá: {money(book.price)}</Text><Text>{book.description}</Text>
        <Action title="Thêm vào giỏ" onPress={() => { dispatch(addToCart(book)); setMessage('Đã thêm sách vào giỏ.'); }} />
        <Action title="Đến thanh toán" onPress={() => router.push('/checkout')} />
        <Text style={styles.heading}>Bài 3 - Đánh giá ({reviews.length})</Text>
        <RatingStars value={average} size={18} />
        {!!message && <Text accessibilityRole="alert">{message}</Text>}
        {!!submitError && <Text accessibilityRole="alert" style={styles.error}>{submitError}</Text>}
        {session ? <View style={styles.block}>
          <Text>Viết đánh giá với tên {session.user.name}</Text>
          <Text>Chọn điểm</Text><RatingStars value={rating} onChange={setRating} disabled={busy} />
          {!!ratingError && <Text style={styles.error}>{ratingError}</Text>}
          <Field label="Bình luận" value={comment} onChangeText={setComment} error={commentError}
            multiline editable={!busy} style={{ minHeight: 90, textAlignVertical: 'top' }} />
          <Action title={busy ? 'Đang xử lý...' : 'Gửi đánh giá'} disabled={busy} onPress={() => { void submitReview(); }} />
        </View> : <Action title="Đăng nhập để viết đánh giá" onPress={() => router.push({
          pathname: '/login', params: { redirect: `/books/${bookId}` },
        })} />}
        {!reviews.length && <Text>Chưa có đánh giá.</Text>}
        {reviews.map((review) => <View key={review.id} style={styles.item}>
          <Text style={styles.heading}>{review.userName}</Text>
          <RatingStars value={review.rating} />
          <Text>{review.comment}</Text>
          <Text style={styles.muted}>{new Date(review.createdAt).toLocaleString('vi-VN')}</Text>
          {review.userId === session?.user.id && <Action title="Xoá đánh giá của tôi" disabled={busy}
            onPress={() => { void deleteReview(review.id); }} />}
        </View>)}
        <Text style={styles.heading}>Sách liên quan</Text>
        {!!relatedError && <Text style={styles.error}>{relatedError}</Text>}
        <FlatList horizontal data={related} keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={!relatedError ? <Text>Chưa có sách liên quan.</Text> : null}
          renderItem={({ item }) => <View style={styles.related}>
            <Text style={styles.heading}>{item.title}</Text><Text>{item.author}</Text><Text>{money(item.price)}</Text>
            <Action title="Xem sách" onPress={() => router.push(`/books/${item.id}`)} />
          </View>} />
      </>}
    </Page>
  );
}
