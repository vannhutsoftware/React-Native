import { Pressable, Text, View } from 'react-native';
import { styles } from './Common';

// Giữ component dùng chung của đề, hiển thị điểm bằng chữ/số theo yêu cầu không icon.
export default function RatingStars({ value, size = 16, onChange, disabled = false }: {
  value: number; size?: number; onChange?: (value: number) => void; disabled?: boolean;
}) {
  if (!onChange) return <Text style={{ fontSize: size }}>Điểm: {value.toFixed(1)}/5</Text>;
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((rating) => (
        <Pressable key={rating} accessibilityRole="radio" accessibilityLabel={`${rating} điểm`}
          accessibilityState={{ checked: value === rating, disabled }} disabled={disabled}
          onPress={() => onChange(rating)}
          style={{ padding: 12, borderWidth: 1, borderColor: '#999', backgroundColor: value === rating ? '#ddd' : '#fff' }}>
          <Text style={{ fontSize: size }}>{rating}</Text>
        </Pressable>
      ))}
    </View>
  );
}
