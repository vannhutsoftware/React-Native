import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  BOOKS,
  BookCover,
  BookDetail,
  BookGrid,
  BookRow,
  BookStoreHeader,
  BottomTabs,
  CartLayout,
  CategoryChips,
  FloatingCart,
  HomeLayout,
} from '@/components/shared';

export function ExerciseRenderer({ id }: { id: string }) {
  switch (id) {
    case '1-1': return <HeaderExercise />;
    case '1-2': return <BookCardExercise />;
    case '1-3': return <HourOneChallenge />;
    case '2-1': return <CategoryExercise />;
    case '2-2': return <TwoColumnGridExercise />;
    case '2-3': return <ThreeColumnChallenge />;
    case '3-1': return <BadgeExercise />;
    case '3-2': return <FloatingCartExercise />;
    case '3-3': return <OverlayChallenge />;
    case '4-1': return <HomeLayout />;
    case '4-2': return <BookDetail />;
    case '5-1': return <TabBarExercise />;
    case '5-2': return <CartLayout />;
    case '5-3': return <FinalChallenge />;
    default: return null;
  }
}

function HeaderExercise() {
  return (
    <View style={styles.centeredArea}>
      <View style={styles.demoFrame}>
        <BookStoreHeader />
        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>Header cao 56</Text>
          <Text style={styles.note}>Các phần tử nằm trên một hàng, căn giữa theo chiều dọc và tách đều hai phía.</Text>
        </View>
      </View>
    </View>
  );
}

function BookCardExercise() {
  return (
    <View style={styles.paddedTop}>
      <BookRow book={BOOKS[2]} />
    </View>
  );
}

function HourOneChallenge() {
  return (
    <View style={styles.screen}>
      <BookStoreHeader />
      <ScrollView contentContainerStyle={styles.verticalList} showsVerticalScrollIndicator={false}>
        {BOOKS.slice(0, 5).map((book) => <BookRow book={book} key={book.id} />)}
      </ScrollView>
    </View>
  );
}

function CategoryExercise() {
  return (
    <View style={styles.paddedTop}>
      <Text style={styles.pageHeading}>Danh mục sách</Text>
      <CategoryChips />
      <View style={styles.noteBox}>
        <Text style={styles.note}>Các chip tự xuống dòng theo chiều rộng màn hình.</Text>
      </View>
    </View>
  );
}

function TwoColumnGridExercise() {
  return (
    <ScrollView contentContainerStyle={styles.gridPage} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageHeading}>Sách nổi bật</Text>
      <BookGrid />
    </ScrollView>
  );
}

function ThreeColumnChallenge() {
  return (
    <ScrollView contentContainerStyle={styles.gridPage} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageHeading}>Lưới sách 3 cột</Text>
      <Text style={styles.lead}>Dùng gap 8 và flexBasis để khoảng cách giữa các cột luôn đều.</Text>
      <BookGrid columns={3} />
    </ScrollView>
  );
}

function BadgeExercise() {
  return (
    <View style={styles.centeredArea}>
      <View>
        <BookCover badge book={BOOKS[0]} style={styles.largeCover} />
        <Text style={styles.coverCaption}>Badge nằm chồng trên bìa sách</Text>
      </View>
    </View>
  );
}

function FloatingCartExercise() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.placeholderList} showsVerticalScrollIndicator={false}>
        {BOOKS.map((book) => (
          <View key={book.id} style={styles.placeholderRow}>
            <Text style={styles.placeholderTitle}>{book.title}</Text>
            <Text style={styles.placeholderAuthor}>{book.author}</Text>
          </View>
        ))}
      </ScrollView>
      <FloatingCart />
    </View>
  );
}

function OverlayChallenge() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.gridWithCart} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageHeading}>Ưu đãi hôm nay</Text>
        <BookGrid badge />
      </ScrollView>
      <FloatingCart />
    </View>
  );
}

function TabBarExercise() {
  return (
    <View style={styles.screen}>
      <View style={styles.tabDemoContent}>
        <Text style={styles.pageHeading}>Trang chủ</Text>
        <Text style={styles.lead}>Thanh tab nằm ngoài vùng nội dung và chia đều thành 4 phần.</Text>
      </View>
      <BottomTabs />
    </View>
  );
}

function FinalChallenge() {
  const [activeTab, setActiveTab] = useState('Trang chủ');
  const [showDetail, setShowDetail] = useState(false);
  const [message, setMessage] = useState('');

  const changeTab = (tab: string) => {
    setActiveTab(tab);
    setShowDetail(false);
    setMessage('');
  };

  let content;
  if (showDetail) {
    content = <BookDetail onAdd={() => setMessage('Đã thêm sách vào giỏ')} />;
  } else if (activeTab === 'Trang chủ') {
    content = <HomeLayout onBookPress={() => setShowDetail(true)} />;
  } else if (activeTab === 'Danh mục') {
    content = (
      <ScrollView contentContainerStyle={styles.categoryPage}>
        <Text style={styles.pageHeading}>Tất cả danh mục</Text>
        <CategoryChips />
        <BookGrid />
      </ScrollView>
    );
  } else if (activeTab === 'Giỏ hàng') {
    content = <CartLayout includeTabs={false} />;
  } else {
    content = (
      <View style={styles.accountPage}>
        <View style={styles.avatarText}><Text style={styles.avatarLetter}>A</Text></View>
        <Text style={styles.pageHeading}>Tài khoản</Text>
        <Text style={styles.lead}>Nguyễn Văn An</Text>
        <Text style={styles.lead}>an.nguyen@example.com</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.finalContent}>{content}</View>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <BottomTabs active={activeTab} onChange={changeTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, position: 'relative' },
  centeredArea: { flex: 1, justifyContent: 'center', padding: 16 },
  demoFrame: { borderColor: '#d9dce8', borderRadius: 8, borderWidth: 1, overflow: 'hidden' },
  noteBox: { backgroundColor: '#f1f2f8', borderRadius: 7, marginTop: 16, padding: 13 },
  noteTitle: { color: '#303f9f', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  note: { color: '#555b6e', fontSize: 13, lineHeight: 19 },
  paddedTop: { flex: 1, padding: 16 },
  verticalList: { gap: 10, padding: 14, paddingBottom: 24 },
  pageHeading: { color: '#202335', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  lead: { color: '#606574', fontSize: 14, lineHeight: 20, marginBottom: 16 },
  gridPage: { padding: 16 },
  largeCover: { aspectRatio: 3 / 4, width: 220 },
  coverCaption: { color: '#555b6e', fontSize: 13, marginTop: 12, textAlign: 'center' },
  placeholderList: { gap: 10, padding: 16, paddingBottom: 100 },
  placeholderRow: { backgroundColor: '#f1f2f8', borderColor: '#d9dce8', borderRadius: 7, borderWidth: 1, padding: 18 },
  placeholderTitle: { color: '#202335', fontSize: 15, fontWeight: '600' },
  placeholderAuthor: { color: '#6a6f7c', fontSize: 13, marginTop: 4 },
  gridWithCart: { padding: 16, paddingBottom: 100 },
  tabDemoContent: { flex: 1, padding: 20 },
  finalContent: { flex: 1 },
  categoryPage: { gap: 12, padding: 16, paddingBottom: 24 },
  accountPage: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 20 },
  avatarText: { alignItems: 'center', backgroundColor: '#e8eaf6', borderRadius: 38, height: 76, justifyContent: 'center', marginBottom: 16, width: 76 },
  avatarLetter: { color: '#303f9f', fontSize: 28, fontWeight: '700' },
  message: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: 8, textAlign: 'center' },
});
