import { useState } from 'react';
import {
  AccessibilityInfo,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuditRow } from '../components/AuditRow';
import { CourseAuditPreview } from '../components/CourseAuditPreview';
import { AUDIT_FINDINGS } from '../data/auditFindings';

type AuditMode = 'before' | 'after';

export function Exercise10Screen() {
  const [mode, setMode] = useState<AuditMode>('before');
  const [largeText, setLargeText] = useState(false);
  const [feedback, setFeedback] = useState(
    'Chuyển sang “Sau sửa” để xem các thuộc tính accessibility đã bổ sung.',
  );
  const { fontScale, width } = useWindowDimensions();
  const fixed = mode === 'after';

  const selectMode = (nextMode: AuditMode) => {
    setMode(nextMode);
    const message =
      nextMode === 'after'
        ? 'Sau sửa: đạt 7 trên 7 mục accessibility.'
        : 'Trước sửa: phát hiện 7 vấn đề accessibility.';
    setFeedback(message);
    AccessibilityInfo.announceForAccessibility(message);
  };

  const toggleLargeText = () => {
    const nextValue = !largeText;
    setLargeText(nextValue);
    const message = nextValue
      ? 'Đã bật mô phỏng chữ lớn 135 phần trăm.'
      : 'Đã tắt mô phỏng chữ lớn.';
    setFeedback(message);
    AccessibilityInfo.announceForAccessibility(message);
  };

  const header = (
    <>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>SMART CAMPUS · EXERCISE 10</Text>
        <Text style={styles.title}>Accessibility audit</Text>
        <Text style={styles.subtitle}>Kiểm tra không nhìn: tên, vai trò, trạng thái và thứ tự đọc.</Text>
      </View>

      <View style={styles.controls}>
        <View accessibilityRole="tablist" style={styles.segmentedControl}>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === 'before' }}
            onPress={() => selectMode('before')}
            style={[styles.segment, mode === 'before' && styles.beforeSegment]}
          >
            <Text style={[styles.segmentText, mode === 'before' && styles.activeSegmentText]}>
              Trước sửa · 0/7
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === 'after' }}
            onPress={() => selectMode('after')}
            style={[styles.segment, mode === 'after' && styles.afterSegment]}
          >
            <Text style={[styles.segmentText, mode === 'after' && styles.activeSegmentText]}>
              Sau sửa · 7/7
            </Text>
          </Pressable>
        </View>

        <Pressable
          accessibilityLabel="Mô phỏng chữ lớn 135 phần trăm"
          accessibilityRole="switch"
          accessibilityState={{ checked: largeText }}
          onPress={toggleLargeText}
          style={({ pressed }) => [styles.largeTextControl, pressed && styles.pressed]}
        >
          <View style={[styles.switchTrack, largeText && styles.switchTrackActive]}>
            <View style={[styles.switchThumb, largeText && styles.switchThumbActive]} />
          </View>
          <View style={styles.largeTextCopy}>
            <Text style={styles.largeTextTitle}>Mô phỏng chữ lớn 135%</Text>
            <Text style={styles.metrics}>
              Màn hình {Math.round(width)} dp · fontScale hệ thống {fontScale.toFixed(2)}
            </Text>
          </View>
        </Pressable>
      </View>

      <View
        accessibilityLiveRegion="polite"
        style={[styles.scoreCard, fixed ? styles.passScoreCard : styles.failScoreCard]}
      >
        <Text style={styles.score}>{fixed ? '7/7 mục đạt' : '7 vấn đề cần sửa'}</Text>
        <Text style={styles.feedback}>{feedback}</Text>
      </View>

      <Text accessibilityRole="header" style={styles.sectionTitle}>
        Màn hình được audit
      </Text>
      <CourseAuditPreview fixed={fixed} largeText={largeText} onAction={setFeedback} />

      <Text accessibilityRole="header" style={styles.sectionTitle}>
        Biên bản kiểm tra
      </Text>
    </>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={AUDIT_FINDINGS}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item) => item.id}
        ListFooterComponent={<View style={styles.footerSpace} />}
        ListHeaderComponent={header}
        renderItem={({ item }) => <AuditRow finding={item} fixed={fixed} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#124EB3',
  },
  listContent: {
    backgroundColor: '#F3F6FB',
  },
  header: {
    backgroundColor: '#124EB3',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 20,
  },
  eyebrow: {
    color: '#D6E5FF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 3,
  },
  subtitle: {
    color: '#E4EDFF',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 3,
  },
  controls: {
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    padding: 11,
    gap: 10,
  },
  segmentedControl: {
    flexDirection: 'row',
    gap: 7,
    borderRadius: 10,
    backgroundColor: '#E7ECF4',
    padding: 4,
  },
  segment: {
    flex: 1,
    minHeight: 43,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 6,
  },
  beforeSegment: {
    backgroundColor: '#C4322A',
  },
  afterSegment: {
    backgroundColor: '#087A55',
  },
  segmentText: {
    color: '#536178',
    fontSize: 13,
    fontWeight: '800',
  },
  activeSegmentText: {
    color: '#FFFFFF',
  },
  largeTextControl: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  switchTrack: {
    width: 48,
    height: 28,
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#A9B3C2',
    paddingHorizontal: 3,
  },
  switchTrackActive: {
    backgroundColor: '#087A55',
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  largeTextCopy: {
    flex: 1,
  },
  largeTextTitle: {
    color: '#1C2940',
    fontSize: 14,
    fontWeight: '800',
  },
  metrics: {
    color: '#607087',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.75,
  },
  scoreCard: {
    marginHorizontal: 18,
    marginTop: 12,
    borderLeftWidth: 4,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  failScoreCard: {
    borderLeftColor: '#C4322A',
    backgroundColor: '#FDEDEC',
  },
  passScoreCard: {
    borderLeftColor: '#087A55',
    backgroundColor: '#E4F6EE',
  },
  score: {
    color: '#172033',
    fontSize: 15,
    fontWeight: '900',
  },
  feedback: {
    color: '#536178',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  sectionTitle: {
    color: '#172033',
    fontSize: 18,
    fontWeight: '900',
    marginHorizontal: 18,
    marginTop: 17,
    marginBottom: 9,
  },
  separator: {
    height: 9,
  },
  footerSpace: {
    height: 36,
  },
});
