import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function NameFormScreen() {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');

  const parsedAge = parseInt(age, 10);
  const isUnder18 = !isNaN(parsedAge) && parsedAge < 18;

  const handleClear = () => {
    setFullName('');
    setAge('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bài tập thực hành: Form nhập họ tên & tuổi</Text>

      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Nhập họ tên"
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Nhập tuổi"
        keyboardType="numeric"
        placeholderTextColor="#888"
      />

      <Text style={styles.greeting}>
        {fullName ? `Xin chào, ${fullName}!` : 'Vui lòng nhập họ tên'}
      </Text>

      {age ? (
        <Text style={styles.info}>Tuổi của bạn: {age}</Text>
      ) : null}

      {isUnder18 && (
        <Text style={styles.warning}>Cảnh báo: Người dùng chưa đủ 18 tuổi!</Text>
      )}

      <Button title="Xóa toàn bộ dữ liệu" onPress={handleClear} color="#d9534f" />
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  greeting: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333333',
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555555',
  },
  warning: {
    fontSize: 16,
    textAlign: 'center',
    color: '#d9534f',
    fontWeight: 'bold',
  },
});
