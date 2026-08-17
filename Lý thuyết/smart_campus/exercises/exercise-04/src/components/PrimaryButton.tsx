import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  previewFocused?: boolean;
  previewPressed?: boolean;
};

export default function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  previewFocused = false,
  previewPressed = false,
}: PrimaryButtonProps) {
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
      {loading ? (
        <>
          <ActivityIndicator color="#FFFFFF" size="small" />
          <Text style={styles.label}>Đang xử lý yêu cầu...</Text>
        </>
      ) : (
        <Text style={[styles.label, disabled && styles.disabledLabel]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#0B57D0',
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
    backgroundColor: '#073B91',
    borderColor: '#073B91',
    transform: [{ scale: 0.99 }],
  },
  focused: {
    borderColor: '#F59E0B',
  },
  disabled: {
    backgroundColor: '#CBD5E1',
    borderColor: '#CBD5E1',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 23,
    textAlign: 'center',
  },
  disabledLabel: {
    color: '#526178',
  },
});
