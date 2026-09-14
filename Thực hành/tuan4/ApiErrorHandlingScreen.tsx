import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { API_ENDPOINTS, CustomError } from './api';

export default function ApiErrorHandlingScreen() {
  const [targetUrl, setTargetUrl] = useState<string>(API_ENDPOINTS.INVALID_URL);
  const [loading, setLoading] = useState<boolean>(false);
  const [latestError, setLatestError] = useState<CustomError | null>(null);
  const [successData, setSuccessData] = useState<string | null>(null);

  /**
   * Bài tập 12: Bắt lỗi trong khối catch, ép kiểu về CustomError và hiển thị Alert
   */
  const handleMakeRequest = async (urlToCall: string = targetUrl) => {
    setLoading(true);
    setLatestError(null);
    setSuccessData(null);

    try {
      const response = await fetch(urlToCall);

      if (!response.ok) {
        const errorObj = new Error(
          `Yêu cầu API thất bại với mã trạng thái HTTP: ${response.status} (${response.statusText || 'Error'})`
        );
        errorObj.name = `HttpError_${response.status}`;
        (errorObj as unknown as { status: number }).status = response.status;
        throw errorObj;
      }

      const data = await response.json();
      setSuccessData(JSON.stringify(data, null, 2));
      showAlert('Thành công', 'Gọi API thành công! Dữ liệu đã được nạp.');
    } catch (err: unknown) {
      let customErr: CustomError;

      if (err instanceof Error) {
        const status = (err as unknown as { status?: number }).status;
        customErr = {
          name: err.name || 'ApiRequestError',
          message: err.message || 'Đã xảy ra lỗi khi thực hiện cuộc gọi API.',
          status: status,
        };
      } else if (typeof err === 'string') {
        customErr = {
          name: 'StringError',
          message: err,
        };
      } else {
        customErr = {
          name: 'UnknownError',
          message: 'Lỗi không xác định xảy ra trong quá trình xử lý.',
        };
      }

      setLatestError(customErr);

      // Hiển thị thông báo lỗi lên Alert theo yêu cầu
      showAlert(
        `🚨 ${customErr.name}${customErr.status ? ` [${customErr.status}]` : ''}`,
        customErr.message
      );
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message, [{ text: 'Đã hiểu' }]);
    }
  };

  const scenarios = [
    {
      id: '404',
      title: '❌ URL sai (404 Not Found)',
      desc: 'Cố tình gọi endpoint không tồn tại',
      url: API_ENDPOINTS.INVALID_URL,
    },
    {
      id: '500',
      title: '🔥 Giả lập lỗi Server (500)',
      desc: 'Gọi endpoint trả về mã lỗi 500 của httpstat.us',
      url: 'https://httpstat.us/500',
    },
    {
      id: '200',
      title: '✅ URL hợp lệ (200 OK)',
      desc: 'Gọi API chuẩn posts/1 để so sánh',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bài tập 12: Xử lý lỗi API</Text>
        <Text style={styles.headerSubtitle}>
          Bắt lỗi trong catch, ép kiểu CustomError & Hiển thị thông báo Alert
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>1. Nhập hoặc chọn URL để gửi Request:</Text>
        <TextInput
          style={styles.urlInput}
          value={targetUrl}
          onChangeText={setTargetUrl}
          placeholder="https://..."
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
        />

        <Pressable
          disabled={loading}
          style={({ pressed }) => [
            styles.submitBtn,
            loading && styles.btnDisabled,
            pressed && styles.btnPressed,
          ]}
          onPress={() => handleMakeRequest(targetUrl)}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitBtnText}>Gửi API Request (Kích hoạt Test)</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>2. Các kịch bản thử nghiệm lỗi:</Text>
        <View style={styles.scenarioList}>
          {scenarios.map((sc) => (
            <Pressable
              key={sc.id}
              style={({ pressed }) => [
                styles.scenarioItem,
                targetUrl === sc.url && styles.scenarioItemActive,
                pressed && styles.btnPressed,
              ]}
              onPress={() => {
                setTargetUrl(sc.url);
                handleMakeRequest(sc.url);
              }}
            >
              <Text style={styles.scenarioTitle}>{sc.title}</Text>
              <Text style={styles.scenarioDesc}>{sc.desc}</Text>
              <Text style={styles.scenarioUrl} numberOfLines={1}>
                {sc.url}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {latestError && (
        <View style={styles.errorResultCard}>
          <View style={styles.errorHeader}>
            <Text style={styles.errorHeaderTitle}>
              🚨 ĐÃ BẮT VÀ ÉP KIỂU VỀ CustomError
            </Text>
            {latestError.status ? (
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>
                  HTTP {latestError.status}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>error.name:</Text>
            <Text style={styles.fieldValueCode}>{latestError.name}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>error.message:</Text>
            <Text style={styles.fieldValueMessage}>{latestError.message}</Text>
          </View>
        </View>
      )}

      {successData && (
        <View style={styles.successResultCard}>
          <Text style={styles.successTitle}>
            ✅ API Thành Công (Không có lỗi trong catch)
          </Text>
          <Text style={styles.successCode} numberOfLines={6}>
            {successData}
          </Text>
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
  header: {
    backgroundColor: '#991b1b',
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
    color: '#fecaca',
    marginTop: 4,
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 10,
  },
  urlInput: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0f172a',
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnPressed: {
    opacity: 0.8,
  },
  scenarioList: {
    gap: 8,
  },
  scenarioItem: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  scenarioItemActive: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  scenarioTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  scenarioDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  scenarioUrl: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  errorResultCard: {
    backgroundColor: '#fef2f2',
    borderColor: '#f87171',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  errorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#fecaca',
    paddingBottom: 8,
  },
  errorHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991b1b',
  },
  statusBadge: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  fieldRow: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7f1d1d',
    marginBottom: 2,
  },
  fieldValueCode: {
    fontSize: 13,
    fontWeight: '600',
    color: '#b91c1c',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  fieldValueMessage: {
    fontSize: 13,
    color: '#334155',
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fca5a5',
    lineHeight: 18,
  },
  successResultCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 8,
  },
  successCode: {
    fontSize: 12,
    color: '#1e293b',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
