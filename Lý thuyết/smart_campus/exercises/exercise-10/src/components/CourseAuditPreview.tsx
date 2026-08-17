import { Pressable, StyleSheet, Text, View } from 'react-native';

type CourseAuditPreviewProps = {
  fixed: boolean;
  largeText: boolean;
  onAction: (message: string) => void;
};

export function CourseAuditPreview({ fixed, largeText, onAction }: CourseAuditPreviewProps) {
  const title = (
    <Text
      numberOfLines={fixed ? undefined : 1}
      style={[
        styles.courseTitle,
        largeText && styles.largeCourseTitle,
        !fixed && styles.clippedTitle,
      ]}
    >
      Phát triển ứng dụng di động đa nền tảng
    </Text>
  );

  const metadata = (
    <View style={styles.metadata}>
      <Text style={[styles.metaText, !fixed && styles.lowContrastText]}>
        Giảng viên: Nguyễn Minh Anh
      </Text>
      <Text style={[styles.metaText, !fixed && styles.lowContrastText]}>Phòng A5-302</Text>
    </View>
  );

  return (
    <View style={styles.preview}>
      <View style={styles.previewTopRow}>
        <View>
          <Text style={styles.previewEyebrow}>SMART CAMPUS</Text>
          <Text style={styles.previewTitle}>Học phần hiện tại</Text>
        </View>
        <Pressable
          accessibilityLabel={fixed ? 'Mở thông báo' : undefined}
          accessibilityRole={fixed ? 'button' : undefined}
          hitSlop={fixed ? 8 : undefined}
          onPress={() => onAction('Đã mở khu vực thông báo.')}
          style={({ pressed }) => [
            styles.notificationButton,
            fixed ? styles.largeTarget : styles.smallTarget,
            pressed && styles.pressed,
          ]}
        >
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <View style={styles.bellBody} />
            <View style={styles.bellClapper} />
          </View>
        </Pressable>
      </View>

      <View style={styles.courseCard}>
        <Pressable
          accessibilityHint={fixed ? 'Mở chi tiết học phần' : undefined}
          accessibilityLabel={
            fixed
              ? 'Phát triển ứng dụng di động đa nền tảng, giảng viên Nguyễn Minh Anh, phòng A5-302'
              : undefined
          }
          accessibilityRole={fixed ? 'button' : 'text'}
          onPress={() => onAction('Đã mở chi tiết học phần.')}
          style={({ pressed }) => [styles.courseMain, pressed && styles.pressed]}
        >
          {fixed ? (
            <>
              {title}
              {metadata}
            </>
          ) : (
            <>
              {metadata}
              {title}
            </>
          )}
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={fixed ? { selected: true } : undefined}
          onPress={() => onAction('Bộ lọc Đang học đang được chọn.')}
          style={styles.selectedChip}
        >
          <Text style={styles.selectedChipText}>Đang học</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: {
    marginHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 14,
    gap: 12,
  },
  previewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  previewEyebrow: {
    color: '#1559CE',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  previewTitle: {
    color: '#172033',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 2,
  },
  notificationButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: '#E1ECFF',
  },
  smallTarget: {
    width: 32,
    height: 32,
  },
  largeTarget: {
    width: 48,
    height: 48,
  },
  bellBody: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: '#1559CE',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  bellClapper: {
    width: 5,
    height: 3,
    alignSelf: 'center',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: '#1559CE',
  },
  pressed: {
    opacity: 0.72,
  },
  courseCard: {
    borderWidth: 1,
    borderColor: '#CFD9E8',
    borderRadius: 12,
    backgroundColor: '#FBFCFE',
    padding: 13,
    gap: 8,
  },
  courseMain: {
    gap: 8,
  },
  courseTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 23,
    minHeight: 23,
  },
  largeCourseTitle: {
    fontSize: 23,
    lineHeight: 30,
    minHeight: 30,
  },
  clippedTitle: {
    height: 23,
  },
  metadata: {
    gap: 3,
  },
  metaText: {
    color: '#475467',
    fontSize: 13,
    lineHeight: 19,
  },
  lowContrastText: {
    color: '#B1BBC9',
  },
  selectedChip: {
    minHeight: 44,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#DDEAFF',
    paddingHorizontal: 16,
  },
  selectedChipText: {
    color: '#1559CE',
    fontSize: 13,
    fontWeight: '800',
  },
});
