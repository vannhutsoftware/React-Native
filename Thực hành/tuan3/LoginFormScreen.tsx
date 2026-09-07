import React, { useEffect, useReducer, useRef } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';

type State = {
  email: string;
  password: string;
  error: string;
  isSubmitting: boolean;
  successMessage: string;
};

type Action =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: string }
  | { type: 'RESET' };

const initialState: State = {
  email: '',
  password: '',
  error: '',
  isSubmitting: false,
  successMessage: '',
};

function formReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload, error: '', successMessage: '' };

    case 'SET_PASSWORD':
      return { ...state, password: action.payload, error: '', successMessage: '' };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isSubmitting: false, successMessage: '' };

    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload, error: '', successMessage: '' };

    case 'LOGIN_SUCCESS':
      return { ...state, isSubmitting: false, error: '', successMessage: action.payload };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export default function LoginFormScreen() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const loginTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (loginTimerRef.current) {
        clearTimeout(loginTimerRef.current);
      }
    };
  }, []);

  const handleLogin = () => {
    // 1. Kiểm tra rỗng
    if (!state.email.trim() || !state.password) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Vui lòng nhập đầy đủ thông tin',
      });
      return;
    }

    // 2. Câu hỏi mở rộng 1: Kiểm tra email có chứa ký tự @
    if (!state.email.includes('@')) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Email không hợp lệ (phải chứa ký tự @)',
      });
      return;
    }

    // 3. Câu hỏi mở rộng 2: Yêu cầu mật khẩu có ít nhất 6 ký tự
    if (state.password.length < 6) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Mật khẩu phải có ít nhất 6 ký tự',
      });
      return;
    }

    // 4. Câu hỏi mở rộng 3: Thêm trạng thái isSubmitting
    dispatch({ type: 'SET_SUBMITTING', payload: true });

    // Giả lập gửi API đăng nhập sau 1.5 giây
    loginTimerRef.current = setTimeout(() => {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: 'Đăng nhập thành công!',
      });
      loginTimerRef.current = null;
    }, 1500);
  };

  const handleReset = () => {
    if (loginTimerRef.current) {
      clearTimeout(loginTimerRef.current);
      loginTimerRef.current = null;
    }
    dispatch({ type: 'RESET' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bài tập thực hành: Form đăng nhập (useReducer)</Text>

      <TextInput
        style={styles.input}
        value={state.email}
        onChangeText={text => dispatch({ type: 'SET_EMAIL', payload: text })}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        value={state.password}
        onChangeText={text => dispatch({ type: 'SET_PASSWORD', payload: text })}
        placeholder="Mật khẩu"
        placeholderTextColor="#888"
        secureTextEntry
      />

      {state.error ? <Text style={styles.errorText}>{state.error}</Text> : null}
      {state.successMessage ? (
        <Text style={styles.successText}>{state.successMessage}</Text>
      ) : null}

      {state.isSubmitting ? (
        <View style={styles.submittingContainer}>
          <ActivityIndicator size="small" color="#0066cc" />
          <Text style={styles.submittingText}>Đang đăng nhập...</Text>
        </View>
      ) : null}

      <View style={styles.buttonGroup}>
        {!state.isSubmitting ? (
          <Button title="Đăng nhập" onPress={handleLogin} />
        ) : null}
        <Button title="Đặt lại" onPress={handleReset} color="#6c757d" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 14,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#d9534f',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  successText: {
    color: '#2e7d32',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submittingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 10,
  },
  submittingText: {
    fontSize: 16,
    color: '#0066cc',
  },
  buttonGroup: {
    gap: 10,
  },
});
