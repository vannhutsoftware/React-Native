import type { ComponentProps } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type TextInputProps = ComponentProps<typeof TextInput>;

type FormFieldProps = Pick<
  TextInputProps,
  | 'autoCapitalize'
  | 'keyboardType'
  | 'multiline'
  | 'onFocus'
  | 'returnKeyType'
  | 'textContentType'
> & {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
};

export function FormField({
  label,
  multiline = false,
  onChangeText,
  placeholder,
  value,
  ...inputProps
}: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8993A4"
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 5,
  },
  label: {
    color: '#25324A',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    minHeight: 47,
    borderWidth: 1,
    borderColor: '#C8D2E2',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    color: '#111827',
    fontSize: 15,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  multilineInput: {
    minHeight: 104,
    textAlignVertical: 'top',
  },
});
