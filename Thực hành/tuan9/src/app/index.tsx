import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Action, money, Screen, styles } from '../components/Common';
import { bookService } from '../services/bookService';
import { useAppDispatch, useAppSelector } from '../store';
import { logout, restoreSession } from '../store/authSlice';
import type { Book } from '../types';
import { errorMessage } from '../utils/errors';

const PAGE_SIZE = 10;

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { session, restoreError } = useAppSelector((state) => state.auth);
  const cartCount = useAppSelector((state) => state.cart.reduce((sum, item) => sum + item.quantity, 0));
  const [books, setBooks] = useState<Book[]>([]);
  const nextPage = useRef(2);
  const hasMore = useRef(false);
  const moreFailed = useRef(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [moreError, setMoreError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const requestVersion = useRef(0);
  const loadingMoreLock = useRef(false);

  useEffect(() => {
    const version = ++requestVersion.current;
    loadingMoreLock.current = false;
    nextPage.current = 2;
    hasMore.current = false;
    moreFailed.current = false;
    setBooks([]);
    setLoading(true);
    setLoadingMore(false);
    setError('');
    setMoreError('');
    bookService.getPage(1, PAGE_SIZE).then((data) => {
      if (requestVersion.current !== version) return;
      setBooks(data);
      hasMore.current = data.length === PAGE_SIZE;
    }).catch((err: unknown) => {
      if (requestVersion.current === version) setError(errorMessage(err));
    }).finally(() => {
      if (requestVersion.current === version) setLoading(false);
    });
    return () => { requestVersion.current += 1; };
  }, [attempt]);

  function loadMore(retry = false) {
    if (loading || loadingMoreLock.current || !hasMore.current || error || (moreFailed.current && !retry)) return;
    const version = requestVersion.current;
    loadingMoreLock.current = true;
    const requestedPage = nextPage.current;
    moreFailed.current = false;
    setLoadingMore(true);
    setMoreError('');
    bookService.getPage(requestedPage, PAGE_SIZE).then((data) => {
      if (requestVersion.current !== version) return;
      setBooks((current) => [...current, ...data]);
      nextPage.current = requestedPage + 1;
      hasMore.current = data.length === PAGE_SIZE;
    }).catch((err: unknown) => {
      if (requestVersion.current === version) {
        moreFailed.current = true;
        setMoreError(errorMessage(err));
      }
    }).finally(() => {
      if (requestVersion.current === version) {
        loadingMoreLock.current = false;
        setLoadingMore(false);
      }
    });
  }

  return (
    <Screen>
      <FlatList data={books} keyExtractor={(book) => String(book.id)} contentContainerStyle={styles.content}
        onEndReached={() => loadMore()} onEndReachedThreshold={0.3}
        ListHeaderComponent={
          <View style={styles.block}>
            <Text style={styles.title}>BookStore - Tuần 9</Text>
            <Text>{session ? `Xin chào ${session.user.name} (${session.user.email})` : 'Bạn chưa đăng nhập.'}</Text>
            <View style={styles.row}>
              {session ? <Action title="Đăng xuất" onPress={() => { void dispatch(logout()); }} />
                : <Action title="Đăng nhập / Đăng ký" onPress={() => router.push('/login')} />}
              <Action title={`Thanh toán (${cartCount})`} onPress={() => router.push('/checkout')} />
            </View>
            {!!restoreError && <>
              <Text style={styles.error}>{restoreError}</Text>
              <Action title="Thử xác minh lại" onPress={() => { void dispatch(restoreSession()); }} />
            </>}
            <Text style={styles.heading}>Danh sách sách</Text>
            {loading && <ActivityIndicator />}
            {!!error && <><Text style={styles.error}>{error}</Text><Action title="Thử tải lại" onPress={() => setAttempt((n) => n + 1)} /></>}
          </View>
        }
        ListEmptyComponent={!loading && !error ? <Text>Chưa có sách.</Text> : null}
        ListFooterComponent={loadingMore ? <ActivityIndicator /> : moreError ? <View style={styles.block}>
          <Text style={styles.error}>{moreError}</Text>
          <Action title="Thử tải thêm" onPress={() => loadMore(true)} />
        </View> : null}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.row}>
              <Image source={{ uri: item.image }} style={styles.cover} accessibilityLabel={`Bìa ${item.title}`} />
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.heading}>{item.title}</Text>
                <Text>{item.author}</Text><Text>{item.category}</Text><Text>{money(item.price)}</Text>
                <Action title="Xem chi tiết" onPress={() => router.push(`/books/${item.id}`)} />
              </View>
            </View>
          </View>
        )} />
    </Screen>
  );
}
