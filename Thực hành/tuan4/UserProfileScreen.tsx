import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { API_ENDPOINTS, User } from './api';

export default function UserProfileScreen() {
  // Khai báo kiểu User | null theo yêu cầu đề bài
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('1');

  // Hàm gọi API lấy chi tiết user theo ID
  const fetchUserDetails = async (idToFetch: string = userId) => {
    const id = parseInt(idToFetch, 10);
    if (isNaN(id) || id <= 0) {
      setError('Vui lòng nhập ID người dùng hợp lệ (số nguyên > 0).');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_ENDPOINTS.USER_DETAIL(id));

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Không tìm thấy người dùng với ID #${id}`);
        }
        throw new Error(`Lỗi kết nối API: HTTP ${response.status}`);
      }

      const data = await response.json();
      setUser(data as User);
    } catch (err: unknown) {
      setUser(null);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã xảy ra lỗi không xác định.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails('1');
  }, []);

  const handleClearData = () => {
    setUser(null);
    setError(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header thông tin bài tập */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Bài tập 10: Chi tiết người dùng</Text>
        <Text style={styles.headerSubtitle}>
          Khai báo kiểu User | null & Sử dụng Optional Chaining (user?.name)
        </Text>
      </View>

      {/* Thanh điều khiển tải dữ liệu */}
      <View style={styles.controlsCard}>
        <Text style={styles.controlLabel}>Chọn hoặc nhập User ID (1 - 10):</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.idInput}
            keyboardType="numeric"
            value={userId}
            onChangeText={setUserId}
            placeholder="ID"
            maxLength={3}
          />
          <Pressable
            style={({ pressed }) => [styles.fetchBtn, pressed && styles.btnPressed]}
            onPress={() => fetchUserDetails(userId)}
          >
            <Text style={styles.fetchBtnText}>Tải dữ liệu</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.clearBtn, pressed && styles.btnPressed]}
            onPress={handleClearData}
          >
            <Text style={styles.clearBtnText}>Xóa (Set null)</Text>
          </Pressable>
        </View>

        {/* Nút chọn nhanh User ID */}
        <View style={styles.quickSelectRow}>
          <Text style={styles.quickSelectLabel}>Chọn nhanh:</Text>
          {[1, 2, 3, 4, 5].map((id) => (
            <Pressable
              key={id}
              style={[
                styles.quickChip,
                userId === id.toString() && styles.quickChipActive,
              ]}
              onPress={() => {
                setUserId(id.toString());
                fetchUserDetails(id.toString());
              }}
            >
              <Text
                style={[
                  styles.quickChipText,
                  userId === id.toString() && styles.quickChipTextActive,
                ]}
              >
                #{id}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Trạng thái đang tải */}
      {loading && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#0284c7" />
          <Text style={styles.stateText}>Đang gọi API lấy thông tin người dùng...</Text>
        </View>
      )}

      {/* Trạng thái lỗi */}
      {error && !loading && (
        <View style={styles.errorBox}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            style={styles.retryBtn}
            onPress={() => fetchUserDetails(userId)}
          >
            <Text style={styles.retryBtnText}>Thử lại</Text>
          </Pressable>
        </View>
      )}

      {/* Trạng thái chưa có dữ liệu (user === null) */}
      {!loading && !error && user === null && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>👤</Text>
          <Text style={styles.emptyTitle}>Chưa có dữ liệu người dùng (user = null)</Text>
          <Text style={styles.emptyDesc}>
            Màn hình đang ở trạng thái rỗng. Nhấn nút &quot;Tải dữ liệu&quot; ở trên để gọi
            API và đổ dữ liệu vào giao diện.
          </Text>
          <Pressable
            style={styles.loadInitialBtn}
            onPress={() => fetchUserDetails('1')}
          >
            <Text style={styles.loadInitialBtnText}>Nạp dữ liệu User #1 ngay</Text>
          </Pressable>
        </View>
      )}

      {/* Hiển thị thông tin người dùng khi có dữ liệu (sử dụng Optional Chaining) */}
      {!loading && !error && user !== null && (
        <View style={styles.profileContainer}>
          <View style={styles.mainProfileCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
            <Text style={styles.userName}>{user?.name ?? 'Không có tên'}</Text>
            <Text style={styles.userUsername}>@{user?.username ?? 'unknown'}</Text>
            <View style={styles.badgeTag}>
              <Text style={styles.badgeTagText}>ID: #{user?.id}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.cardSectionTitle}>📞 Thông tin liên hệ</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user?.email ?? 'Chưa cập nhật'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Điện thoại:</Text>
              <Text style={styles.infoValue}>{user?.phone ?? 'Chưa cập nhật'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Website:</Text>
              <Text style={[styles.infoValue, styles.linkText]}>
                {user?.website ?? 'Chưa cập nhật'}
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.cardSectionTitle}>📍 Địa chỉ (Address)</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Đường:</Text>
              <Text style={styles.infoValue}>
                {user?.address?.street
                  ? `${user?.address?.street}, ${user?.address?.suite}`
                  : 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Thành phố:</Text>
              <Text style={styles.infoValue}>{user?.address?.city ?? 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã bưu chính:</Text>
              <Text style={styles.infoValue}>{user?.address?.zipcode ?? 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.cardSectionTitle}>🏢 Công ty (Company)</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tên công ty:</Text>
              <Text style={styles.infoValueBold}>{user?.company?.name ?? 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Slogan:</Text>
              <Text style={[styles.infoValue, styles.italicText]}>
                &quot;{user?.company?.catchPhrase ?? 'N/A'}&quot;
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Lĩnh vực:</Text>
              <Text style={styles.infoValue}>{user?.company?.bs ?? 'N/A'}</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#0284c7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#e0f2fe',
    marginTop: 4,
    lineHeight: 18,
  },
  controlsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    marginBottom: 16,
  },
  controlLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  idInput: {
    width: 60,
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    paddingVertical: 8,
    color: '#0f172a',
  },
  fetchBtn: {
    flex: 1,
    backgroundColor: '#0284c7',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  fetchBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  clearBtn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearBtnText: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: 13,
  },
  btnPressed: {
    opacity: 0.75,
  },
  quickSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  quickSelectLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  quickChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickChipActive: {
    backgroundColor: '#e0f2fe',
    borderColor: '#0284c7',
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  quickChipTextActive: {
    color: '#0284c7',
  },
  centerBox: {
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyBox: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 28,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  loadInitialBtn: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loadInitialBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  profileContainer: {
    gap: 14,
  },
  mainProfileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  userUsername: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  badgeTag: {
    marginTop: 8,
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeTagText: {
    color: '#0369a1',
    fontSize: 12,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderColor: '#e2e8f0',
    borderWidth: 1,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    borderBottomColor: '#f1f5f9',
    borderBottomWidth: 1,
    paddingBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    textAlign: 'right',
  },
  infoValueBold: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'right',
  },
  linkText: {
    color: '#0284c7',
    fontWeight: '600',
  },
  italicText: {
    fontStyle: 'italic',
    color: '#475569',
  },
});
