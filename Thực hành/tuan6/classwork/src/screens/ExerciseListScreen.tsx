import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../components/Common';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseList'>;

const exercises = [
  {
    number: 'Bài tập 1',
    title: 'Dựng khung điều hướng chính',
    note: '4 tab và luồng Home → Chi tiết sách',
    route: 'MainTabs' as const,
  },
  {
    number: 'Bài tập 2',
    title: 'Điều hướng Giỏ hàng → Thanh toán',
    note: 'Truyền tổng tiền bằng route.params',
    route: 'CartNavigationExercise' as const,
  },
  {
    number: 'Bài tập 3',
    title: 'Thiết lập store giỏ hàng',
    note: 'Thêm, xóa, cập nhật và tính tổng',
    route: 'CartStoreExercise' as const,
  },
  {
    number: 'Bài tập 4',
    title: 'Thiết lập store người dùng',
    note: 'Giao diện thay đổi theo trạng thái đăng nhập',
    route: 'AuthExercise' as const,
  },
  {
    number: 'Thử thách',
    title: 'Store danh sách yêu thích',
    note: 'Thêm và xóa sách khỏi wishlist',
    route: 'WishlistExercise' as const,
  },
];

export function ExerciseListScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>TIẾN ĐỘ TUẦN 6</Text>
        <Text style={styles.title}>Bài thực hành Tuần 5</Text>
        <Text style={styles.subtitle}>Điều hướng & State toàn cục</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {exercises.map((exercise) => (
          <Pressable
            key={exercise.number}
            accessibilityRole="button"
            onPress={() => navigation.navigate(exercise.route)}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.itemPressed,
            ]}
          >
            <Text style={styles.number}>{exercise.number}</Text>
            <Text style={styles.itemTitle}>{exercise.title}</Text>
            <Text style={styles.note}>{exercise.note}</Text>
            <Text style={styles.open}>Nhấn để mở bài</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    backgroundColor: colors.navy,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  eyebrow: {
    color: '#cbd7ee',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    color: colors.white,
    fontSize: 25,
    fontWeight: '700',
    marginTop: 5,
  },
  subtitle: {
    color: colors.white,
    fontSize: 15,
    marginTop: 4,
  },
  list: {
    padding: 14,
  },
  item: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
    padding: 13,
  },
  itemPressed: {
    backgroundColor: colors.paleBlue,
  },
  number: {
    color: colors.blue,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },
  itemTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  note: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 3,
  },
  open: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
});
