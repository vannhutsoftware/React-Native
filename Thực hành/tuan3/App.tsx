import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CartScreen from './CartScreen';
import ConnectionStatusScreen from './ConnectionStatusScreen';
import CounterScreen from './CounterScreen';
import LoginFormScreen from './LoginFormScreen';
import NameFormScreen from './NameFormScreen';
import ProductScreen from './ProductScreen';
import ProductSearchScreen from './ProductSearchScreen';
import ThemeScreen from './ThemeScreen';
import TimerScreen from './TimerScreen';
import TodoAppScreen from './TodoAppScreen';
import UserProfileScreen from './UserProfileScreen';

const exercises = [
  { id: 'counter', hook: 'useState', kind: 'Ví dụ', title: 'Bộ đếm số lượng', component: CounterScreen },
  { id: 'name-form', hook: 'useState', kind: 'Thực hành', title: 'Form nhập họ tên', component: NameFormScreen },
  { id: 'timer', hook: 'useEffect', kind: 'Ví dụ', title: 'Đồng hồ đếm giây', component: TimerScreen },
  {
    id: 'connection',
    hook: 'useEffect',
    kind: 'Thực hành',
    title: 'Theo dõi trạng thái kết nối',
    component: ConnectionStatusScreen,
  },
  { id: 'theme', hook: 'useContext', kind: 'Ví dụ', title: 'Chế độ sáng và tối', component: ThemeScreen },
  {
    id: 'profile',
    hook: 'useContext',
    kind: 'Thực hành',
    title: 'Chia sẻ thông tin người dùng',
    component: UserProfileScreen,
  },
  { id: 'cart', hook: 'useReducer', kind: 'Ví dụ', title: 'Quản lý giỏ hàng', component: CartScreen },
  {
    id: 'login',
    hook: 'useReducer',
    kind: 'Thực hành',
    title: 'Quản lý form đăng nhập',
    component: LoginFormScreen,
  },
  {
    id: 'product-example',
    hook: 'useMemo + useCallback',
    kind: 'Ví dụ',
    title: 'Lọc danh sách sản phẩm',
    component: ProductScreen,
  },
  {
    id: 'product-practice',
    hook: 'useMemo + useCallback',
    kind: 'Thực hành',
    title: 'Tìm kiếm và tính tổng sản phẩm',
    component: ProductSearchScreen,
  },
  {
    id: 'todo',
    hook: 'Tổng hợp',
    kind: 'Cuối chương',
    title: 'Quản lý công việc cá nhân',
    component: TodoAppScreen,
  },
] as const;

type ExerciseId = (typeof exercises)[number]['id'];

export default function App() {
  const [selectedId, setSelectedId] = useState<ExerciseId | null>(null);
  const selectedExercise = exercises.find(exercise => exercise.id === selectedId);

  if (selectedExercise) {
    const ExerciseScreen = selectedExercise.component;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <Pressable style={styles.backButton} onPress={() => setSelectedId(null)}>
          <Text style={styles.backButtonText}>← Danh sách bài tập</Text>
        </Pressable>
        <View style={styles.screenContent}>
          <ExerciseScreen />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Tuần 3 – Hook trong React Native</Text>
        <Text style={styles.subtitle}>
          Chọn một nội dung để xem ví dụ hoặc bài thực hành.
        </Text>

        {exercises.map(exercise => (
          <Pressable
            key={exercise.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => setSelectedId(exercise.id)}
          >
            <View style={styles.badges}>
              <Text style={styles.hookBadge}>{exercise.hook}</Text>
              <Text style={styles.kindBadge}>{exercise.kind}</Text>
            </View>
            <Text style={styles.cardTitle}>{exercise.title}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  heading: {
    color: '#172554',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 12,
  },
  subtitle: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#dbe4f0',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 11,
    padding: 15,
  },
  cardPressed: {
    opacity: 0.7,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  hookBadge: {
    backgroundColor: '#dbeafe',
    borderRadius: 999,
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  kindBadge: {
    backgroundColor: '#ecfdf5',
    borderRadius: 999,
    color: '#047857',
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  cardTitle: {
    color: '#1e293b',
    fontSize: 17,
    fontWeight: '600',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backButton: {
    backgroundColor: '#172554',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  screenContent: {
    flex: 1,
  },
});
