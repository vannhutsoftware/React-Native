import { useState } from 'react';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Action, Field, Page, styles } from '../components/Common';
import { authService } from '../services/authService';
import { useAppDispatch } from '../store';
import { saveSession } from '../store/authSlice';
import { validateCredentials } from '../utils/auth';
import { errorMessage } from '../utils/errors';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const [register, setRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (busy) return;
    const next = { ...validateCredentials(email, password), name: register && !name.trim() ? 'Vui lòng nhập họ tên.' : '' };
    setErrors(next);
    setError('');
    if (next.email || next.password || next.name) return;
    setBusy(true);
    try {
      const session = register ? await authService.register(name, email, password) : await authService.login(email, password);
      await dispatch(saveSession(session)).unwrap();
      setPassword('');
      if (redirect === '/checkout') router.replace('/checkout');
      else if (typeof redirect === 'string' && /^\/books\/\d+$/.test(redirect)) {
        router.replace({ pathname: '/books/[id]', params: { id: redirect.split('/')[2] } });
      } else router.replace('/');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page title={register ? 'Bài 1 - Đăng ký' : 'Bài 1 - Đăng nhập'}>
      <Action title="Về trang chủ" onPress={() => router.replace('/')} disabled={busy} />
      {!!redirect && <Text>Đăng nhập để tiếp tục {redirect === '/checkout' ? 'thanh toán' : 'viết đánh giá'}.</Text>}
      <View style={styles.row}>
        <Action title="Đăng nhập" disabled={busy || !register} onPress={() => { setRegister(false); setError(''); setErrors({ name: '', email: '', password: '' }); }} />
        <Action title="Đăng ký" disabled={busy || register} onPress={() => { setRegister(true); setError(''); setErrors({ name: '', email: '', password: '' }); }} />
      </View>
      {register && <Field label="Họ tên" value={name} onChangeText={setName} error={errors.name} editable={!busy} autoComplete="name" />}
      <Field label="Email" value={email} onChangeText={setEmail} error={errors.email} keyboardType="email-address"
        autoCapitalize="none" autoCorrect={false} autoComplete="email" editable={!busy} />
      <Field label="Mật khẩu" value={password} onChangeText={setPassword} error={errors.password} secureTextEntry
        autoCapitalize="none" autoComplete={register ? 'new-password' : 'current-password'} editable={!busy} />
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <Action title={busy ? 'Đang xử lý...' : register ? 'Tạo tài khoản' : 'Đăng nhập'} disabled={busy} onPress={() => { void submit(); }} />
      <Text style={styles.muted}>Tài khoản mẫu: test@gmail.com / 123456</Text>
    </Page>
  );
}
