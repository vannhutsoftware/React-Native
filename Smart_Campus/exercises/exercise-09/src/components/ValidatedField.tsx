import type { ComponentProps } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type TextInputProps = ComponentProps<typeof TextInput>;

type ValidatedFieldProps = Pick<
  TextInputProps,
  'autoCapitalize' | 'keyboardType' | 'multiline' | 'textContentType'
> & {
  error?: string;
  label: string;
  maxLengthLabel?: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
};

export function ValidatedField({
  error,
  label,
  maxLengthLabel,
  multiline = false,
  onChangeText,
  placeholder,
  value,
  ...inputProps
}: ValidatedFieldProps) {
  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {maxLengthLabel ? (
          <Text style={[styles.counter, error && styles.errorCounter]}>{maxLengthLabel}</Text>
        ) : null}
      </View>
      <TextInput
        accessibilityLabel={error ? `${label}. Lỗi: ${error}` : label}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8792A5"
        style={[styles.input, multiline && styles.multilineInput, error && styles.inputError]}
        value={value}
        {...inputProps}
      />
      {error ? (
        <Text accessibilityRole="alert" style={styles.errorText}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 5,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 10,
  },
  label: {
    flexShrink: 1,
    color: '#20304A',
    fontSize: 14,
    fontWeight: '800',
  },
  counter: {
    color: '#66758C',
    fontSize: 12,
    fontWeight: '700',
  },
  errorCounter: {
    color: '#B42318',
  },
  input: {
    minHeight: 47,
    borderWidth: 1,
    borderColor: '#C5D0E1',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    color: '#101828',
    fontSize: 15,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  multilineInput: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  inputError: {
    borderWidth: 2,
    borderColor: '#D92D20',
    backgroundColor: '#FFF9F8',
  },
  errorText: {
    color: '#B42318',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
});
