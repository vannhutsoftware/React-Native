import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import IconButton from '../components/IconButton';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

export default function Exercise04Screen() {
  const [lastAction, setLastAction] = useState('Chưa có thao tác nào được thực hiện.');

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SMART CAMPUS · EXERCISE 04</Text>
          <Text style={styles.heading}>Hệ thống trạng thái nút bấm</Text>
          <Text style={styles.introduction}>
            Ba loại nút dùng Pressable và giữ nguyên vùng chạm trong mọi trạng thái.
          </Text>
        </View>

        <View accessibilityLiveRegion="polite" style={styles.actionBanner}>
          <Text style={styles.actionLabel}>KẾT QUẢ THAO TÁC</Text>
          <Text style={styles.actionText}>{lastAction}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Vùng chạm an toàn</Text>
          <Text style={styles.infoText}>
            Mọi nút đều giữ chiều cao tối thiểu 52; IconButton giữ cả chiều rộng tối thiểu 52.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PrimaryButton</Text>
          <View style={styles.demoGroup}>
            <Text style={styles.stateName}>NORMAL — bấm để thử</Text>
            <PrimaryButton
              label="Đăng ký học phần"
              onPress={() => setLastAction('Đã đăng ký học phần thành công.')}
            />

            <Text style={styles.stateName}>PRESSED — bản xem trước</Text>
            <PrimaryButton
              label="Trạng thái đang được nhấn"
              onPress={() => setLastAction('PrimaryButton đã nhận thao tác nhấn.')}
              previewPressed
            />

            <Text style={styles.stateName}>LOADING — khóa nhấn lặp</Text>
            <PrimaryButton label="Đang xử lý" loading onPress={() => undefined} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SecondaryButton</Text>
          <View style={styles.demoGroup}>
            <Text style={styles.stateName}>FOCUSED — viền màu cam</Text>
            <SecondaryButton
              label="Lưu vào danh sách học phần"
              onPress={() => setLastAction('Đã lưu học phần vào danh sách.')}
              previewFocused
            />

            <Text style={styles.stateName}>DISABLED — không nhận thao tác</Text>
            <SecondaryButton disabled label="Không thể chỉnh sửa lúc này" onPress={() => undefined} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IconButton</Text>
          <View style={styles.iconRow}>
            <View style={styles.iconDemo}>
              <IconButton
                accessibilityLabel="Mở thông báo"
                icon="♢"
                onPress={() => setLastAction('Đã mở danh sách thông báo.')}
              />
              <Text style={styles.iconCaption}>Normal</Text>
            </View>
            <View style={styles.iconDemo}>
              <IconButton
                accessibilityLabel="Làm mới dữ liệu"
                icon="↻"
                onPress={() => setLastAction('Đã làm mới dữ liệu.')}
                previewPressed
              />
              <Text style={styles.iconCaption}>Pressed</Text>
            </View>
            <View style={styles.iconDemo}>
              <IconButton
                accessibilityLabel="Tùy chọn đang được tập trung"
                icon="⋮"
                onPress={() => setLastAction('Đã mở tùy chọn bổ sung.')}
                previewFocused
              />
              <Text style={styles.iconCaption}>Focused</Text>
            </View>
            <View style={styles.iconDemo}>
              <IconButton
                accessibilityLabel="Xóa đang bị vô hiệu hóa"
                disabled
                icon="×"
                onPress={() => undefined}
              />
              <Text style={styles.iconCaption}>Disabled</Text>
            </View>
            <View style={styles.iconDemo}>
              <IconButton accessibilityLabel="Đang tải" loading icon="" onPress={() => undefined} />
              <Text style={styles.iconCaption}>Loading</Text>
            </View>
          </View>
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
    gap: 16,
    paddingBottom: 34,
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
  actionBanner: {
    backgroundColor: '#E7F0FF',
    borderColor: '#AFC8EF',
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
    marginHorizontal: 18,
    padding: 14,
  },
  actionLabel: {
    color: '#0B57D0',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  actionText: {
    color: '#1E3A5F',
    fontSize: 16,
    lineHeight: 23,
  },
  infoBox: {
    backgroundColor: '#FFF7E6',
    borderColor: '#F4C46B',
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
    marginHorizontal: 18,
    padding: 14,
  },
  infoTitle: {
    color: '#7A4600',
    fontSize: 16,
    fontWeight: '800',
  },
  infoText: {
    color: '#664A21',
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D3DCE9',
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    marginHorizontal: 18,
    padding: 16,
  },
  sectionTitle: {
    color: '#101828',
    fontSize: 22,
    fontWeight: '800',
  },
  demoGroup: {
    gap: 9,
  },
  stateName: {
    color: '#526178',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginTop: 4,
  },
  iconRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  iconDemo: {
    alignItems: 'center',
    gap: 5,
  },
  iconCaption: {
    color: '#526178',
    fontSize: 12,
    fontWeight: '600',
  },
});
