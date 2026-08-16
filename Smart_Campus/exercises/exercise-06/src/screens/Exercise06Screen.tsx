import { useState } from 'react';
import {
  Platform,
  SectionList,
  SectionListRenderItem,
  StyleSheet,
  Switch,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import AnnouncementRow from '../components/AnnouncementRow';
import { Announcement, AnnouncementSection } from '../types/Announcement';

const sections: AnnouncementSection[] = [
  {
    title: 'Hôm nay',
    description: 'Thông báo được đăng trong ngày hôm nay',
    data: [
      {
        id: 'today-midterm-schedule',
        title: 'Lịch thi giữa học kỳ đã được công bố',
        summary: 'Kiểm tra ngày thi, ca thi và phòng thi trong cổng thông tin sinh viên.',
        time: '10 phút trước',
        unread: true,
      },
      {
        id: 'today-hackathon',
        title: 'Mở đăng ký Smart Campus Hackathon',
        summary: 'Cổng đăng ký nhóm sẽ đóng vào 17 giờ thứ Sáu tuần này.',
        time: '35 phút trước',
        unread: true,
      },
      {
        id: 'today-library',
        title: 'Thư viện thay đổi thời gian phục vụ',
        summary: 'Thư viện mở cửa đến 20 giờ trong hai ngày cuối tuần.',
        time: '09:15',
      },
    ],
  },
  {
    title: 'Tuần này',
    description: 'Thông báo được đăng trong bảy ngày gần nhất',
    data: [
      {
        id: 'week-react-native-room',
        title: 'Đổi phòng thực hành môn React Native',
        summary: 'Buổi học chiều thứ Tư chuyển từ phòng 302 sang phòng máy 405.',
        time: 'Thứ Hai',
      },
      {
        id: 'week-club-day',
        title: 'Ngày hội câu lạc bộ sinh viên',
        summary: 'Các gian hàng giới thiệu hoạt động mở tại sân trung tâm từ 8 giờ.',
        time: 'Chủ nhật',
      },
      {
        id: 'week-wifi-maintenance',
        title: 'Bảo trì Wi-Fi khu nhà công nghệ',
        summary: 'Kết nối có thể gián đoạn trong khoảng 22 giờ đến 23 giờ 30.',
        time: 'Thứ Sáu',
      },
      {
        id: 'week-scholarship',
        title: 'Nhận hồ sơ học bổng khuyến khích học tập',
        summary: 'Sinh viên đủ điều kiện nộp hồ sơ trực tuyến trước ngày 30 tháng 8.',
        time: 'Thứ Năm',
      },
    ],
  },
  {
    title: 'Trước đó',
    description: 'Thông báo cũ hơn một tuần',
    data: [
      {
        id: 'earlier-volunteer',
        title: 'Tuyển tình nguyện viên hỗ trợ tân sinh viên',
        summary: 'Đăng ký ca trực tại quầy công tác sinh viên hoặc biểu mẫu trực tuyến.',
        time: '10/08',
      },
      {
        id: 'earlier-sports',
        title: 'Kết quả giải thể thao sinh viên',
        summary: 'Danh sách đội đạt giải đã được đăng trên cổng thông tin khuôn viên.',
        time: '08/08',
      },
      {
        id: 'earlier-parking',
        title: 'Hướng dẫn đăng ký thẻ gửi xe mới',
        summary: 'Mang theo thẻ sinh viên để hoàn tất đăng ký tại phòng hành chính.',
        time: '05/08',
      },
    ],
  },
];

const renderItem: SectionListRenderItem<Announcement, AnnouncementSection> = ({ item }) => (
  <AnnouncementRow announcement={item} />
);

const keyExtractor = (item: Announcement) => item.id;

function ItemSeparator() {
  return <View accessible={false} style={styles.itemSeparator} />;
}

function SectionHeader({ section }: { section: AnnouncementSection }) {
  return (
    <View style={styles.sectionHeaderOuter}>
      <View
        accessibilityLabel={`${section.title}. ${section.description}. ${section.data.length} thông báo`}
        style={styles.sectionHeader}
      >
        <View style={styles.sectionHeadingGroup}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
        <Text style={styles.sectionCount}>{section.data.length}</Text>
      </View>
    </View>
  );
}

export default function Exercise06Screen() {
  const [stickyHeaders, setStickyHeaders] = useState(true);
  const { width, fontScale } = useWindowDimensions();
  const narrow = width < 600;
  const largeText = fontScale >= 1.2;

  const header = (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>SMART CAMPUS · EXERCISE 06</Text>
        <Text style={styles.heading}>Thông báo theo mốc thời gian</Text>
        <Text style={styles.introduction}>
          SectionList nhóm nội dung thành Hôm nay, Tuần này và Trước đó.
        </Text>
      </View>

      <View style={styles.deviceSummary}>
        <Text style={styles.deviceTitle}>Điều kiện kiểm tra</Text>
        <View style={styles.badgeRow}>
          <Text style={styles.deviceBadge}>{narrow ? 'Màn hình hẹp' : 'Màn hình rộng'}</Text>
          <Text style={styles.deviceBadge}>{largeText ? 'Chữ lớn' : `Font scale ${fontScale.toFixed(1)}`}</Text>
        </View>
      </View>

      <View style={styles.stickyControl}>
        <View style={styles.stickyTextGroup}>
          <Text style={styles.stickyTitle}>Sticky section headers</Text>
          <Text style={styles.stickyDescription}>
            {stickyHeaders ? 'Đang bật: tên nhóm được giữ khi cuộn.' : 'Đang tắt: tên nhóm cuộn cùng nội dung.'}
          </Text>
        </View>
        <Switch
          accessibilityLabel="Bật hoặc tắt sticky section headers"
          onValueChange={setStickyHeaders}
          trackColor={{ false: '#CBD5E1', true: '#82AEEF' }}
          thumbColor={stickyHeaders ? '#0B57D0' : '#64748B'}
          value={stickyHeaders}
        />
      </View>

      <View style={styles.conclusionBox}>
        <Text style={styles.conclusionTitle}>Kết luận</Text>
        <Text style={styles.conclusionText}>
          Sticky header hữu ích trên màn hình hẹp và chữ lớn vì luôn giữ ngữ cảnh thời gian. Header cần ngắn và tự tăng chiều cao để không che quá nhiều nội dung.
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SectionList<Announcement, AnnouncementSection>
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={keyExtractor}
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Đã hiển thị toàn bộ thông báo</Text>
            <Text style={styles.footerText}>Các nhóm sử dụng ID ổn định và được ảo hóa bởi SectionList.</Text>
          </View>
        }
        ListHeaderComponent={header}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => <SectionHeader section={section} />}
        sections={sections}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={stickyHeaders}
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
    paddingBottom: 30,
  },
  headerContainer: {
    gap: 14,
    paddingBottom: 10,
    paddingHorizontal: 18,
  },
  header: {
    gap: 7,
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
  deviceSummary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D3DCE9',
    borderRadius: 13,
    borderWidth: 1,
    gap: 9,
    padding: 14,
  },
  deviceTitle: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '800',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  deviceBadge: {
    backgroundColor: '#E7F0FF',
    borderRadius: 999,
    color: '#0B57D0',
    fontSize: 13,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  stickyControl: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D3DCE9',
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 14,
  },
  stickyTextGroup: {
    flex: 1,
    gap: 3,
  },
  stickyTitle: {
    color: '#101828',
    fontSize: 16,
    fontWeight: '800',
  },
  stickyDescription: {
    color: '#526178',
    fontSize: 14,
    lineHeight: 20,
  },
  conclusionBox: {
    backgroundColor: '#E7F7ED',
    borderColor: '#8ACBA0',
    borderRadius: 13,
    borderWidth: 1,
    gap: 5,
    padding: 14,
  },
  conclusionTitle: {
    color: '#176B36',
    fontSize: 16,
    fontWeight: '800',
  },
  conclusionText: {
    color: '#285D3A',
    fontSize: 15,
    lineHeight: 22,
  },
  sectionHeaderOuter: {
    backgroundColor: '#F3F6FA',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  sectionHeader: {
    alignItems: 'center',
    backgroundColor: '#0F4CA3',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeadingGroup: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 25,
  },
  sectionCount: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    color: '#0F4CA3',
    fontSize: 15,
    fontWeight: '800',
    minWidth: 32,
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 5,
    textAlign: 'center',
  },
  itemSeparator: {
    height: 12,
  },
  footer: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 22,
    paddingTop: 20,
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
