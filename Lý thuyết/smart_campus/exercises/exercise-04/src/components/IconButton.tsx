import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type IconButtonProps = {
  accessibilityLabel: string;
  icon: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  previewFocused?: boolean;
  previewPressed?: boolean;
};

export default function IconButton({
  accessibilityLabel,
  icon,
  onPress,
  disabled = false,
  loading = false,
  previewFocused = false,
  previewPressed = false,
}: IconButtonProps) {
  const [focused, setFocused] = useState(false);
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: inactive }}
      disabled={inactive}
      focusable={!inactive}
      hitSlop={4}
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
        <ActivityIndicator color="#0B57D0" size="small" />
      ) : (
        <Text accessible={false} style={[styles.icon, disabled && styles.disabledIcon]}>{icon}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#AFC3DF',
    borderRadius: 14,
    borderWidth: 3,
    justifyContent: 'center',
    minHeight: 52,
    minWidth: 52,
    padding: 10,
  },
  pressed: {
    backgroundColor: '#DCE9FF',
    borderColor: '#0B57D0',
  },
  focused: {
    borderColor: '#F59E0B',
  },
  disabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  icon: {
    color: '#0B57D0',
    fontSize: 26,
  },
  disabledIcon: {
    color: '#64748B',
  },
});
