import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function ConnectionStatusScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('Chưa kết nối');
  const [lastConnectedTime, setLastConnectedTime] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected) {
      setMessage('Thiết bị đã kết nối');
      setLastConnectedTime(new Date().toLocaleTimeString('vi-VN'));
    } else {
      setMessage('Thiết bị đã ngắt kết nối');
    }
  }, [isConnected]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bài tập thực hành: Theo dõi kết nối</Text>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Trạng thái kết nối:</Text>
        <Switch value={isConnected} onValueChange={setIsConnected} />
      </View>

      {/* Hiển thị thông báo với màu chữ thay đổi theo trạng thái (Xanh khi kết nối, Đỏ khi ngắt kết nối) */}
      <Text style={[styles.message, { color: isConnected ? '#2e7d32' : '#d32f2f' }]}>
        {message}
      </Text>

      {/* Hiển thị thời điểm kết nối gần nhất */}
      {lastConnectedTime && (
        <Text style={styles.timeText}>
          Thời điểm kết nối gần nhất: {lastConnectedTime}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 16,
    color: '#333333',
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
});
