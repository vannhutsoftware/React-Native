import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabType = 'home' | 'notifications' | 'profile' | 'settings';

type StudentProfile = {
  id: string;
  name: string;
  studentCode: string;
  email: string;
  className: string;
  major: string;
  faculty: string;
  cohort: string;
  phone: string;
  dateOfBirth: string;
  gpa: number;
  creditsEarned: number;
};

const initialProfile: StudentProfile = {
  id: 'sv-vovannhut',
  name: 'Võ Văn Nhựt',
  studentCode: '23676661',
  email: 'VoVanNhut@iuh.edu.vn',
  className: 'KTPM',
  major: 'Kỹ thuật phần mềm',
  faculty: 'Khoa Công nghệ thông tin - IUH',
  cohort: 'Khóa 2024 - 2028',
  phone: '0912 345 678',
  dateOfBirth: '15/08/2006',
  gpa: 3.82,
  creditsEarned: 78,
};

const courses = [
  { code: 'IT3010', name: 'Lập trình ứng dụng di động', credits: 3, room: 'A2-304', teacher: 'ThS. Trần Văn Hùng' },
  { code: 'IT3020', name: 'Cấu trúc dữ liệu & Giải thuật', credits: 4, room: 'B1-102', teacher: 'TS. Lê Thị Mai' },
  { code: 'IT3040', name: 'Cơ sở dữ liệu nâng cao', credits: 3, room: 'C3-201', teacher: 'TS. Nguyễn Quốc Bảo' },
];

export default function SmartCampusScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.app}>
        <Header />
        <View style={styles.body}>
          {activeTab === 'profile' ? (
            <ProfileScreen profile={profile} onUpdateProfile={setProfile} />
          ) : (
            <WaitingScreen />
          )}
        </View>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.logoBox}>
        <FontAwesome name="graduation-cap" size={24} color="#fff" />
      </View>
      <View style={styles.headerText}>
        <Text style={styles.headerTitle}>SmartCampus</Text>
        <Text style={styles.headerSubtitle}>Cổng sinh viên IUH</Text>
      </View>
    </View>
  );
}

function WaitingScreen() {
  return (
    <View style={styles.waitingScreen}>
      <FontAwesome name="wrench" size={34} color="#94a3b8" />
      <Text style={styles.waitingTitle}>Đang chờ thiết lập</Text>
    </View>
  );
}

function ProfileScreen({
  profile,
  onUpdateProfile,
}: {
  profile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
}) {
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initials = getInitials(profile.name);
  const filteredCourses = useMemo(() => {
    const key = query.trim().toLowerCase();
    if (!key) return courses;
    return courses.filter((course) =>
      `${course.code} ${course.name} ${course.teacher}`.toLowerCase().includes(key)
    );
  }, [query]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const handleSave = () => {
    setSaveDisabled(true);
    saveTimer.current = setTimeout(() => setSaveDisabled(false), 1200);
  };

  return (
    <>
      <ScreenScroll background="#fff">
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileTitleWrap}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileCode}>Mã SV: {profile.studentCode}</Text>
          </View>
          <Pressable
            accessibilityLabel="Chỉnh sửa hồ sơ"
            onPress={() => setModalVisible(true)}
            style={styles.iconButton}
          >
            <FontAwesome name="pencil" size={16} color="#475569" />
          </Pressable>
        </View>

        <View style={styles.searchBox}>
          <FontAwesome name="search" size={16} color="#94a3b8" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm kiếm thông tin..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
          />
        </View>

        <StudentInfoCard profile={profile} query={query} />

        {query.trim() !== '' && (
          <View style={styles.searchResults}>
            <Text style={styles.resultTitle}>Kết quả tra cứu học phần ({filteredCourses.length})</Text>
            {filteredCourses.map((course) => (
              <View key={course.code} style={styles.courseMiniCard}>
                <Text style={styles.courseName}>{course.name}</Text>
                <Text style={styles.courseMeta}>
                  {course.code} ({course.credits} TC) - {course.teacher} - Phòng {course.room}
                </Text>
              </View>
            ))}
            {filteredCourses.length === 0 && (
              <Text style={styles.emptyText}>Không tìm thấy học phần phù hợp.</Text>
            )}
          </View>
        )}

        <View style={styles.metricGrid}>
          <MetricCard label="Điểm GPA tích lũy" value={profile.gpa.toFixed(2)} suffix="/ 4.0" note="Xếp loại: Giỏi" />
          <MetricCard label="Tín chỉ tích lũy" value={`${profile.creditsEarned}`} suffix="/ 135 TC" note="Tiến độ: 52%" />
        </View>

        <Pressable
          accessibilityLabel="Lưu hồ sơ"
          accessibilityRole="button"
          accessibilityState={{ disabled: saveDisabled }}
          disabled={saveDisabled}
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
            saveDisabled && styles.saveButtonDisabled,
          ]}
        >
          {({ pressed }) => (
            <Text style={[styles.saveButtonText, saveDisabled && styles.saveButtonTextDisabled]}>
              {saveDisabled ? 'VÔ HIỆU' : pressed ? 'ĐANG NHẤN' : 'LƯU HỒ SƠ'}
            </Text>
          )}
        </Pressable>
      </ScreenScroll>

      <EditProfileModal
        visible={modalVisible}
        profile={profile}
        onClose={() => setModalVisible(false)}
        onSave={(updated) => {
          onUpdateProfile(updated);
          setModalVisible(false);
        }}
      />
    </>
  );
}

function EditProfileModal({
  visible,
  profile,
  onClose,
  onSave,
}: {
  visible: boolean;
  profile: StudentProfile;
  onClose: () => void;
  onSave: (profile: StudentProfile) => void;
}) {
  const [form, setForm] = useState<StudentProfile>(profile);

  useEffect(() => {
    if (visible) setForm(profile);
  }, [visible, profile]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chỉnh sửa hồ sơ sinh viên</Text>
            <Pressable accessibilityLabel="Đóng" onPress={onClose} style={styles.modalClose}>
              <FontAwesome name="close" size={18} color="#fff" />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            <FormInput label="Họ và tên sinh viên" value={form.name} onChangeText={(name) => setForm({ ...form, name })} />
            <View style={styles.twoCols}>
              <FormInput label="Mã sinh viên" value={form.studentCode} onChangeText={(studentCode) => setForm({ ...form, studentCode })} />
              <FormInput label="Lớp sinh hoạt" value={form.className} onChangeText={(className) => setForm({ ...form, className })} />
            </View>
            <FormInput label="Email nhà trường" value={form.email} keyboardType="email-address" onChangeText={(email) => setForm({ ...form, email })} />
            <View style={styles.twoCols}>
              <FormInput label="Ngành học" value={form.major} onChangeText={(major) => setForm({ ...form, major })} />
              <FormInput label="Khoa" value={form.faculty} onChangeText={(faculty) => setForm({ ...form, faculty })} />
            </View>
            <View style={styles.twoCols}>
              <FormInput label="Số điện thoại" value={form.phone} keyboardType="phone-pad" onChangeText={(phone) => setForm({ ...form, phone })} />
              <FormInput label="Khóa đào tạo" value={form.cohort} onChangeText={(cohort) => setForm({ ...form, cohort })} />
            </View>
            <View style={styles.modalActions}>
              <Pressable onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Hủy</Text>
              </Pressable>
              <Pressable onPress={() => onSave(form)} style={styles.updateButton}>
                <Text style={styles.updateText}>Cập nhật hồ sơ</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function ScreenScroll({ children, background }: { children: React.ReactNode; background: string }) {
  return (
    <ScrollView style={[styles.scroll, { backgroundColor: background }]} contentContainerStyle={styles.scrollContent}>
      {children}
    </ScrollView>
  );
}

function StudentInfoCard({ profile, query }: { profile: StudentProfile; query: string }) {
  const key = query.trim().toLowerCase();
  const show = (text: string) => !key || text.toLowerCase().includes(key);

  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoTitle}>Thông tin sinh viên</Text>
      {show(profile.email) && <InfoRow label="Email:" value={profile.email} />}
      {show(profile.className) && <InfoRow label="Lớp:" value={profile.className} />}
      {key !== '' && show(profile.major) && <InfoRow label="Ngành:" value={profile.major} />}
      {key !== '' && show(profile.faculty) && <InfoRow label="Khoa:" value={profile.faculty} />}
      {key !== '' && show(profile.phone) && <InfoRow label="SĐT:" value={profile.phone} />}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function MetricCard({ label, value, suffix, note }: { label: string; value: string; suffix: string; note: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricValueRow}>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricSuffix}>{suffix}</Text>
      </View>
      <Text style={styles.metricNote}>{note}</Text>
    </View>
  );
}

function BottomNav({ activeTab, onTabChange }: { activeTab: TabType; onTabChange: (tab: TabType) => void }) {
  const items: Array<{ id: TabType; label: string; icon: React.ComponentProps<typeof FontAwesome>['name'] }> = [
    { id: 'home', label: 'Trang chủ', icon: 'home' },
    { id: 'notifications', label: 'Thông báo', icon: 'bell' },
    { id: 'profile', label: 'Cá nhân', icon: 'user' },
    { id: 'settings', label: 'Cài đặt', icon: 'cog' },
  ];

  return (
    <View style={styles.bottomNav}>
      {items.map((item) => {
        const isActive = item.id === activeTab;
        return (
          <Pressable key={item.id} onPress={() => onTabChange(item.id)} style={styles.navItem}>
            <View style={[styles.navIconWrap, isActive && styles.navIconActive]}>
              <FontAwesome name={item.icon} size={20} color={isActive ? '#005ea6' : '#475569'} />
            </View>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function FormInput({
  label,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={styles.input}
        placeholderTextColor="#94a3b8"
      />
    </View>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase() || 'SV';
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#005ea6' },
  app: { flex: 1, backgroundColor: '#fff' },
  header: {
    minHeight: 72,
    backgroundColor: '#005ea6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  headerText: { flex: 1 },
  headerTitle: { color: '#fff', fontSize: 21, fontWeight: '800' },
  headerSubtitle: { color: '#bfdbfe', fontSize: 12, fontWeight: '600', marginTop: 2 },
  body: { flex: 1, backgroundColor: '#fff' },
  waitingScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: '#f8fafc' },
  waitingTitle: { color: '#475569', fontSize: 18, fontWeight: '800' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 26, gap: 12 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10 },
  avatar: { width: 68, height: 68, borderRadius: 22, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
  avatarText: { color: '#005ea6', fontSize: 23, fontWeight: '900' },
  profileTitleWrap: { flex: 1 },
  profileName: { color: '#0f172a', fontSize: 22, fontWeight: '900' },
  profileCode: { color: '#64748b', marginTop: 4, fontSize: 14, fontWeight: '600' },
  iconButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  searchBox: { height: 48, borderRadius: 14, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 9 },
  searchInput: { flex: 1, color: '#0f172a', fontSize: 14, paddingVertical: 0 },
  infoCard: { backgroundColor: '#f0f6ff', borderColor: '#b9d6fc', borderWidth: 1, borderRadius: 18, padding: 17, gap: 8 },
  infoTitle: { color: '#004f98', fontSize: 16, fontWeight: '900', marginBottom: 3 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  infoLabel: { width: 58, color: '#0f172a', fontWeight: '900', fontSize: 14 },
  infoValue: { flex: 1, color: '#1e293b', fontSize: 14, lineHeight: 20 },
  searchResults: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 14, padding: 14, gap: 9 },
  resultTitle: { color: '#334155', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  courseMiniCard: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', padding: 10, gap: 3 },
  courseName: { color: '#1e293b', fontSize: 13, fontWeight: '800' },
  courseMeta: { color: '#64748b', fontSize: 12, lineHeight: 17 },
  emptyText: { color: '#64748b', fontSize: 12, fontStyle: 'italic' },
  metricGrid: { flexDirection: 'row', gap: 12 },
  metricCard: { flex: 1, backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 14, padding: 13 },
  metricLabel: { color: '#64748b', fontSize: 12, fontWeight: '800' },
  metricValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5, marginTop: 6 },
  metricValue: { color: '#005ea6', fontSize: 24, fontWeight: '900' },
  metricSuffix: { color: '#94a3b8', fontSize: 12 },
  metricNote: { color: '#059669', fontSize: 11, fontWeight: '700', marginTop: 4 },
  saveButton: { minHeight: 52, borderRadius: 14, backgroundColor: '#0b84dd', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  saveButtonPressed: { backgroundColor: '#00568f', transform: [{ scale: 0.99 }] },
  saveButtonDisabled: { backgroundColor: '#d7dee8' },
  saveButtonText: { color: '#fff', fontWeight: '900', fontSize: 15, letterSpacing: 0.4 },
  saveButtonTextDisabled: { color: '#7b8794' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.62)', justifyContent: 'flex-end' },
  modalCard: { maxHeight: '92%', backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, overflow: 'hidden' },
  modalHeader: { backgroundColor: '#005ea6', paddingHorizontal: 18, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  modalClose: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.14)' },
  modalContent: { padding: 16, gap: 12 },
  inputGroup: { flex: 1, gap: 6 },
  inputLabel: { color: '#334155', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  input: { minHeight: 44, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', paddingHorizontal: 12, color: '#0f172a', fontSize: 14, backgroundColor: '#fff' },
  twoCols: { flexDirection: 'row', gap: 10 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, paddingTop: 8 },
  cancelButton: { paddingHorizontal: 16, minHeight: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' },
  cancelText: { color: '#475569', fontWeight: '800' },
  updateButton: { paddingHorizontal: 16, minHeight: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#005ea6' },
  updateText: { color: '#fff', fontWeight: '900' },
  bottomNav: { minHeight: 70, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  navIconWrap: { width: 58, height: 32, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  navIconActive: { backgroundColor: '#d8e6ff' },
  navLabel: { color: '#475569', fontSize: 12 },
  navLabelActive: { color: '#005ea6', fontWeight: '900' },
});
