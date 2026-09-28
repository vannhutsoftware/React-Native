import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
import { useCart } from '../hooks/useCart';
import { RootStackParamList } from '../navigation/types';

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'CartNavigationExercise'
>;

export function CartNavigationExerciseScreen({ navigation }: NavigationProps) {
  const { items, totalPrice, totalQuantity } = useCart();

  return (
    <Page>
      <Text style={commonStyles.screenTitle}>Bài tập 2</Text>
      <Text style={commonStyles.description}>
        Từ màn hình Giỏ hàng, nút Thanh toán điều hướng sang
        CheckoutScreen và truyền tổng tiền qua route.params.
      </Text>

      {items.map((item) => (
        <Card key={item.bookId}>
          <Text style={commonStyles.strong}>{item.book.title}</Text>
          <Text style={styles.author}>Số lượng: {item.quantity}</Text>
          <Money value={item.book.price * item.quantity} />
        </Card>
      ))}

      <Card style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={commonStyles.strong}>Tổng số lượng</Text>
          <Text style={commonStyles.strong}>{totalQuantity}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={commonStyles.strong}>Tổng tiền</Text>
          <Money value={totalPrice} />
        </View>
        <View style={styles.checkoutSpace}>
          <Button
            disabled={items.length === 0}
            label="Thanh toán"
            onPress={() => navigation.navigate('Checkout', { total: totalPrice })}
          />
        </View>
      </Card>
    </Page>
  );
}

export function CartStoreExerciseScreen() {
  const {
    items,
    totalPrice,
    totalQuantity,
    add,
    increase,
    decrease,
    remove,
  } = useCart();

  return (
    <View style={styles.screen}>
      <Page>
        <Text style={commonStyles.screenTitle}>Bài tập 3</Text>
        <Text style={commonStyles.description}>
          Giỏ hàng dùng store toàn cục qua adapter useCart(), có thêm, xóa,
          cập nhật số lượng và các giá trị tổng.
        </Text>

        <SectionTitle>Store giỏ hàng</SectionTitle>
        {items.length === 0 ? (
          <Card>
            <Text style={commonStyles.label}>Giỏ hàng đang trống.</Text>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.bookId}>
              <Text style={commonStyles.strong}>{item.book.title}</Text>
              <Text style={styles.author}>{item.book.author}</Text>
              <Money value={item.book.price * item.quantity} />
              <View style={styles.controls}>
                <Button
                  label="−"
                  variant="secondary"
                  onPress={() => decrease(item.bookId)}
                />
                <Text style={styles.quantity}>{item.quantity}</Text>
                <Button
                  label="+"
                  variant="secondary"
                  onPress={() => increase(item.bookId)}
                />
                <View style={styles.removeButton}>
                  <Button
                    label="Xóa"
                    variant="danger"
                    onPress={() => remove(item.bookId)}
                  />
                </View>
              </View>
            </Card>
          ))
        )}

        <Card style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={commonStyles.strong}>Tổng số lượng</Text>
            <Text style={commonStyles.strong}>{totalQuantity}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={commonStyles.strong}>Tổng tiền</Text>
            <Money value={totalPrice} />
          </View>
        </Card>

        <SectionTitle>Thêm sách để thử store</SectionTitle>
        {books.map((book) => (
          <View key={book.id} style={styles.addRow}>
            <View style={styles.addInfo}>
              <Text style={commonStyles.label}>{book.title}</Text>
              <Money value={book.price} />
            </View>
            <Button label="Thêm" variant="secondary" onPress={() => add(book.id)} />
          </View>
        ))}
      </Page>

      <View style={styles.floatingCart}>
        <Text style={styles.floatingText}>Giỏ hàng</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalQuantity}</Text>
        </View>
      </View>
    </View>
  );
}

type CheckoutProps = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export function CheckoutScreen({ route }: CheckoutProps) {
  return (
    <Page>
      <Text style={commonStyles.screenTitle}>Thanh toán</Text>
      <Text style={commonStyles.description}>
        Khung tối giản theo yêu cầu Tuần 5. Form thanh toán sẽ hoàn thiện ở
        Tuần 9.
      </Text>
      <Card>
        <Text style={styles.routeText}>Tổng tiền nhận từ route.params:</Text>
        <View style={styles.totalSpace}>
          <Money value={route.params.total} />
        </View>
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  author: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 8,
    marginTop: 2,
  },
  controls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  quantity: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    marginLeft: 'auto',
  },
  summary: {
    backgroundColor: colors.paleBlue,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  checkoutSpace: {
    marginTop: 6,
  },
  addRow: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 10,
  },
  addInfo: {
    flex: 1,
    paddingRight: 8,
  },
  floatingCart: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderRadius: 4,
    bottom: 12,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    position: 'absolute',
    right: 12,
  },
  floatingText: {
    color: colors.white,
    fontWeight: '600',
  },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 24,
    minWidth: 24,
    paddingHorizontal: 5,
  },
  badgeText: {
    color: colors.navy,
    fontWeight: '700',
  },
  routeText: {
    color: colors.muted,
    fontSize: 14,
  },
  totalSpace: {
    marginTop: 8,
  },
});
