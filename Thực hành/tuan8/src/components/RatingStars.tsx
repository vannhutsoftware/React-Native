import { Pressable, StyleSheet, Text, View } from 'react-native';

interface RatingStarsProps {
  value: number;
  size?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export default function RatingStars({ value, size = 20, onChange, disabled }: RatingStarsProps) {
  const rating = Math.max(0, Math.min(5, value));
  const width = size * 1.2;
  const textStyle = { fontSize: size, lineHeight: size * 1.4, width };

  return (
    <View style={styles.row} accessible={!onChange}
      accessibilityLabel={onChange ? undefined : `${rating.toFixed(1)} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.max(0, Math.min(1, rating - star + 1));
        const content = (
          <View style={{ width }}>
            <Text style={[textStyle, styles.empty]}>★</Text>
            <View style={[styles.fill, { width: width * fill }]}>
              <Text style={[textStyle, styles.filled]}>★</Text>
            </View>
          </View>
        );
        return onChange ? (
          <Pressable key={star} accessibilityRole="radio" accessibilityLabel={`${star} sao`}
            accessibilityState={{ checked: rating === star, disabled }} disabled={disabled}
            onPress={() => onChange(star)} style={styles.choice}>
            {content}
          </Pressable>
        ) : <View key={star}>{content}</View>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  empty: { color: '#bbb' },
  filled: { color: '#a76800' },
  fill: { position: 'absolute', left: 0, top: 0, overflow: 'hidden' },
  choice: { paddingVertical: 6, paddingHorizontal: 4 },
});
