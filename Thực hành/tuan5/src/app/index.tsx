import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HOURS } from '@/data/exercises';

export default function ExerciseListScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Bài tập Flexbox</Text>
        <Text style={styles.subtitle}>Tuần 5 • BookStore Online</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {HOURS.map((item) => (
          <View key={item.hour} style={styles.hourCard}>
            <Text style={styles.hourTitle}>Giờ {item.hour}</Text>
            <Text style={styles.topic}>{item.topic}</Text>

            <View style={styles.exerciseList}>
              {item.exercises.map((exercise, index) => (
                <Pressable
                  accessibilityRole="button"
                  key={exercise.id}
                  onPress={() => router.push(`/bai/${exercise.id}`)}
                  style={({ pressed }) => [styles.exerciseButton, pressed && styles.pressed]}
                >
                  <View style={styles.numberBox}>
                    <Text style={styles.number}>{index + 1}</Text>
                  </View>
                  <View style={styles.exerciseText}>
                    <Text style={styles.type}>{exercise.type}</Text>
                    <Text numberOfLines={2} style={styles.exerciseTitle}>{exercise.title}</Text>
                  </View>
                  <Text style={styles.openText}>Mở</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f4f5f9', flex: 1, maxWidth: '100%', overflow: 'hidden', width: '100%' },
  header: {
    backgroundColor: '#303f9f',
    paddingHorizontal: 20,
    paddingBottom: 18,
    paddingTop: 14,
  },
  title: { color: '#ffffff', fontSize: 25, fontWeight: '700' },
  subtitle: { color: '#dfe3ff', fontSize: 14, marginTop: 4 },
  content: { gap: 14, padding: 16, paddingBottom: 28 },
  hourCard: {
    backgroundColor: '#ffffff',
    borderColor: '#d9dce8',
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  hourTitle: { color: '#303f9f', fontSize: 18, fontWeight: '700' },
  topic: { color: '#555b6e', fontSize: 13, marginBottom: 12, marginTop: 2 },
  exerciseList: { gap: 8 },
  exerciseButton: {
    alignItems: 'center',
    backgroundColor: '#f8f8fc',
    borderColor: '#e1e3ec',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 62,
    padding: 10,
  },
  pressed: { opacity: 0.65 },
  numberBox: {
    alignItems: 'center',
    backgroundColor: '#e8eaf6',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  number: { color: '#303f9f', fontWeight: '700' },
  exerciseText: { flex: 1, marginHorizontal: 10, minWidth: 0 },
  type: { color: '#777b89', fontSize: 11, marginBottom: 2 },
  exerciseTitle: { color: '#202335', flexShrink: 1, fontSize: 14, fontWeight: '600' },
  openText: { color: '#303f9f', flexShrink: 0, fontSize: 13, fontWeight: '600' },
});
