import { StyleSheet, Text, View } from 'react-native';

import {
  Button,
  Card,
  colors,
  commonStyles,
  Page,
} from '../components/Common';
import { useAuth } from '../hooks/useAuth';

export function AuthExerciseScreen() {
  const { isLoggedIn, user, token, login, logout } = useAuth();

  return (
    <Page>
      <Text style={commonStyles.screenTitle}>Bài tập 4</Text>
      <Text style={commonStyles.description}>
        Store auth lưu user info, token và isLoggedIn. Dữ liệu giả được dùng để
        kiểm thử trước khi nối API.
      </Text>

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Trạng thái:</Text>
        <View style={[styles.status, isLoggedIn && styles.statusActive]}>
          <Text style={[styles.statusText, isLoggedIn && styles.statusTextActive]}>
            {isLoggedIn ? 'Đã đăng nhập' : 'Chưa đăng nhập'}
          </Text>
        </View>
      </View>

      {isLoggedIn && user ? (
        <Card>
          <Text style={styles.welcome}>Xin chào, {user.name}</Text>
          <Text style={styles.info}>Email: {user.email}</Text>
          <Text style={styles.info}>User ID: {user.id}</Text>
          <Text style={styles.info}>Token: {token}</Text>
          <View style={styles.buttonSpace}>
            <Button label="Đăng xuất" variant="danger" onPress={logout} />
          </View>
        </Card>
      ) : (
        <Card>
          <Text style={styles.welcome}>Tài khoản khách</Text>
          <Text style={styles.info}>
            Vui lòng đăng nhập để xem thông tin cá nhân và lịch sử mua hàng.
          </Text>
          <View style={styles.buttonSpace}>
            <Button label="Đăng nhập bằng dữ liệu giả" onPress={login} />
          </View>
        </Card>
      )}

      <Card style={styles.technicalCard}>
        <Text style={commonStyles.strong}>Giá trị store hiện tại</Text>
        <Text style={styles.info}>isLoggedIn: {String(isLoggedIn)}</Text>
        <Text style={styles.info}>user: {user ? user.name : 'null'}</Text>
        <Text style={styles.info}>token: {token ?? 'null'}</Text>
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 14,
  },
  statusLabel: {
    color: colors.text,
    fontWeight: '600',
    marginRight: 8,
  },
  status: {
    backgroundColor: '#eeeeee',
    borderRadius: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusActive: {
    backgroundColor: colors.paleBlue,
  },
  statusText: {
    color: colors.muted,
    fontSize: 13,
  },
  statusTextActive: {
    color: colors.navy,
    fontWeight: '700',
  },
  welcome: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 8,
  },
  info: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  buttonSpace: {
    marginTop: 14,
  },
  technicalCard: {
    backgroundColor: colors.paleBlue,
  },
});
