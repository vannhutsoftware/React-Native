import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

export type Course = {
  id: string;
  code: string;
  title: string;
  lecturer: string;
  room: string;
  icon: string;
  color: string;
};

type CourseCardProps = {
  course: Course;
  style?: StyleProp<ViewStyle>;
  onOpen: (course: Course) => void;
};

export default function CourseCard({ course, style, onOpen }: CourseCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={[styles.visual, { backgroundColor: course.color }]}>
        <Text accessible={false} style={styles.icon}>{course.icon}</Text>
        <Text style={styles.code}>{course.code}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.meta}>Giảng viên: {course.lecturer}</Text>
        <Text style={styles.meta}>⌖ {course.room}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => onOpen(course)}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>Xem học phần</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D3DCE9',
    borderRadius: 15,
    borderWidth: 1,
    overflow: 'hidden',
  },
  visual: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 31,
  },
  code: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  body: {
    flex: 1,
    gap: 7,
    padding: 15,
  },
  title: {
    color: '#101828',
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 25,
  },
  meta: {
    color: '#526178',
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0B57D0',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 'auto',
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  buttonPressed: {
    backgroundColor: '#08429F',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
