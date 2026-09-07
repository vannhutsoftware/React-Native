import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';

type Product = {
  id: string;
  name: string;
  price: number;
};

const initialProducts: Product[] = [
  { id: '1', name: 'Áo thun', price: 200000 },
  { id: '2', name: 'Quần jean', price: 450000 },
  { id: '3', name: 'Giày thể thao', price: 800000 },
  { id: '4', name: 'Mũ bảo hiểm', price: 300000 },
  { id: '5', name: 'Balo du lịch', price: 650000 },
];

// Câu hỏi mở rộng 3: Sử dụng React.memo để tối ưu component hiển thị sản phẩm
type ProductListItemProps = {
  item: Product;
  onSelect: (product: Product) => void;
};

const ProductListItem = memo(function ProductListItem({
  item,
  onSelect,
}: ProductListItemProps) {
  return (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price.toLocaleString('vi-VN')}đ</Text>
      </View>
      <Button title="Chọn" onPress={() => onSelect(item)} color="#0066cc" />
    </View>
  );
});

export default function ProductSearchScreen() {
  const [keyword, setKeyword] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
  const [selectedProduct, setSelectedProduct] = useState('');

  // 1. Dùng useMemo để lọc sản phẩm theo từ khóa và mức giá tối đa (Extension 2)
  const filteredProducts = useMemo(() => {
    let result = initialProducts.filter(product =>
      product.name.toLowerCase().includes(keyword.toLowerCase().trim())
    );

    const maxPrice = parseFloat(maxPriceInput);
    if (!isNaN(maxPrice) && maxPrice > 0) {
      result = result.filter(product => product.price <= maxPrice);
    }

    // Extension 1: Sắp xếp theo giá tăng dần hoặc giảm dần
    if (sortOrder === 'asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [keyword, maxPriceInput, sortOrder]);

  // 2. Dùng useMemo để tính tổng giá các sản phẩm đang hiển thị
  const totalPrice = useMemo(() => {
    return filteredProducts.reduce((total, product) => total + product.price, 0);
  }, [filteredProducts]);

  // 3. Dùng useCallback để giữ nguyên tham chiếu hàm chọn sản phẩm
  const handleSelect = useCallback((product: Product) => {
    setSelectedProduct(product.name);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bài tập thực hành: Tìm kiếm & Tính tổng giá</Text>

      {/* Tìm kiếm theo tên */}
      <TextInput
        style={styles.input}
        value={keyword}
        onChangeText={setKeyword}
        placeholder="Tìm theo tên sản phẩm..."
        placeholderTextColor="#888"
      />

      {/* Extension 2: Lọc sản phẩm theo giá tối đa */}
      <TextInput
        style={styles.input}
        value={maxPriceInput}
        onChangeText={setMaxPriceInput}
        placeholder="Lọc theo giá tối đa (VNĐ)..."
        placeholderTextColor="#888"
        keyboardType="numeric"
      />

      {/* Extension 1: Tùy chọn sắp xếp giá */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Giá:</Text>
        <Button
          title="Tăng dần"
          onPress={() => setSortOrder('asc')}
          color={sortOrder === 'asc' ? '#0066cc' : '#6c757d'}
        />
        <Button
          title="Giảm dần"
          onPress={() => setSortOrder('desc')}
          color={sortOrder === 'desc' ? '#0066cc' : '#6c757d'}
        />
        <Button
          title="Mặc định"
          onPress={() => setSortOrder('none')}
          color={sortOrder === 'none' ? '#28a745' : '#6c757d'}
        />
      </View>

      {/* Sản phẩm đã chọn */}
      {selectedProduct ? (
        <Text style={styles.selectedText}>Đã chọn: {selectedProduct}</Text>
      ) : null}

      {/* Danh sách sản phẩm */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductListItem item={item} onSelect={handleSelect} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không tìm thấy sản phẩm phù hợp</Text>
        }
      />

      {/* Hiển thị tổng giá các sản phẩm đang hiển thị */}
      <View style={styles.totalBox}>
        <Text style={styles.totalText}>
          Tổng giá: {totalPrice.toLocaleString('vi-VN')}đ
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  selectedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888888',
    marginTop: 20,
  },
  totalBox: {
    padding: 14,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginTop: 6,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0288d1',
  },
});
