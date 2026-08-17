import { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { FormField } from '../components/FormField';

type DemoMode = 'failure' | 'fixed';

type FormValues = {
  studentId: string;
  fullName: string;
  email: string;
  course: string;
  summary: string;
};

const INITIAL_VALUES: FormValues = {
  studentId: '22110123',
  fullName: 'Nguyễn Văn An',
  email: 'an.nguyen@st.hcmute.edu.vn',
  course: 'Phát triển ứng dụng di động',
  summary: '',
};

type DemoFormProps = {
  values: FormValues;
  onChange: (field: keyof FormValues, value: string) => void;
  onSummaryFocus?: () => void;
  onSubmit: () => void;
};

function DemoForm({ values, onChange, onSubmit, onSummaryFocus }: DemoFormProps) {
  return (
    <View style={styles.form}>
      <FormField
        keyboardType="number-pad"
        label="Mã số sinh viên"
        onChangeText={(value) => onChange('studentId', value)}
        placeholder="Nhập mã số sinh viên"
        returnKeyType="next"
        value={values.studentId}
      />
      <FormField
        autoCapitalize="words"
        label="Họ và tên"
        onChangeText={(value) => onChange('fullName', value)}
        placeholder="Nhập họ và tên"
        returnKeyType="next"
        value={values.fullName}
      />
      <FormField
        autoCapitalize="none"
        keyboardType="email-address"
        label="Email sinh viên"
        onChangeText={(value) => onChange('email', value)}
        placeholder="name@st.hcmute.edu.vn"
        returnKeyType="next"
        textContentType="emailAddress"
        value={values.email}
      />
      <FormField
        label="Học phần"
        onChangeText={(value) => onChange('course', value)}
        placeholder="Nhập tên học phần"
        returnKeyType="next"
        value={values.course}
      />
      <FormField
        label="Nội dung phản hồi (trường cuối)"
        multiline
        onChangeText={(value) => onChange('summary', value)}
        onFocus={onSummaryFocus}
        placeholder="Nhập nội dung cần gửi..."
        value={values.summary}
      />
      <Pressable
        accessibilityRole="button"
        onPress={onSubmit}
        style={({ pressed }) => [styles.submitButton, pressed && styles.submitPressed]}
      >
        <Text style={styles.submitText}>Gửi phản hồi</Text>
      </Pressable>
    </View>
  );
}

export function Exercise08Screen() {
  const [mode, setMode] = useState<DemoMode>('failure');
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [message, setMessage] = useState('Chạm vào trường cuối để tái hiện lỗi.');
  const fixedScrollRef = useRef<ScrollView>(null);

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const selectMode = (nextMode: DemoMode) => {
    Keyboard.dismiss();
    setMode(nextMode);
    setMessage(
      nextMode === 'failure'
        ? 'Chạm vào trường cuối: bàn phím sẽ che nội dung.'
        : 'Chạm vào trường cuối: biểu mẫu sẽ cuộn lên an toàn.',
    );
  };

  const handleSummaryFocus = () => {
    setMessage(
      mode === 'failure'
        ? 'LỖI: trường cuối đang bị bàn phím che.'
        : 'ĐÃ SỬA: trường cuối vẫn nhìn thấy phía trên bàn phím.',
    );

    if (mode === 'fixed') {
      setTimeout(() => fixedScrollRef.current?.scrollToEnd({ animated: true }), 250);
    }
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    setMessage('Đã ghi nhận phản hồi minh họa.');
  };

  const form = (
    <DemoForm
      onChange={updateField}
      onSubmit={handleSubmit}
      onSummaryFocus={handleSummaryFocus}
      values={values}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>SMART CAMPUS · EXERCISE 08</Text>
        <Text style={styles.title}>Keyboard failure</Text>
        <Text style={styles.description}>
          So sánh biểu mẫu bị che và cấu trúc cuộn an toàn.
        </Text>
      </View>

      <View accessibilityRole="tablist" style={styles.modeSelector}>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: mode === 'failure' }}
          onPress={() => selectMode('failure')}
          style={[styles.modeButton, mode === 'failure' && styles.failureButton]}
        >
          <Text style={[styles.modeText, mode === 'failure' && styles.activeModeText]}>
            1. Phiên bản lỗi
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: mode === 'fixed' }}
          onPress={() => selectMode('fixed')}
          style={[styles.modeButton, mode === 'fixed' && styles.fixedButton]}
        >
          <Text style={[styles.modeText, mode === 'fixed' && styles.activeModeText]}>
            2. Đã sửa
          </Text>
        </Pressable>
      </View>

      <View
        accessibilityLiveRegion="polite"
        style={[styles.statusBox, mode === 'fixed' ? styles.fixedStatus : styles.failureStatus]}
      >
        <Text style={styles.statusTitle}>
          {mode === 'failure' ? 'Không có vùng cuộn' : 'KeyboardAvoidingView + ScrollView'}
        </Text>
        <Text style={styles.statusMessage}>{message}</Text>
      </View>

      {mode === 'failure' ? (
        <View style={styles.unsafeViewport}>{form}</View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardSafeArea}
        >
          <ScrollView
            automaticallyAdjustKeyboardInsets
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            ref={fixedScrollRef}
            showsVerticalScrollIndicator
          >
            {form}
            <View style={styles.fixNote}>
              <Text style={styles.fixNoteText}>
                Cấu trúc đã sửa cho phép cuộn đến mọi trường khi bàn phím mở.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F6FB',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
  },
  eyebrow: {
    color: '#1458D6',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  title: {
    color: '#111827',
    fontSize: 27,
    fontWeight: '800',
    marginTop: 3,
  },
  description: {
    color: '#55637A',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 18,
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#E2E8F2',
  },
  modeButton: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    paddingHorizontal: 8,
  },
  failureButton: {
    backgroundColor: '#C53B3B',
  },
  fixedButton: {
    backgroundColor: '#087A55',
  },
  modeText: {
    color: '#48566C',
    fontSize: 14,
    fontWeight: '700',
  },
  activeModeText: {
    color: '#FFFFFF',
  },
  statusBox: {
    marginHorizontal: 18,
    marginTop: 10,
    borderLeftWidth: 4,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  failureStatus: {
    borderLeftColor: '#C53B3B',
    backgroundColor: '#FDECEC',
  },
  fixedStatus: {
    borderLeftColor: '#087A55',
    backgroundColor: '#E7F6EF',
  },
  statusTitle: {
    color: '#172033',
    fontSize: 13,
    fontWeight: '800',
  },
  statusMessage: {
    color: '#536078',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 1,
  },
  unsafeViewport: {
    flex: 1,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  keyboardSafeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 32,
  },
  form: {
    gap: 10,
  },
  submitButton: {
    minHeight: 49,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#1458D6',
    marginTop: 2,
  },
  submitPressed: {
    opacity: 0.78,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  fixNote: {
    marginTop: 12,
    borderRadius: 10,
    backgroundColor: '#DCEBFF',
    padding: 12,
  },
  fixNoteText: {
    color: '#23436F',
    fontSize: 13,
    lineHeight: 19,
  },
});
