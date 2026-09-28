import { PropsWithChildren } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

export const colors = {
  navy: '#1f3158',
  blue: '#315ea8',
  paleBlue: '#eaf0fa',
  border: '#c8ced8',
  background: '#f5f6f8',
  white: '#ffffff',
  text: '#20242c',
  muted: '#626a78',
  danger: '#a83232',
};

export function Page({ children }: PropsWithChildren) {
  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.pageContent}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

export function SectionTitle({ children }: PropsWithChildren) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function Card({
  children,
  style,
}: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'danger' && styles.dangerButton,
        pressed && !disabled && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === 'secondary' && styles.secondaryButtonText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function Money({ value }: { value: number }) {
  return <Text style={styles.money}>{value.toLocaleString('vi-VN')} đ</Text>;
}

export const commonStyles = StyleSheet.create({
  screenTitle: {
    color: colors.navy,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  strong: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.background,
    flex: 1,
  },
  pageContent: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderColor: colors.navy,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  secondaryButton: {
    backgroundColor: colors.white,
  },
  dangerButton: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: colors.navy,
  },
  money: {
    color: colors.navy,
    fontSize: 16,
    fontWeight: '700',
  },
});
