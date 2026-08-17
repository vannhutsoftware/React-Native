import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import CourseCard, { CourseImageCase } from '../components/CourseCard';

type Course = {
  id: string;
  imageCase: CourseImageCase;
  title: string;
  room: string;
  description: string;
};

const courses: Course[] = [
  {
    id: 'local-image',
    imageCase: 'local',
    title: 'Nhập môn phát triển ứng dụng di động',
    room: 'Phòng thực hành 302',
    description: 'Ảnh được đóng gói trực tiếp trong thư mục assets của dự án.',
  },
  {
    id: 'remote-image',
    imageCase: 'remote',
    title: 'Lập trình giao diện với React Native',
    room: 'Phòng thực hành 305',
    description: 'Ảnh được tải qua mạng và có chỉ báo trong thời gian chờ.',
  },
  {
    id: 'loading-image',
    imageCase: 'loading',
    title: 'Thiết kế trải nghiệm người dùng',
    room: 'Phòng học 204',
    description: 'Thẻ mô phỏng trạng thái ảnh đang tải nhưng tác vụ vẫn sẵn sàng.',
  },
  {
    id: 'failed-image',
    imageCase: 'failed',
    title: 'Kiểm thử ứng dụng đa nền tảng',
    room: 'Phòng thực hành 401',
    description: 'Khi tải ảnh thất bại, vùng dự phòng giải thích rõ tình trạng.',
  },
  {
    id: 'informative-image',
    imageCase: 'informative',
    title: 'Nguyên lý thiết kế giao diện',
    room: 'Xưởng thiết kế 102',
    description: 'Ảnh truyền đạt nội dung nên có tên thay thế dễ hiểu.',
  },
  {
    id: 'decorative-image',
    imageCase: 'decorative',
    title: 'Sinh hoạt học thuật trong khuôn viên',
    room: 'Hội trường trung tâm',
    description: 'Ảnh chỉ dùng để trang trí nên được ẩn khỏi trình đọc màn hình.',
  },
];

export default function Exercise03Screen() {
  const [openedCourse, setOpenedCourse] = useState<string | null>(null);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SMART CAMPUS · EXERCISE 03</Text>
          <Text style={styles.heading}>Khả năng phục hồi của hình ảnh</Text>
          <Text style={styles.introduction}>
            Sáu trường hợp ảnh khác nhau được kiểm tra trên cùng một mẫu thẻ học phần.
          </Text>
        </View>

        {openedCourse && (
          <View accessibilityLiveRegion="polite" style={styles.successBanner}>
            <Text style={styles.successTitle}>✓ Tác vụ đã hoàn thành</Text>
            <Text style={styles.successText}>Đã mở: {openedCourse}</Text>
          </View>
        )}

        <View style={styles.cardList}>
          {courses.map((course) => (
            <CourseCard
              description={course.description}
              imageCase={course.imageCase}
              key={course.id}
              onOpen={setOpenedCourse}
              room={course.room}
              title={course.title}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F3F6FA',
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 28 : 0,
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#D8E0EC',
    borderBottomWidth: 1,
    gap: 7,
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
  successBanner: {
    backgroundColor: '#E6F6EC',
    borderColor: '#87C99C',
    borderRadius: 12,
    borderWidth: 1,
    gap: 3,
    marginHorizontal: 18,
    marginTop: 18,
    padding: 14,
  },
  successTitle: {
    color: '#176B36',
    fontSize: 16,
    fontWeight: '800',
  },
  successText: {
    color: '#285D3A',
    fontSize: 15,
    lineHeight: 21,
  },
  cardList: {
    gap: 18,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
});
