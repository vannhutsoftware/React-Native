import { Redirect, useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export default function CheckoutScreen() {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  if (!token || !user) {
    return <Redirect href={{ pathname: '/login', params: { redirect: '/checkout' } }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Checkout - Thanh toán</Text>
      <Text>Tài khoản: {user.email}</Text>
      <Text style={styles.text}>Bạn đã đăng nhập và có thể thanh toán.</Text>
      <View style={styles.action}>
        <Button title="Về Home" onPress={() => router.replace('/home')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  text: { marginTop: 12 },
  action: { marginTop: 20 },
});
