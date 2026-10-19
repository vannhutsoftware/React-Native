import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAxiosError } from 'axios';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/authService';
import { setSession } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store';
import { validateCredentials } from '../utils/validation';

export default function AuthScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const destination = redirect === '/checkout' || (typeof redirect === 'string' && /^\/books\/[\w-]+$/.test(redirect))
    ? redirect : '/home';
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const errors = validateCredentials({ email, password });
  const title = mode === 'login' ? 'Đăng nhập' : 'Đăng ký';

  function changeMode(nextMode: typeof mode) {
    setMode(nextMode);
    setPassword('');
    setTouched({ email: false, password: false });
    setMessage('');
    setError('');
  }

  async function submit() {
    if (loading) return;
    setTouched({ email: true, password: true });
    setMessage('');
    setError('');
    if (errors.email || errors.password) return;

    setLoading(true);
    const credentials = { email: email.trim().toLowerCase(), password };
    try {
      if (mode === 'register') {
        await authService.register(credentials);
        changeMode('login');
        setMessage('Đăng ký thành công. Vui lòng đăng nhập.');
      } else {
        const session = await authService.login(credentials);
        try {
          await AsyncStorage.setItem('auth', JSON.stringify(session));
        } catch {
          setError('Không thể lưu phiên đăng nhập. Vui lòng thử lại.');
          return;
        }
        dispatch(setSession(session));
        router.replace(destination);
      }
    } catch (err) {
      setError(isAxiosError<{ message: string }>(err)
        ? (err.response?.data?.message ?? 'Không kết nối được máy chủ. Vui lòng thử lại.')
        : 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  if (token) return <Redirect href={destination} />;

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <Text style={styles.heading}>BookStore Online</Text>
          {destination === '/checkout' && <Text style={styles.notice}>Vui lòng đăng nhập để thanh toán.</Text>}
          {destination.startsWith('/books/') && <Text style={styles.notice}>Vui lòng đăng nhập để đánh giá sách.</Text>}
          <View style={styles.tabs}>
            {(['login', 'register'] as const).map((tab) => (
              <Pressable key={tab} accessibilityRole="tab" accessibilityState={{ selected: mode === tab }}
                disabled={loading} onPress={() => changeMode(tab)}
                style={[styles.tab, mode === tab && styles.activeTab]}>
                <Text style={mode === tab ? styles.activeText : undefined}>
                  {tab === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.label}>Email</Text>
          <TextInput accessibilityLabel="Email" style={styles.input} placeholder="Nhập email"
            value={email} editable={!loading} autoCapitalize="none" autoCorrect={false}
            keyboardType="email-address" autoComplete="email"
            onChangeText={setEmail} onBlur={() => setTouched((value) => ({ ...value, email: true }))} />
          {touched.email && !!errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput accessibilityLabel="Mật khẩu" style={styles.input} placeholder="Nhập mật khẩu"
            value={password} editable={!loading} secureTextEntry autoCapitalize="none" autoCorrect={false}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            onChangeText={setPassword} onBlur={() => setTouched((value) => ({ ...value, password: true }))}
            onSubmitEditing={() => void submit()} returnKeyType="done" />
          {touched.password && !!errors.password && <Text style={styles.error}>{errors.password}</Text>}

          {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          {!!message && <Text style={styles.success}>{message}</Text>}
          <Pressable accessibilityRole="button" disabled={loading} onPress={() => void submit()}
            style={[styles.button, loading && styles.disabled]}>
            <Text style={styles.activeText}>{loading ? 'Đang xử lý...' : title}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" disabled={loading} onPress={() => router.replace('/home')} style={styles.back}>
            <Text>Về Home</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, flexGrow: 1, justifyContent: 'center', width: '100%', maxWidth: 440, alignSelf: 'center' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  tabs: { flexDirection: 'row', marginBottom: 24 },
  tab: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#245c99', alignItems: 'center' },
  activeTab: { backgroundColor: '#245c99' },
  activeText: { color: '#fff', fontWeight: '600' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  label: { marginTop: 16, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#999', borderRadius: 4, padding: 12, fontSize: 16 },
  error: { color: '#b42318', marginTop: 6 },
  success: { color: '#26703c', marginTop: 12 },
  button: { backgroundColor: '#245c99', borderRadius: 4, padding: 14, alignItems: 'center', marginTop: 24 },
  disabled: { opacity: 0.6 },
  notice: { marginBottom: 16 },
  back: { padding: 14, alignItems: 'center' },
});
