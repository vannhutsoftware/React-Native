import { useEffect, useState, type PropsWithChildren } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { restoreAuth } from '../services/authStorage';
import type { AppDispatch, RootState } from '../store';
import { clearSession, setSession } from '../store/authSlice';

export default function AuthBootstrap({ children }: PropsWithChildren) {
  const dispatch = useDispatch<AppDispatch>();
  const initialized = useSelector((state: RootState) => state.auth.initialized);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    restoreAuth().then((session) => {
      if (active) dispatch(session ? setSession(session) : clearSession());
    }).catch(() => {
      if (active) setError('Không kiểm tra được phiên đăng nhập. Kiểm tra máy chủ rồi thử lại.');
    });
    return () => { active = false; };
  }, [attempt, dispatch]);

  if (initialized) return children;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{error || 'Đang kiểm tra phiên đăng nhập...'}</Text>
      {!!error && <Button title="Thử lại" onPress={() => { setError(''); setAttempt((value) => value + 1); }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', padding: 24 },
  text: { textAlign: 'center', marginBottom: 16 },
});
