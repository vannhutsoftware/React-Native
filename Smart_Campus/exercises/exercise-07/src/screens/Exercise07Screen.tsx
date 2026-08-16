import { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import CourseCard, { Course } from '../components/CourseCard';

type LayoutMode = 'flex' | 'manual';

const HORIZONTAL_PADDING = 36;
const GRID_GAP = 14;

const courses: Course[] = [
  {
    id: 'mobile-development',
    code: 'MOB401',
    title: 'Phát triển ứng dụng di động',
    lecturer: 'Nguyễn Minh Anh',
    room: 'Phòng 302',
    icon: '▣',
    color: '#0B57D0',
  },
  {
    id: 'interface-design',
    code: 'UXD204',
    title: 'Nguyên lý thiết kế giao diện',
    lecturer: 'Trần Thu Hà',
    room: 'Xưởng 102',
    icon: '◇',
    color: '#7C3AED',
  },
  {
    id: 'software-testing',
    code: 'SWT310',
    title: 'Kiểm thử phần mềm đa nền tảng',
    lecturer: 'Lê Quốc Bảo',
    room: 'Phòng 401',
    icon: '✓',
    color: '#15803D',
  },
  {
    id: 'cloud-fundamentals',
    code: 'CLD220',
    title: 'Điện toán đám mây căn bản',
    lecturer: 'Phạm Gia Huy',
    room: 'Phòng 305',
    icon: '☁',
    color: '#0369A1',
  },
  {
    id: 'data-structures',
    code: 'CSD201',
    title: 'Cấu trúc dữ liệu và giải thuật',
    lecturer: 'Võ Thanh Tùng',
    room: 'Phòng 204',
    icon: '⌘',
    color: '#B45309',
  },
  {
    id: 'project-management',
    code: 'PMG202',
    title: 'Quản lý dự án phần mềm',
    lecturer: 'Đỗ Ngọc Lan',
    room: 'Phòng 203',
    icon: '▦',
    color: '#BE123C',
  },
];

export default function Exercise07Screen() {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('flex');
  const [openedCourse, setOpenedCourse] = useState<string | null>(null);
  const { width, height } = useWindowDimensions();

  const manualColumns = width >= 1000 ? 3 : width >= 640 ? 2 : 1;
  const manualCardWidth =
    (width - HORIZONTAL_PADDING - GRID_GAP * (manualColumns - 1)) / manualColumns;
  const landscape = width > height;

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SMART CAMPUS · EXERCISE 07</Text>
          <Text style={styles.heading}>Phòng thí nghiệm responsive card</Text>
          <Text style={styles.introduction}>
            Xoay thiết bị hoặc đổi chế độ để so sánh grid Flex với phép tính chiều rộng thủ công.
          </Text>
        </View>

        <View style={styles.metricsCard}>
          <View>
            <Text style={styles.metricsLabel}>KÍCH THƯỚC CỬA SỔ</Text>
            <Text style={styles.metricsValue}>{Math.round(width)} × {Math.round(height)} dp</Text>
          </View>
          <Text style={styles.orientationBadge}>{landscape ? 'Ngang' : 'Dọc'}</Text>
        </View>

        <View accessibilityRole="tablist" style={styles.toggleRow}>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: layoutMode === 'flex' }}
            onPress={() => setLayoutMode('flex')}
            style={[styles.toggleButton, layoutMode === 'flex' && styles.toggleButtonActive]}
          >
            <Text style={[styles.toggleText, layoutMode === 'flex' && styles.toggleTextActive]}>Flex responsive</Text>
          </Pressable>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: layoutMode === 'manual' }}
            onPress={() => setLayoutMode('manual')}
            style={[styles.toggleButton, layoutMode === 'manual' && styles.toggleButtonActive]}
          >
            <Text style={[styles.toggleText, layoutMode === 'manual' && styles.toggleTextActive]}>Tính thủ công</Text>
          </Pressable>
        </View>

        {layoutMode === 'flex' ? (
          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>Flex tự quyết định số cột</Text>
            <View style={styles.propertyRow}>
              <Text style={styles.propertyChip}>flexBasis 260</Text>
              <Text style={styles.propertyChip}>minWidth 230</Text>
              <Text style={styles.propertyChip}>maxWidth 420</Text>
              <Text style={styles.propertyChip}>flexGrow 1</Text>
              <Text style={styles.propertyChip}>wrap</Text>
            </View>
          </View>
        ) : (
          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>Cần breakpoint và công thức</Text>
            <Text style={styles.formula}>
              ({Math.round(width)} − {HORIZONTAL_PADDING} − {GRID_GAP} × ({manualColumns} − 1)) ÷ {manualColumns} = {manualCardWidth.toFixed(1)} dp
            </Text>
            <Text style={styles.formulaNote}>{manualColumns} cột được chọn bằng breakpoint viết tay.</Text>
          </View>
        )}

        {openedCourse && (
          <View accessibilityLiveRegion="polite" style={styles.successBanner}>
            <Text style={styles.successText}>✓ Đã mở học phần: {openedCourse}</Text>
          </View>
        )}

        <View style={styles.grid}>
          {courses.map((course) => (
            <CourseCard
              course={course}
              key={course.id}
              onOpen={(selectedCourse) => setOpenedCourse(selectedCourse.title)}
              style={
                layoutMode === 'flex'
                  ? styles.flexCard
                  : { flexGrow: 0, width: manualCardWidth }
              }
            />
          ))}
        </View>

        <View style={styles.comparisonBox}>
          <Text style={styles.comparisonTitle}>So sánh</Text>
          <Text style={styles.comparisonText}>
            Flex tự wrap theo không gian thực và giới hạn độ rộng thẻ. Tính tay cần đồng bộ breakpoint, padding, gap và số cột mỗi khi bố cục thay đổi.
          </Text>
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
    gap: 15,
    paddingBottom: 32,
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
  metricsCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D3DCE9',
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
  },
  metricsLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  metricsValue: {
    color: '#101828',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 3,
  },
  orientationBadge: {
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
    justifyContent: 'center',
    minHeight: 48,
    padding: 10,
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
  explanationCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D3DCE9',
    borderRadius: 13,
    borderWidth: 1,
    gap: 9,
    padding: 14,
  },
  explanationTitle: {
    color: '#101828',
    fontSize: 17,
    fontWeight: '800',
  },
  propertyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  propertyChip: {
    backgroundColor: '#E7F0FF',
    borderRadius: 999,
    color: '#0B57D0',
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  formula: {
    color: '#0B57D0',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
  },
  formulaNote: {
    color: '#526178',
    fontSize: 14,
    lineHeight: 20,
  },
  successBanner: {
    backgroundColor: '#E7F7ED',
    borderColor: '#8ACBA0',
    borderRadius: 11,
    borderWidth: 1,
    padding: 12,
  },
  successText: {
    color: '#176B36',
    fontSize: 15,
    fontWeight: '700',
  },
  grid: {
    alignItems: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  flexCard: {
    flexBasis: 260,
    flexGrow: 1,
    maxWidth: 420,
    minWidth: 230,
  },
  comparisonBox: {
    backgroundColor: '#FFF7E6',
    borderColor: '#F4C46B',
    borderRadius: 13,
    borderWidth: 1,
    gap: 5,
    padding: 14,
  },
  comparisonTitle: {
    color: '#7A4600',
    fontSize: 17,
    fontWeight: '800',
  },
  comparisonText: {
    color: '#664A21',
    fontSize: 15,
    lineHeight: 22,
  },
});
