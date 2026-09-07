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

type ProductItemProps = {
  item: Product;
  onSelect: (product: Product) => void;
};

const ProductItem = memo(function ProductItem({ item, onSelect }: ProductItemProps) {
  return (
    <View style={styles.itemContainer}>
      <Button
        title={`${item.name} - ${item.price.toLocaleString('vi-VN')}đ`}
        onPress={() => onSelect(item)}
      />
    </View>
  );
});

export default function ProductScreen() {
  const [keyword, setKeyword] = useState('');
  const [selectedName, setSelectedName] = useState('');

  const products = useMemo(
    () => [
      { id: '1', name: 'Điện thoại', price: 12000000 },
      { id: '2', name: 'Máy tính bảng', price: 9000000 },
      { id: '3', name: 'Tai nghe', price: 1500000 },
    ],
    []
  );

  const filteredProducts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return products.filter(product =>
      product.name.toLowerCase().includes(normalizedKeyword)
    );
  }, [keyword, products]);

  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedName(product.name);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ví dụ áp dụng: Lọc danh sách sản phẩm</Text>

      <TextInput
        value={keyword}
        onChangeText={setKeyword}
        placeholder="Tìm sản phẩm"
        placeholderTextColor="#888"
        style={styles.input}
      />

      <Text style={styles.selectedText}>
        Sản phẩm đã chọn: <Text style={styles.selectedName}>{selectedName || 'Chưa chọn'}</Text>
      </Text>

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductItem item={item} onSelect={handleSelectProduct} />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
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
  selectedText: {
    fontSize: 16,
    color: '#333333',
    marginVertical: 4,
  },
  selectedName: {
    fontWeight: 'bold',
    color: '#0066cc',
  },
  itemContainer: {
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888888',
    marginTop: 16,
  },
});
