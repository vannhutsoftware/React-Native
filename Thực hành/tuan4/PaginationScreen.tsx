import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { API_ENDPOINTS, Product } from './api';

// Định nghĩa Generic Interface cho API phân trang theo đề bài
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export default function PaginationScreen() {
  const [responseState, setResponseState] = useState<PaginatedResponse<Product> | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm gọi API phân trang sử dụng Generic Interface
  const fetchPaginatedProducts = async (pageIndex: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const skip = (pageIndex - 1) * limit;
      const url = API_ENDPOINTS.PRODUCTS_PAGINATION(skip, limit);
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Lỗi HTTP ${res.status}`);
      }

      const json = await res.json();

      // Đóng gói vào Generic Interface PaginatedResponse<Product>
      const paginatedData: PaginatedResponse<Product> = {
        data: (json.products ?? []) as Product[],
        total: json.total ?? 0,
        page: pageIndex,
        totalPages: Math.ceil((json.total ?? 0) / limit),
      };

      setResponseState(paginatedData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Lỗi không xác định khi tải dữ liệu.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaginatedProducts(page);
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (responseState && page < responseState.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bài tập 14: Phân trang dữ liệu</Text>
        <Text style={styles.headerSubtitle}>
          Generic Interface ApiResponse&lt;T&gt; (PaginatedResponse&lt;Product&gt;)
        </Text>
      </View>

      {/* Thông tin phân trang & Nút chuyển trang */}
      <View style={styles.toolbar}>
        <View style={styles.paginationInfo}>
          <Text style={styles.infoText}>
            Trang: <Text style={styles.boldText}>{page}</Text> /{' '}
            {responseState?.totalPages ?? 1}
          </Text>
          <Text style={styles.infoText}>
            Tổng sản phẩm: <Text style={styles.boldText}>{responseState?.total ?? 0}</Text>
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            disabled={loading || page <= 1}
            style={({ pressed }) => [
              styles.btn,
              (loading || page <= 1) && styles.btnDisabled,
              pressed && styles.btnPressed,
            ]}
            onPress={handlePrevPage}
          >
            <Text style={styles.btnText}>← Trang trước</Text>
          </Pressable>

          <Pressable
            disabled={loading || (responseState ? page >= responseState.totalPages : true)}
            style={({ pressed }) => [
              styles.btn,
              (loading || (responseState ? page >= responseState.totalPages : true)) &&
                styles.btnDisabled,
              pressed && styles.btnPressed,
            ]}
            onPress={handleNextPage}
          >
            <Text style={styles.btnText}>Trang sau →</Text>
          </Pressable>
        </View>
      </View>

      {/* Danh sách sản phẩm của trang hiện tại */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Đang tải dữ liệu trang {page}...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={responseState?.data ?? []}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>#{item.id} - {item.title}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </View>
              <Text style={styles.itemDesc} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.itemFooter}>
                <Text style={styles.itemCategory}>📁 {item.category}</Text>
                <Text style={styles.itemRating}>⭐ {item.rating}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#bae6fd',
    marginTop: 4,
  },
  toolbar: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  paginationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#475569',
  },
  boldText: {
    fontWeight: '700',
    color: '#0f172a',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    backgroundColor: '#0284c7',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#cbd5e1',
  },
  btnPressed: {
    opacity: 0.8,
  },
  btnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  center: {
    padding: 36,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#64748b',
    fontSize: 14,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#059669',
  },
  itemDesc: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
    lineHeight: 18,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCategory: {
    fontSize: 12,
    color: '#0284c7',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  itemRating: {
    fontSize: 12,
    color: '#b45309',
    fontWeight: '700',
  },
});
