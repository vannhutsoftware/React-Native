import { router } from 'expo-router';
import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type Book = {
  id: number;
  title: string;
  author: string;
  price: string;
  discount: string;
  color: string;
};

export const BOOKS: Book[] = [
  { id: 1, title: 'Nhà Giả Kim', author: 'Paulo Coelho', price: '79.000đ', discount: '-20%', color: '#455a64' },
  { id: 2, title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', price: '86.000đ', discount: 'Mới', color: '#6d4c41' },
  { id: 3, title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', author: 'Rosie Nguyễn', price: '72.000đ', discount: '-15%', color: '#546e7a' },
  { id: 4, title: 'Cây Cam Ngọt Của Tôi', author: 'José Mauro', price: '95.000đ', discount: '-10%', color: '#5d4037' },
  { id: 5, title: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', author: 'Nguyễn Nhật Ánh', price: '81.000đ', discount: 'Mới', color: '#37474f' },
  { id: 6, title: 'Muôn Kiếp Nhân Sinh', author: 'Nguyên Phong', price: '118.000đ', discount: '-25%', color: '#4e5d3c' },
];

export const CATEGORIES = ['Văn học', 'Kinh tế', 'Thiếu nhi', 'Kỹ năng sống', 'Truyện tranh', 'Lịch sử'];

export function ExerciseShell({ children, title }: { children: ReactNode; title: string }) {
  return (
    <SafeAreaView style={styles.shell} edges={['top', 'bottom']}>
      <View style={styles.exerciseHeader}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Quay lại</Text>
        </Pressable>
        <Text numberOfLines={2} style={styles.exerciseTitle}>{title}</Text>
      </View>
      <View style={styles.exerciseBody}>{children}</View>
    </SafeAreaView>
  );
}

export function BookStoreHeader() {
  return (
    <View style={styles.storeHeader}>
      <Text style={styles.storeName}>BOOKSTORE</Text>
      <View style={styles.headerActions}>
        <Text style={styles.headerAction}>Tìm kiếm</Text>
        <Text style={styles.headerAction}>Giỏ hàng</Text>
      </View>
    </View>
  );
}

export function BookCover({ book, badge, style }: { book: Book; badge?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.cover, { backgroundColor: book.color }, style]}>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{book.discount}</Text>
        </View>
      ) : null}
      <Text style={styles.coverSmall}>BOOKSTORE</Text>
      <Text numberOfLines={3} style={styles.coverTitle}>{book.title}</Text>
    </View>
  );
}

export function BookRow({ book }: { book: Book }) {
  return (
    <View style={styles.bookRow}>
      <BookCover book={book} style={styles.rowCover} />
      <View style={styles.rowInfo}>
        <View>
          <Text numberOfLines={2} style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>
        </View>
        <Text style={styles.price}>{book.price}</Text>
      </View>
    </View>
  );
}

export function CategoryChips() {
  return (
    <View style={styles.chips}>
      {CATEGORIES.map((category) => (
        <View key={category} style={styles.chip}>
          <Text style={styles.chipText}>{category}</Text>
        </View>
      ))}
    </View>
  );
}

export function BookGrid({ badge = false, columns = 2 }: { badge?: boolean; columns?: 2 | 3 }) {
  return (
    <View style={[styles.grid, columns === 3 && styles.gridWithGap]}>
      {BOOKS.map((book) => (
        <View key={book.id} style={[styles.gridItem, columns === 3 && styles.threeColumnItem]}>
          <BookCover book={book} badge={badge} style={styles.gridCover} />
          <Text numberOfLines={2} style={styles.gridTitle}>{book.title}</Text>
          <Text style={styles.price}>{book.price}</Text>
        </View>
      ))}
    </View>
  );
}

export function FloatingCart() {
  return (
    <View style={styles.floatingCart}>
      <Text style={styles.floatingText}>Giỏ</Text>
      <View style={styles.cartCount}>
        <Text style={styles.countText}>3</Text>
      </View>
    </View>
  );
}

export function BottomTabs({ active = 'Trang chủ', onChange }: { active?: string; onChange?: (tab: string) => void }) {
  const tabs = ['Trang chủ', 'Danh mục', 'Giỏ hàng', 'Tài khoản'];
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <Pressable key={tab} onPress={() => onChange?.(tab)} style={styles.tabItem}>
          <Text style={[styles.tabText, tab === active && styles.activeTabText]}>{tab}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function HomeLayout({ onBookPress }: { onBookPress?: () => void }) {
  return (
    <View style={styles.fullScreen}>
      <BookStoreHeader />
      <ScrollView contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Danh mục</Text>
        <CategoryChips />
        <Text style={styles.sectionTitle}>Sách nổi bật</Text>
        {onBookPress ? (
          <Pressable onPress={onBookPress}>
            <BookGrid badge />
          </Pressable>
        ) : <BookGrid badge />}
      </ScrollView>
      <FloatingCart />
    </View>
  );
}

export function BookDetail({ onAdd }: { onAdd?: () => void }) {
  const book = BOOKS[0];
  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
        <BookCover book={book} style={styles.detailCover} />
        <Text style={styles.detailTitle}>{book.title}</Text>
        <Text style={styles.detailAuthor}>{book.author}</Text>
        <Text style={styles.detailPrice}>{book.price}</Text>
        <Text style={styles.descriptionTitle}>Mô tả sách</Text>
        <Text style={styles.description}>
          Nhà Giả Kim kể về hành trình theo đuổi ước mơ của một chàng chăn cừu trẻ. Trên đường đi, cậu học cách lắng nghe trái tim, nhận ra những dấu hiệu quanh mình và kiên trì với mục tiêu đã chọn.{`\n\n`}
          Cuốn sách gửi gắm thông điệp giản dị: mỗi trải nghiệm đều có ý nghĩa khi chúng ta dám bước ra khỏi vùng an toàn. Đây là phần mô tả dài để minh họa nội dung cuộn độc lập với thanh hành động cố định phía dưới.
        </Text>
      </ScrollView>
      <View style={styles.addBar}>
        <View>
          <Text style={styles.totalLabel}>Giá bán</Text>
          <Text style={styles.detailBarPrice}>{book.price}</Text>
        </View>
        <Pressable onPress={onAdd} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Thêm vào giỏ</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function CartLayout({ includeTabs = true }: { includeTabs?: boolean }) {
  return (
    <View style={styles.fullScreen}>
      <View style={styles.simpleTitleBar}>
        <Text style={styles.simpleTitle}>Giỏ hàng của bạn</Text>
      </View>
      <ScrollView contentContainerStyle={styles.cartList} showsVerticalScrollIndicator={false}>
        {BOOKS.slice(0, 4).map((book, index) => (
          <View key={book.id} style={styles.cartRow}>
            <BookCover book={book} style={styles.cartCover} />
            <View style={styles.cartInfo}>
              <Text numberOfLines={2} style={styles.cartBookTitle}>{book.title}</Text>
              <Text style={styles.quantity}>Số lượng: {index === 1 ? 2 : 1}</Text>
            </View>
            <Text style={styles.cartPrice}>{book.price}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.checkout}>
        <View>
          <Text style={styles.totalLabel}>Tổng tiền</Text>
          <Text style={styles.checkoutPrice}>433.000đ</Text>
        </View>
        <View style={styles.checkoutButton}>
          <Text style={styles.primaryButtonText}>Thanh toán</Text>
        </View>
      </View>
      {includeTabs ? <BottomTabs active="Giỏ hàng" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { backgroundColor: '#ffffff', flex: 1, maxWidth: '100%', overflow: 'hidden', width: '100%' },
  exerciseHeader: {
    alignItems: 'center',
    borderBottomColor: '#d9dce8',
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 58,
    minWidth: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: '100%',
  },
  backButton: { borderColor: '#303f9f', borderRadius: 6, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 7 },
  backText: { color: '#303f9f', fontSize: 13, fontWeight: '600' },
  exerciseTitle: { color: '#202335', flex: 1, flexShrink: 1, fontSize: 15, fontWeight: '700', marginLeft: 12, minWidth: 0 },
  exerciseBody: { flex: 1, minWidth: 0, overflow: 'hidden', width: '100%' },
  fullScreen: { flex: 1, minWidth: 0, overflow: 'hidden', position: 'relative', width: '100%' },
  storeHeader: {
    alignItems: 'center',
    backgroundColor: '#303f9f',
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  storeName: { color: '#ffffff', fontSize: 18, fontWeight: '800' },
  headerActions: { flexDirection: 'row', gap: 14 },
  headerAction: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  cover: {
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 8,
    position: 'relative',
  },
  coverSmall: { color: '#e8eaf6', fontSize: 9, letterSpacing: 1, marginBottom: 6 },
  coverTitle: { color: '#ffffff', fontSize: 15, fontWeight: '700', textAlign: 'center' },
  badge: { backgroundColor: '#e64a3b', borderRadius: 4, left: 6, paddingHorizontal: 7, paddingVertical: 4, position: 'absolute', top: 6 },
  badgeText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  bookRow: {
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderColor: '#dfe1e8',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 10,
  },
  rowCover: { height: 110, width: 80 },
  rowInfo: { flex: 1, height: 110, justifyContent: 'space-between', paddingVertical: 3 },
  bookTitle: { color: '#202335', fontSize: 16, fontWeight: '700' },
  author: { color: '#6a6f7c', fontSize: 13, marginTop: 5 },
  price: { color: '#303f9f', fontSize: 14, fontWeight: '700' },
  chips: { alignContent: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderColor: '#3f51b5', borderRadius: 20, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 8 },
  chipText: { color: '#303f9f', fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridWithGap: { gap: 8, justifyContent: 'flex-start' },
  gridItem: { marginBottom: 16, width: '48%' },
  threeColumnItem: { flexBasis: '31%', flexGrow: 1, maxWidth: '32%', width: '31%' },
  gridCover: { aspectRatio: 3 / 4, marginBottom: 7, width: '100%' },
  gridTitle: { color: '#202335', fontSize: 13, fontWeight: '600', minHeight: 34 },
  floatingCart: {
    alignItems: 'center',
    backgroundColor: '#3f51b5',
    borderRadius: 30,
    bottom: 24,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    width: 60,
  },
  floatingText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  cartCount: { alignItems: 'center', backgroundColor: '#e64a3b', borderRadius: 10, height: 20, justifyContent: 'center', position: 'absolute', right: -2, top: -4, width: 20 },
  countText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  tabBar: { backgroundColor: '#ffffff', borderTopColor: '#d9dce8', borderTopWidth: 1, flexDirection: 'row', height: 64 },
  tabItem: { alignItems: 'center', flex: 1, flexDirection: 'column', justifyContent: 'center', paddingHorizontal: 3 },
  tabText: { color: '#737785', fontSize: 12, textAlign: 'center' },
  activeTabText: { color: '#303f9f', fontWeight: '700' },
  homeContent: { padding: 16, paddingBottom: 100 },
  sectionTitle: { color: '#202335', fontSize: 18, fontWeight: '700', marginBottom: 10, marginTop: 6 },
  detailContent: { padding: 18, paddingBottom: 30 },
  detailCover: { alignSelf: 'center', aspectRatio: 3 / 4, marginBottom: 18, width: '52%' },
  detailTitle: { color: '#202335', fontSize: 24, fontWeight: '700' },
  detailAuthor: { color: '#6a6f7c', fontSize: 15, marginTop: 5 },
  detailPrice: { color: '#303f9f', fontSize: 20, fontWeight: '700', marginTop: 10 },
  descriptionTitle: { color: '#202335', fontSize: 17, fontWeight: '700', marginBottom: 6, marginTop: 20 },
  description: { color: '#4f5360', fontSize: 15, lineHeight: 23 },
  addBar: { alignItems: 'center', backgroundColor: '#ffffff', borderTopColor: '#d9dce8', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
  totalLabel: { color: '#6a6f7c', fontSize: 12 },
  detailBarPrice: { color: '#303f9f', fontSize: 17, fontWeight: '700', marginTop: 2 },
  primaryButton: { backgroundColor: '#303f9f', borderRadius: 7, paddingHorizontal: 18, paddingVertical: 12 },
  primaryButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  simpleTitleBar: { backgroundColor: '#303f9f', padding: 16 },
  simpleTitle: { color: '#ffffff', fontSize: 19, fontWeight: '700' },
  cartList: { gap: 10, padding: 12 },
  cartRow: { alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#dfe1e8', borderRadius: 8, borderWidth: 1, flexDirection: 'row', padding: 9 },
  cartCover: { height: 78, width: 56 },
  cartInfo: { flex: 1, marginHorizontal: 10 },
  cartBookTitle: { color: '#202335', fontSize: 14, fontWeight: '600' },
  quantity: { color: '#6a6f7c', fontSize: 12, marginTop: 7 },
  cartPrice: { color: '#303f9f', fontSize: 13, fontWeight: '700', width: 72 },
  checkout: { alignItems: 'center', backgroundColor: '#f7f7fb', borderTopColor: '#d9dce8', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
  checkoutPrice: { color: '#202335', fontSize: 18, fontWeight: '700', marginTop: 2 },
  checkoutButton: { backgroundColor: '#303f9f', borderRadius: 7, paddingHorizontal: 20, paddingVertical: 12 },
});
