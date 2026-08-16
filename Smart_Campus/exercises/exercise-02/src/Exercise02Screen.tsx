import { StatusBar } from 'expo-status-bar';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

const announcements = [
  {
    id: 'midterm-schedule',
    title: 'Lịch thi giữa học kỳ đã được công bố chính thức',
    description:
      'Vui lòng kiểm tra lịch học được cập nhật để biết đúng ca thi, phòng thi và thời gian có mặt.',
  },
  {
    id: 'hackathon-registration',
    title: 'Đăng ký tham gia cuộc thi sáng tạo công nghệ trong khuôn viên',
    description:
      'Cổng đăng ký sẽ đóng vào thứ Sáu tuần này và đang chào đón tất cả sinh viên kỹ thuật, thiết kế.',
  },
];

const navigationItems = [
  { icon: '▦', label: 'Bảng điều khiển tổng quan', active: true },
  { icon: '◇', label: 'Danh sách học phần của tôi' },
  { icon: '□', label: 'Lịch học và sự kiện sắp tới' },
  { icon: '♙', label: 'Hồ sơ thông tin cá nhân' },
];

export default function Exercise02Screen() {
  const { width } = useWindowDimensions();
  const compact = width < 600;

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View accessible accessibilityLabel="Tài khoản sinh viên" style={styles.headerIcon}>
            <Text style={styles.headerIconText}>♙</Text>
          </View>
          <Text style={styles.headerTitle}>Cổng thông tin Khuôn viên Thông minh</Text>
          <View accessible accessibilityLabel="Thông báo mới" style={styles.headerIcon}>
            <Text style={styles.headerIconText}>♢</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.welcome}>Xin chào, chúc bạn có một ngày học tập hiệu quả!</Text>

          <View style={styles.searchBox}>
            <Text accessible={false} style={styles.searchIcon}>⌕</Text>
            <TextInput
              accessibilityLabel="Tìm kiếm học phần, giảng viên hoặc bạn học"
              multiline
              placeholder="Tìm kiếm học phần, giảng viên hoặc bạn học trong khuôn viên..."
              placeholderTextColor="#526178"
              returnKeyType="search"
              scrollEnabled={false}
              style={styles.searchInput}
            />
          </View>

          <Text style={styles.sectionTitle}>Học phần hiện đang được theo dõi</Text>
          <View style={styles.courseCard}>
            <View style={styles.courseVisual}>
              <Text accessible={false} style={styles.courseVisualIcon}>▧</Text>
              <Text style={styles.courseVisualText}>Không gian hình ảnh minh họa cho học phần</Text>
            </View>
            <View style={styles.courseBody}>
              <Text style={styles.courseTitle}>
                Nhập môn phát triển ứng dụng đa nền tảng bằng React Native
              </Text>
              <Text style={styles.courseMeta}>⌖ Phòng học thực hành số 302, khu nhà công nghệ</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Mở thông tin chi tiết của học phần Nhập môn React Native"
                style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
              >
                <Text style={styles.primaryButtonText}>
                  Xem toàn bộ nội dung và tiến độ của học phần
                </Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Các thông báo mới nhất dành cho sinh viên</Text>
          <View style={styles.announcementList}>
            {announcements.map((announcement, index) => (
              <View
                key={announcement.id}
                style={[
                  styles.announcement,
                  index < announcements.length - 1 && styles.announcementDivider,
                ]}
              >
                <Text style={styles.announcementTitle}>{announcement.title}</Text>
                <Text style={styles.announcementDescription}>{announcement.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.navigation, compact && styles.navigationCompact]}>
          {navigationItems.map((item) => (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: Boolean(item.active) }}
              key={item.label}
              style={({ pressed }) => [
                styles.navigationItem,
                compact && styles.navigationItemCompact,
                pressed && styles.navigationItemPressed,
              ]}
            >
              <Text style={[styles.navigationIcon, item.active && styles.navigationActive]}>
                {item.icon}
              </Text>
              <Text style={[styles.navigationLabel, item.active && styles.navigationActive]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F7FB',
    paddingTop: Platform.OS === 'android' ? 28 : 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#D8E0EC',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerIcon: {
    alignItems: 'center',
    backgroundColor: '#EDF3FC',
    borderRadius: 22,
    justifyContent: 'center',
    padding: 10,
  },
  headerIconText: {
    color: '#164FBA',
    fontSize: 22,
  },
  headerTitle: {
    color: '#123E8C',
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 29,
    textAlign: 'center',
  },
  content: {
    gap: 16,
    paddingHorizontal: 18,
    paddingVertical: 22,
  },
  welcome: {
    color: '#334155',
    fontSize: 18,
    lineHeight: 26,
  },
  searchBox: {
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderColor: '#B8C4D6',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  searchIcon: {
    color: '#31557F',
    fontSize: 25,
    marginRight: 8,
    marginTop: 8,
  },
  searchInput: {
    color: '#152033',
    flex: 1,
    fontSize: 18,
    lineHeight: 25,
    paddingVertical: 8,
  },
  sectionTitle: {
    color: '#101828',
    fontSize: 23,
    fontWeight: '700',
    lineHeight: 31,
    marginTop: 8,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  courseVisual: {
    alignItems: 'center',
    aspectRatio: 2.25,
    backgroundColor: '#DCE8F7',
    justifyContent: 'center',
    padding: 20,
  },
  courseVisualIcon: {
    color: '#31557F',
    fontSize: 46,
  },
  courseVisualText: {
    color: '#31557F',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
    textAlign: 'center',
  },
  courseBody: {
    gap: 12,
    padding: 16,
  },
  courseTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
  },
  courseMeta: {
    color: '#415873',
    fontSize: 18,
    lineHeight: 26,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#0B57D0',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 4,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primaryButtonPressed: {
    backgroundColor: '#08429F',
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 25,
    textAlign: 'center',
  },
  announcementList: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  announcement: {
    gap: 6,
    padding: 16,
  },
  announcementDivider: {
    borderBottomColor: '#D8E0EC',
    borderBottomWidth: 1,
  },
  announcementTitle: {
    color: '#152033',
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 27,
  },
  announcementDescription: {
    color: '#526178',
    fontSize: 17,
    lineHeight: 25,
  },
  navigation: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#D8E0EC',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 6,
    padding: 12,
  },
  navigationCompact: {
    flexWrap: 'wrap',
  },
  navigationItem: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    gap: 4,
    justifyContent: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 10,
  },
  navigationItemCompact: {
    flexBasis: '47%',
  },
  navigationItemPressed: {
    backgroundColor: '#E8F0FE',
  },
  navigationIcon: {
    color: '#526178',
    fontSize: 23,
  },
  navigationLabel: {
    color: '#526178',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
    textAlign: 'center',
  },
  navigationActive: {
    color: '#0B57D0',
  },
});
