import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  previewFocused?: boolean;
  previewPressed?: boolean;
};

export default function SecondaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  previewFocused = false,
  previewPressed = false,
}: SecondaryButtonProps) {
  const [focused, setFocused] = useState(false);
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: inactive }}
      disabled={inactive}
      focusable={!inactive}
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        (pressed || previewPressed) && !inactive && styles.pressed,
        (focused || previewFocused) && !inactive && styles.focused,
        inactive && styles.disabled,
      ]}
    >
      {loading && <ActivityIndicator color="#0B57D0" size="small" />}
      <Text style={[styles.label, inactive && styles.disabledLabel]}>
        {loading ? 'Đang lưu dữ liệu...' : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#0B57D0',
    borderRadius: 10,
    borderWidth: 3,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  pressed: {
    backgroundColor: '#DCE9FF',
  },
  focused: {
    borderColor: '#F59E0B',
  },
  disabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  label: {
    color: '#0B57D0',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 23,
    textAlign: 'center',
  },
  disabledLabel: {
    color: '#64748B',
  },
});
