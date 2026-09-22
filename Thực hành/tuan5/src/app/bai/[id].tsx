import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ExerciseRenderer } from '@/components/ExerciseScreens';
import { ExerciseShell } from '@/components/shared';
import { ALL_EXERCISES } from '@/data/exercises';

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = ALL_EXERCISES.find((item) => item.id === id);

  if (!exercise) {
    return (
      <ExerciseShell title="Không tìm thấy bài">
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Bài tập này không tồn tại.</Text>
        </View>
      </ExerciseShell>
    );
  }

  return (
    <ExerciseShell title={exercise.title}>
      <ExerciseRenderer id={exercise.id} />
    </ExerciseShell>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  emptyText: { color: '#555b6e', fontSize: 16 },
});
