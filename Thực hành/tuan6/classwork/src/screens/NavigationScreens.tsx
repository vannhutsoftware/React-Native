import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import {
  Button,
  Card,
  colors,
  commonStyles,
  Money,
  Page,
} from '../components/Common';
import { books, findBook } from '../data/books';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { HomeStackParamList } from '../navigation/types';

type HomeProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;
type DetailProps = NativeStackScreenProps<HomeStackParamList, 'BookDetail'>;

export function HomeScreen({ navigation }: HomeProps) {
  const { totalQuantity } = useCart();

  return (
    <View style={styles.flex}>
      <Page>
        <Text style={commonStyles.screenTitle}>BookStore</Text>
        <Text style={commonStyles.description}>
          Nhấn vào một Book Card để truyền bookId sang màn hình chi tiết.
        </Text>
        <View style={styles.grid}>
          {books.map((book) => (
            <Card key={book.id} style={styles.bookCard}>
              <View style={styles.bookCover}>
                <Text style={styles.bookCoverText}>BOOK</Text>
              </View>
              <Text numberOfLines={2} style={styles.bookTitle}>
                {book.title}
              </Text>
              <Text style={styles.meta}>{book.author}</Text>
              <Money value={book.price} />
              <View style={styles.buttonSpace}>
                <Button
                  label="Xem chi tiết"
                  onPress={() =>
                    navigation.navigate('BookDetail', { bookId: book.id })
                  }
                />
              </View>
            </Card>
          ))}
        </View>
      </Page>
      <View style={styles.floatingCart}>
        <Text style={styles.floatingText}>Giỏ hàng: {totalQuantity}</Text>
      </View>
    </View>
  );
}

export function BookDetailScreen({ route }: DetailProps) {
  const { add } = useCart();
  const book = findBook(route.params.bookId);

  if (!book) {
    return (
      <Page>
        <Text>Không tìm thấy sách.</Text>
      </Page>
    );
  }

  return (
    <Page>
      <Text style={commonStyles.screenTitle}>Chi tiết sách</Text>
      <Card>
        <Text style={styles.paramLabel}>route.params.bookId</Text>
        <Text style={styles.paramValue}>{route.params.bookId}</Text>
      </Card>
      <Card>
        <View style={styles.detailCover}>
          <Text style={styles.detailCoverText}>BOOK</Text>
        </View>
        <Text style={styles.detailTitle}>{book.title}</Text>
        <Text style={styles.detailLine}>Tác giả: {book.author}</Text>
        <Text style={styles.detailLine}>Danh mục: {book.category}</Text>
        <Money value={book.price} />
        <View style={styles.buttonSpace}>
          <Button label="Thêm vào giỏ" onPress={() => add(book.id)} />
        </View>
      </Card>
    </Page>
  );
}

export function CategoriesScreen() {
  const categories = [...new Set(books.map((book) => book.category))];
  return (
    <Page>
      <Text style={commonStyles.screenTitle}>Danh mục</Text>
      <Text style={commonStyles.description}>Tab Danh mục trong Bottom Tab.</Text>
      {categories.map((category) => (
        <Card key={category}>
          <Text style={commonStyles.strong}>{category}</Text>
        </Card>
      ))}
    </Page>
  );
}

export function CartTabScreen() {
  const { items, totalPrice, totalQuantity } = useCart();
  return (
    <Page>
      <Text style={commonStyles.screenTitle}>Giỏ hàng</Text>
      <Text style={commonStyles.description}>Dữ liệu được đọc từ store Redux.</Text>
      {items.map((item) => (
        <Card key={item.bookId}>
          <Text style={commonStyles.strong}>{item.book.title}</Text>
          <Text style={commonStyles.label}>Số lượng: {item.quantity}</Text>
        </Card>
      ))}
      <Text style={commonStyles.strong}>Tổng số lượng: {totalQuantity}</Text>
      <Money value={totalPrice} />
    </Page>
  );
}

export function AccountTabScreen() {
  const { isLoggedIn, user } = useAuth();
  return (
    <Page>
      <Text style={commonStyles.screenTitle}>Tài khoản</Text>
      <Card>
        <Text style={commonStyles.strong}>
          {isLoggedIn ? `Xin chào, ${user?.name}` : 'Khách chưa đăng nhập'}
        </Text>
        <Text style={styles.detailLine}>
          Mở Bài tập 4 từ danh sách ngoài để thay đổi trạng thái.
        </Text>
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bookCard: {
    marginBottom: 0,
    width: '48%',
  },
  bookCover: {
    alignItems: 'center',
    backgroundColor: colors.paleBlue,
    height: 90,
    justifyContent: 'center',
    marginBottom: 10,
  },
  bookCoverText: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: '700',
  },
  bookTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    minHeight: 38,
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 7,
    marginTop: 3,
  },
  buttonSpace: {
    marginTop: 12,
  },
  floatingCart: {
    backgroundColor: colors.navy,
    borderRadius: 4,
    bottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    position: 'absolute',
    right: 12,
  },
  floatingText: {
    color: colors.white,
    fontWeight: '700',
  },
  paramLabel: {
    color: colors.muted,
    fontSize: 12,
  },
  paramValue: {
    color: colors.blue,
    fontSize: 19,
    fontWeight: '700',
    marginTop: 4,
  },
  detailCover: {
    alignItems: 'center',
    backgroundColor: colors.paleBlue,
    height: 150,
    justifyContent: 'center',
    marginBottom: 14,
  },
  detailCoverText: {
    color: colors.navy,
    fontSize: 24,
    fontWeight: '700',
  },
  detailTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 8,
  },
  detailLine: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});
