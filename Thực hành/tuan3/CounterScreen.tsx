import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function CounterScreen() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Số lượng: {count}</Text>

      <Button
        title="Tăng"
        onPress={() => setCount(previousCount => previousCount + 1)}
      />

      <Button
        title="Giảm"
        onPress={() =>
          setCount(previousCount => Math.max(0, previousCount - 1))
        }
      />

      <Button title="Đặt lại" onPress={() => setCount(0)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
});
