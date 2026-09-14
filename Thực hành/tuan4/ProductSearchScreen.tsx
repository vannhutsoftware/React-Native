import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { API_ENDPOINTS, Product } from './api';

export default function ProductSearchScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [keyword, setKeyword] = useState<string>('phone');
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Bài tập 11: Viết hàm fetchProducts với Type annotations cho tham số
   * @param searchKeyword Từ khóa tìm kiếm (string)
   * @param searchLimit Số lượng sản phẩm tối đa trả về (number)
   */
  const fetchProducts = async (
    searchKeyword: string,
    searchLimit: number
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const url = API_ENDPOINTS.PRODUCTS_SEARCH(searchKeyword.trim(), searchLimit);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Lỗi kết nối API: HTTP ${response.status}`);
      }

      const jsonResult = await response.json();
      const productList = (jsonResult.products ?? []) as Product[];
      setProducts(productList);
      setTotal(jsonResult.total ?? productList.length);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã xảy ra lỗi không xác định khi tìm kiếm sản phẩm.');
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(keyword, limit);
  }, [limit]);

  const handleSearch = () => {
    fetchProducts(keyword, limit);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        {item.thumbnail ? (
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        <View style={styles.cardInfo}>
          <View style={styles.badgeRow}>
            <Text style={styles.categoryBadge}>{item.category || 'General'}</Text>
            {item.brand ? <Text style={styles.brandBadge}>{item.brand}</Text> : null}
          </View>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.productDesc} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>⭐ {item.rating}</Text>
            </View>
            <Text style={styles.stockText}>Kho: {item.stock}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header thông tin bài tập */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bài tập 11: Tìm kiếm sản phẩm</Text>
        <Text style={styles.headerSubtitle}>
          Hàm bất đồng bộ fetchProducts(keyword: string, limit: number)
        </Text>
      </View>

      {/* Thanh tìm kiếm & tùy chọn limit */}
      <View style={styles.filterCard}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Nhập từ khóa (phone, laptop, watch...)"
            placeholderTextColor="#94a3b8"
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <Pressable
            style={({ pressed }) => [styles.searchBtn, pressed && styles.btnPressed]}
            onPress={handleSearch}
          >
            <Text style={styles.searchBtnText}>Tìm</Text>
          </Pressable>
        </View>

        {/* Gợi ý từ khóa nhanh & Giới hạn số lượng (limit) */}
        <View style={styles.optionsRow}>
          <View style={styles.quickTags}>
            <Text style={styles.optionLabel}>Gợi ý:</Text>
            {['phone', 'laptop', 'perfume', 'shoes'].map((tag) => (
              <Pressable
                key={tag}
                style={[
                  styles.tagChip,
                  keyword === tag && styles.tagChipActive,
                ]}
                onPress={() => {
                  setKeyword(tag);
                  fetchProducts(tag, limit);
                }}
              >
                <Text
                  style={[
                    styles.tagText,
                    keyword === tag && styles.tagTextActive,
                  ]}
                >
                  {tag}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Bộ chọn Limit */}
          <View style={styles.limitBox}>
            <Text style={styles.optionLabel}>Limit:</Text>
            {[5, 10, 20].map((l) => (
              <Pressable
                key={l}
                style={[
                  styles.limitChip,
                  limit === l && styles.limitChipActive,
                ]}
                onPress={() => setLimit(l)}
              >
                <Text
                  style={[
                    styles.limitText,
                    limit === l && styles.limitTextActive,
                  ]}
                >
                  {l}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Thanh kết quả */}
      <View style={styles.resultBar}>
        <Text style={styles.resultText}>
          Tìm kiếm: <Text style={styles.boldText}>&quot;{keyword}&quot;</Text> • Số
          lượng hiển thị: <Text style={styles.boldText}>{products.length}</Text>
          {total > 0 ? ` / Tổng ${total}` : ''}
        </Text>
        <Text style={styles.apiEndpointTag}>DummyJSON API</Text>
      </View>

      {/* Danh sách hoặc Trạng thái */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>
            Đang gọi fetchProducts(&apos;{keyword}&apos;, {limit})...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Lỗi tìm kiếm</Text>
          <Text style={styles.errorDesc}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={handleSearch}>
            <Text style={styles.retryBtnText}>Thử lại</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>Không tìm thấy sản phẩm nào</Text>
              <Text style={styles.emptySubtitle}>
                Hãy thử tìm kiếm với từ khóa khác (ví dụ: &quot;phone&quot;, &quot;laptop&quot;)
              </Text>
            </View>
          }
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
    backgroundColor: '#065f46',
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
    color: '#a7f3d0',
    marginTop: 4,
  },
  filterCard: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#0f172a',
  },
  searchBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 18,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  btnPressed: {
    opacity: 0.8,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  quickTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  optionLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  tagChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tagChipActive: {
    backgroundColor: '#d1fae5',
    borderColor: '#059669',
  },
  tagText: {
    fontSize: 12,
    color: '#475569',
  },
  tagTextActive: {
    color: '#065f46',
    fontWeight: '700',
  },
  limitBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  limitChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  limitChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  limitText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  limitTextActive: {
    color: '#ffffff',
  },
  resultBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultText: {
    fontSize: 13,
    color: '#64748b',
  },
  boldText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  apiEndpointTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#047857',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    gap: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  thumbnailPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: 'capitalize',
  },
  brandBadge: {
    backgroundColor: '#fef3c7',
    color: '#b45309',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 20,
  },
  productDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
  },
  ratingBox: {
    backgroundColor: '#fef9c3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#a16207',
  },
  stockText: {
    fontSize: 12,
    color: '#64748b',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#475569',
  },
  errorIcon: {
    fontSize: 36,
    marginBottom: 6,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 4,
  },
  errorDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 14,
  },
  retryBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
