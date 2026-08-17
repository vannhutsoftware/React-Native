import { useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';

import { ValidatedField } from '../components/ValidatedField';
import {
  type CopyMode,
  type FormErrors,
  type FormValues,
  SUMMARY_LIMIT,
  validateForm,
} from '../utils/validation';

type TestCase = 'all' | 'spaces' | 'studentId' | 'email' | 'summary' | 'valid';

const VALID_VALUES: FormValues = {
  fullName: 'Nguyễn Văn An',
  studentId: '22110123',
  email: 'an.nguyen@st.hcmute.edu.vn',
  summary: 'Ứng dụng hoạt động tốt trên máy ảo Pixel 7.',
};

const LONG_SUMMARY =
  'Ứng dụng Smart Campus hỗ trợ sinh viên theo dõi học phần, lịch học, thông báo và phản hồi. Nội dung này được cố ý viết dài để kiểm tra giới hạn ký tự của trường tóm tắt trong biểu mẫu.';

const INITIAL_VALUES: FormValues = {
  fullName: '   ',
  studentId: '22A101',
  email: 'an@campus',
  summary: LONG_SUMMARY,
};

const TEST_CASES: Array<{ id: TestCase; label: string }> = [
  { id: 'all', label: 'Cả 4 lỗi' },
  { id: 'spaces', label: 'Tên chỉ có dấu cách' },
  { id: 'studentId', label: 'Mã SV sai' },
  { id: 'email', label: 'Email sai' },
  { id: 'summary', label: 'Tóm tắt dài' },
  { id: 'valid', label: 'Dữ liệu đúng' },
];

function valuesForTest(testCase: TestCase): FormValues {
  switch (testCase) {
    case 'all':
      return INITIAL_VALUES;
    case 'spaces':
      return { ...VALID_VALUES, fullName: '     ' };
    case 'studentId':
      return { ...VALID_VALUES, studentId: '22A101' };
    case 'email':
      return { ...VALID_VALUES, email: 'an@campus' };
    case 'summary':
      return { ...VALID_VALUES, summary: LONG_SUMMARY };
    case 'valid':
      return VALID_VALUES;
  }
}

export function Exercise09Screen() {
  const [mode, setMode] = useState<CopyMode>('actionable');
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>(() =>
    validateForm(INITIAL_VALUES, 'actionable'),
  );
  const [activeTest, setActiveTest] = useState<TestCase>('all');
  const [result, setResult] = useState('Đã phát hiện 4 lỗi. Mỗi thông báo hướng dẫn cách sửa.');

  const validateAndReport = (nextValues: FormValues, copyMode: CopyMode) => {
    const nextErrors = validateForm(nextValues, copyMode);
    const errorCount = Object.keys(nextErrors).length;
    setErrors(nextErrors);
    setResult(
      errorCount === 0
        ? 'Dữ liệu hợp lệ. Biểu mẫu có thể được gửi.'
        : `Đã phát hiện ${errorCount} lỗi. ${
            copyMode === 'vague'
              ? 'Thông báo hiện tại chưa cho biết cách sửa.'
              : 'Mỗi thông báo hướng dẫn cách sửa.'
          }`,
    );
  };

  const selectMode = (nextMode: CopyMode) => {
    setMode(nextMode);
    validateAndReport(values, nextMode);
  };

  const selectTest = (testCase: TestCase) => {
    Keyboard.dismiss();
    const nextValues = valuesForTest(testCase);
    setActiveTest(testCase);
    setValues(nextValues);
    validateAndReport(nextValues, mode);
  };

  const updateField = (field: keyof FormValues, value: string) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    setActiveTest('all');
    validateAndReport(nextValues, mode);
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    validateAndReport(values, mode);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardArea}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.eyebrow}>SMART CAMPUS · EXERCISE 09</Text>
            <Text style={styles.title}>Validation copy</Text>
            <Text style={styles.subtitle}>Thông báo lỗi phải nói rõ vấn đề và cách sửa.</Text>
          </View>

          <View style={styles.modeCard}>
            <Text style={styles.sectionLabel}>So sánh câu chữ</Text>
            <View accessibilityRole="tablist" style={styles.segmentedControl}>
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: mode === 'vague' }}
                onPress={() => selectMode('vague')}
                style={[styles.segment, mode === 'vague' && styles.vagueSegment]}
              >
                <Text style={[styles.segmentText, mode === 'vague' && styles.activeSegmentText]}>
                  Lỗi mơ hồ
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: mode === 'actionable' }}
                onPress={() => selectMode('actionable')}
                style={[styles.segment, mode === 'actionable' && styles.actionableSegment]}
              >
                <Text
                  style={[styles.segmentText, mode === 'actionable' && styles.activeSegmentText]}
                >
                  Lỗi rõ ràng
                </Text>
              </Pressable>
            </View>
            <Text style={styles.comparisonText}>
              {mode === 'vague'
                ? '“Invalid input” không chỉ ra trường sai hoặc cách sửa.'
                : 'Mỗi lỗi nêu điều kiện cần đạt và đưa ví dụ khi cần.'}
            </Text>
          </View>

          <View style={styles.testSection}>
            <Text style={styles.sectionLabel}>Ca kiểm thử nhanh</Text>
            <View style={styles.testButtons}>
              {TEST_CASES.map((testCase) => (
                <Pressable
                  accessibilityRole="button"
                  key={testCase.id}
                  onPress={() => selectTest(testCase.id)}
                  style={[
                    styles.testButton,
                    activeTest === testCase.id && styles.activeTestButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.testButtonText,
                      activeTest === testCase.id && styles.activeTestButtonText,
                    ]}
                  >
                    {testCase.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View
            accessibilityLiveRegion="polite"
            style={[styles.resultBox, Object.keys(errors).length === 0 && styles.successBox]}
          >
            <Text style={styles.resultText}>{result}</Text>
          </View>

          <View style={styles.form}>
            <ValidatedField
              autoCapitalize="words"
              error={errors.fullName}
              label="Họ và tên"
              onChangeText={(value) => updateField('fullName', value)}
              placeholder="Nhập họ và tên"
              value={values.fullName}
            />
            <ValidatedField
              error={errors.studentId}
              keyboardType="number-pad"
              label="Mã sinh viên"
              onChangeText={(value) => updateField('studentId', value)}
              placeholder="Ví dụ: 22110123"
              value={values.studentId}
            />
            <ValidatedField
              autoCapitalize="none"
              error={errors.email}
              keyboardType="email-address"
              label="Email sinh viên"
              onChangeText={(value) => updateField('email', value)}
              placeholder="name@st.hcmute.edu.vn"
              textContentType="emailAddress"
              value={values.email}
            />
            <ValidatedField
              error={errors.summary}
              label="Tóm tắt phản hồi"
              maxLengthLabel={`${values.summary.length}/${SUMMARY_LIMIT}`}
              multiline
              onChangeText={(value) => updateField('summary', value)}
              placeholder="Tối đa 160 ký tự"
              value={values.summary}
            />
            <Pressable
              accessibilityRole="button"
              onPress={handleSubmit}
              style={({ pressed }) => [styles.submitButton, pressed && styles.submitPressed]}
            >
              <Text style={styles.submitText}>Kiểm tra biểu mẫu</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F55C8',
  },
  keyboardArea: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  content: {
    paddingBottom: 36,
  },
  header: {
    backgroundColor: '#0F55C8',
    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 20,
  },
  eyebrow: {
    color: '#D8E7FF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 3,
  },
  subtitle: {
    color: '#E6EFFF',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 3,
  },
  modeCard: {
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    padding: 12,
    gap: 8,
  },
  sectionLabel: {
    color: '#1D2A40',
    fontSize: 14,
    fontWeight: '800',
  },
  segmentedControl: {
    flexDirection: 'row',
    gap: 7,
    borderRadius: 10,
    backgroundColor: '#E8EDF5',
    padding: 4,
  },
  segment: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  vagueSegment: {
    backgroundColor: '#6B7280',
  },
  actionableSegment: {
    backgroundColor: '#087A55',
  },
  segmentText: {
    color: '#526077',
    fontSize: 14,
    fontWeight: '800',
  },
  activeSegmentText: {
    color: '#FFFFFF',
  },
  comparisonText: {
    color: '#5A687E',
    fontSize: 12,
    lineHeight: 17,
  },
  testSection: {
    marginHorizontal: 18,
    marginTop: 13,
    gap: 8,
  },
  testButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  testButton: {
    minHeight: 36,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BCC8DA',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  activeTestButton: {
    borderColor: '#0F55C8',
    backgroundColor: '#DCEAFF',
  },
  testButtonText: {
    color: '#536178',
    fontSize: 12,
    fontWeight: '700',
  },
  activeTestButtonText: {
    color: '#0F55C8',
  },
  resultBox: {
    marginHorizontal: 18,
    marginTop: 13,
    borderLeftWidth: 4,
    borderLeftColor: '#D92D20',
    borderRadius: 9,
    backgroundColor: '#FEECEB',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  successBox: {
    borderLeftColor: '#087A55',
    backgroundColor: '#E5F6EF',
  },
  resultText: {
    color: '#344158',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  form: {
    marginHorizontal: 18,
    marginTop: 14,
    gap: 12,
  },
  submitButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#0F55C8',
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
});
