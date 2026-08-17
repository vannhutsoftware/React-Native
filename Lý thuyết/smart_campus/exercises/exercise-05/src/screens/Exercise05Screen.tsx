import { useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import AnnouncementItem from '../components/AnnouncementItem';
import { Announcement } from '../types/Announcement';

const announcements: Announcement[] = [
  {
    id: 'announcement-midterm-2026',
    category: 'Học tập',
    title: 'Lịch thi giữa học kỳ đã được công bố',
    summary: 'Kiểm tra ngày thi, ca thi và phòng thi trong cổng thông tin sinh viên.',
    publishedAt: '10 phút trước',
    unread: true,
  },
  {
    id: 'announcement-hackathon-2026',
    category: 'Sự kiện',
    title: 'Mở đăng ký cuộc thi Smart Campus Hackathon',
    summary: 'Sinh viên có thể đăng ký nhóm từ ba đến năm thành viên trước thứ Sáu.',
    publishedAt: '35 phút trước',
    unread: true,
  },
  {
    id: 'announcement-library-hours',
    category: 'Hệ thống',
    title: 'Thư viện điều chỉnh thời gian phục vụ cuối tuần',
    summary: 'Thư viện mở cửa từ 7 giờ 30 đến 20 giờ vào thứ Bảy và Chủ nhật.',
    publishedAt: 'Hôm nay, 09:15',
    unread: false,
  },
  {
    id: 'announcement-react-native-room',
    category: 'Học tập',
    title: 'Đổi phòng thực hành môn React Native',
    summary: 'Buổi học chiều thứ Tư chuyển từ phòng 302 sang phòng máy 405.',
    publishedAt: 'Hôm qua, 16:40',
    unread: false,
  },
  {
    id: 'announcement-club-day',
    category: 'Sự kiện',
    title: 'Ngày hội câu lạc bộ sinh viên',
    summary: 'Các gian hàng giới thiệu hoạt động sẽ mở tại sân trung tâm từ 8 giờ.',
    publishedAt: 'Hôm qua, 11:20',
    unread: false,
  },
  {
    id: 'announcement-wifi-maintenance',
    category: 'Hệ thống',
    title: 'Bảo trì Wi-Fi tại khu nhà công nghệ',
    summary: 'Kết nối mạng có thể gián đoạn trong khoảng 22 giờ đến 23 giờ 30.',
    publishedAt: '2 ngày trước',
    unread: false,
  },
  {
    id: 'announcement-scholarship',
    category: 'Học tập',
    title: 'Nhận hồ sơ học bổng khuyến khích học tập',
    summary: 'Sinh viên đủ điều kiện nộp hồ sơ trực tuyến trước ngày 30 tháng 8.',
    publishedAt: '3 ngày trước',
    unread: false,
  },
  {
    id: 'announcement-volunteer',
    category: 'Sự kiện',
    title: 'Tuyển tình nguyện viên hỗ trợ tân sinh viên',
    summary: 'Đăng ký ca trực phù hợp tại quầy công tác sinh viên hoặc biểu mẫu trực tuyến.',
    publishedAt: '4 ngày trước',
    unread: false,
  },
];

const keyExtractor = (item: Announcement) => item.id;

const renderItem: ListRenderItem<Announcement> = ({ item }) => (
  <AnnouncementItem announcement={item} />
);

function Separator() {
  return <View accessible={false} style={styles.separator} />;
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text accessible={false} style={styles.emptyIcon}>✓</Text>
      <Text style={styles.emptyTitle}>Không có thông báo mới</Text>
      <Text style={styles.emptyDescription}>
        Khi nhà trường đăng thông tin mới, nội dung sẽ xuất hiện trong danh sách này.
      </Text>
    </View>
  );
}

function ListFooter({ empty }: { empty: boolean }) {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerTitle}>{empty ? 'Danh sách đang trống' : 'Bạn đã xem hết thông báo'}</Text>
      <Text style={styles.footerText}>Dữ liệu sẽ được cập nhật trong lần đồng bộ tiếp theo.</Text>
    </View>
  );
}

export default function Exercise05Screen() {
  const [showEmpty, setShowEmpty] = useState(false);
  const data = showEmpty ? [] : announcements;

  const header = (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>SMART CAMPUS · EXERCISE 05</Text>
        <Text style={styles.heading}>Thông báo trong khuôn viên</Text>
        <Text style={styles.introduction}>
          Danh sách đã được chuyển từ ScrollView và map sang FlatList có kiểu.
        </Text>
      </View>

      <View style={styles.listSummary}>
        <View>
          <Text style={styles.summaryLabel}>TRẠNG THÁI HIỆN TẠI</Text>
          <Text style={styles.summaryValue}>{data.length} thông báo</Text>
        </View>
        <Text style={styles.virtualizedBadge}>FlatList</Text>
      </View>

      <View accessibilityRole="tablist" style={styles.toggleRow}>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: !showEmpty }}
          onPress={() => setShowEmpty(false)}
          style={[styles.toggleButton, !showEmpty && styles.toggleButtonActive]}
        >
          <Text style={[styles.toggleText, !showEmpty && styles.toggleTextActive]}>Có dữ liệu</Text>
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: showEmpty }}
          onPress={() => setShowEmpty(true)}
          style={[styles.toggleButton, showEmpty && styles.toggleButtonActive]}
        >
          <Text style={[styles.toggleText, showEmpty && styles.toggleTextActive]}>Danh sách rỗng</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <FlatList<Announcement>
        contentContainerStyle={styles.listContent}
        data={data}
        ItemSeparatorComponent={Separator}
        keyExtractor={keyExtractor}
        ListEmptyComponent={EmptyState}
        ListFooterComponent={<ListFooter empty={showEmpty} />}
        ListHeaderComponent={header}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F3F6FA',
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 28 : 0,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 30,
    paddingHorizontal: 18,
  },
  headerContainer: {
    gap: 14,
    marginBottom: 18,
  },
  header: {
    gap: 7,
    marginHorizontal: -18,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  eyebrow: {
    color: '#0B57D0',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heading: {
    color: '#0F2749',
    fontSize: 27,
    fontWeight: '800',
    lineHeight: 35,
  },
  introduction: {
    color: '#526178',
    fontSize: 16,
    lineHeight: 23,
  },
  listSummary: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D3DCE9',
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
  },
  summaryLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  summaryValue: {
    color: '#101828',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 3,
  },
  virtualizedBadge: {
    backgroundColor: '#E7F0FF',
    borderRadius: 999,
    color: '#0B57D0',
    fontSize: 14,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  toggleRow: {
    backgroundColor: '#E4EAF2',
    borderRadius: 11,
    flexDirection: 'row',
    gap: 5,
    padding: 5,
  },
  toggleButton: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  toggleButtonActive: {
    backgroundColor: '#0B57D0',
  },
  toggleText: {
    color: '#526178',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  separator: {
    height: 14,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D3DCE9',
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 2,
    gap: 8,
    justifyContent: 'center',
    minHeight: 250,
    padding: 24,
  },
  emptyIcon: {
    color: '#18743A',
    fontSize: 42,
    fontWeight: '800',
  },
  emptyTitle: {
    color: '#101828',
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#526178',
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingTop: 22,
  },
  footerTitle: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  footerText: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
