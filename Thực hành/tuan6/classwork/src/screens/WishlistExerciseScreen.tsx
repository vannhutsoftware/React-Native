import { StyleSheet, Text, View } from 'react-native';

import {
  Button,
  Card,
  colors,
  commonStyles,
  Money,
  Page,
  SectionTitle,
} from '../components/Common';
import { books } from '../data/books';
import { useWishlist } from '../hooks/useWishlist';

export function WishlistExerciseScreen() {
  const { bookIds, total, has, toggle } = useWishlist();
  const favoriteBooks = books.filter((book) => bookIds.includes(book.id));

  return (
    <Page>
      <Text style={commonStyles.screenTitle}>Thử thách</Text>
      <Text style={commonStyles.description}>
        Store wishlist dùng cùng kiểu adapter như store giỏ hàng.
      </Text>

      <Card style={styles.countCard}>
        <Text style={commonStyles.strong}>Số sách yêu thích: {total}</Text>
      </Card>

      <SectionTitle>Danh sách sách</SectionTitle>
      {books.map((book) => (
        <Card key={book.id}>
          <View style={styles.bookRow}>
            <View style={styles.bookInfo}>
              <Text style={commonStyles.strong}>{book.title}</Text>
              <Text style={styles.author}>{book.author}</Text>
              <Money value={book.price} />
            </View>
            <Button
              label={has(book.id) ? 'Bỏ yêu thích' : 'Yêu thích'}
              variant={has(book.id) ? 'danger' : 'secondary'}
              onPress={() => toggle(book.id)}
            />
          </View>
        </Card>
      ))}

      <SectionTitle>Đang yêu thích</SectionTitle>
      {favoriteBooks.length === 0 ? (
        <Card>
          <Text style={commonStyles.label}>Chưa có sách yêu thích.</Text>
        </Card>
      ) : (
        favoriteBooks.map((book) => (
          <View key={book.id} style={styles.favoriteRow}>
            <Text style={styles.favoriteTitle}>{book.title}</Text>
            <Text style={styles.saved}>Dùng chung store</Text>
          </View>
        ))
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  countCard: {
    backgroundColor: colors.paleBlue,
  },
  bookRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  bookInfo: {
    flex: 1,
  },
  author: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 6,
    marginTop: 3,
  },
  favoriteRow: {
    backgroundColor: colors.white,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    padding: 12,
  },
  favoriteTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  saved: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3,
  },
});
