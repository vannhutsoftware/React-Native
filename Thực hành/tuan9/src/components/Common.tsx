import type { ReactNode } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: 'bold' },
  heading: { fontSize: 18, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  block: { gap: 8 },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#ddd', gap: 6 },
  input: { borderWidth: 1, borderColor: '#999', padding: 10, fontSize: 16, color: '#111' },
  error: { color: '#b00020' },
  muted: { color: '#555' },
  cover: { width: 100, height: 145, backgroundColor: '#eee' },
  related: { width: 180, padding: 10, borderWidth: 1, borderColor: '#ccc', marginRight: 10, gap: 6 },
});

export function Screen({ children }: { children: ReactNode }) {
  return <SafeAreaView style={styles.screen}>{children}</SafeAreaView>;
}

export function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{title}</Text>
        {children}
      </ScrollView>
    </Screen>
  );
}

export function Action({ title, onPress, disabled = false }: {
  title: string; onPress: () => void; disabled?: boolean;
}) {
  return <Button title={title} onPress={onPress} disabled={disabled} color="#333333" />;
}

export function Field({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  return (
    <View style={styles.block}>
      <Text>{label}</Text>
      <TextInput {...props} accessibilityLabel={label} style={[styles.input, props.style]} />
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    </View>
  );
}

export function money(value: number) { return `${value.toLocaleString('vi-VN')} đ`; }
