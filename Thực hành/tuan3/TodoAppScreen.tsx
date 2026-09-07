import React, {
  useReducer,
  useState,
  useContext,
  useMemo,
  useCallback,
  useEffect,
  memo,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Switch,
  Modal,
} from 'react-native';
import { TodoThemeContext } from './TodoThemeContext';

// Bước 1: Cấu trúc dữ liệu công việc
export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

type Action =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string };

const initialTodos: Todo[] = [
  { id: '1', title: 'Học React Native Hooks', completed: true },
  { id: '2', title: 'Làm bài tập tổng hợp', completed: false },
  { id: '3', title: 'Nộp báo cáo tuần 3', completed: false },
];

// Bước 2: Reducer quản lý các hành động
function todoReducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'ADD_TODO':
      if (!action.payload.trim()) return state;
      return [
        ...state,
        {
          id: Date.now().toString(),
          title: action.payload.trim(),
          completed: false,
        },
      ];

    case 'TOGGLE_TODO':
      return state.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );

    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.payload);

    default:
      return state;
  }
}

// Component con hiển thị từng công việc (tối ưu bằng React.memo)
type TodoItemProps = {
  item: Todo;
  isDarkMode: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

const TodoItem = memo(function TodoItem({
  item,
  isDarkMode,
  onToggle,
  onDelete,
}: TodoItemProps) {
  return (
    <View
      style={[
        styles.todoItem,
        {
          backgroundColor: isDarkMode ? '#2c2c2e' : '#f8f9fa',
          borderColor: isDarkMode ? '#3a3a3c' : '#e9ecef',
        },
      ]}
    >
      <TouchableOpacity
        style={styles.todoTextContainer}
        onPress={() => onToggle(item.id)}
      >
        <Text
          style={[
            styles.checkbox,
            { color: item.completed ? '#2e7d32' : '#8e8e93' },
          ]}
        >
          {item.completed ? '☑' : '☐'}
        </Text>
        <Text
          style={[
            styles.todoTitle,
            {
              color: isDarkMode ? '#ffffff' : '#1c1c1e',
              textDecorationLine: item.completed ? 'line-through' : 'none',
              opacity: item.completed ? 0.6 : 1,
            },
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onDelete(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );
});

// Component nội dung ứng dụng
function TodoAppContent() {
  // Bước 3: useState quản lý ô nhập công việc, từ khóa và id cần xóa để hiển thị Modal
  const [newTitle, setNewTitle] = useState('');
  const [keyword, setKeyword] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Bước 4: useContext lấy chủ đề sáng/tối
  const themeContext = useContext(TodoThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? false;
  const toggleTheme = themeContext?.toggleTheme ?? (() => {});

  // useReducer quản lý danh sách công việc
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);

  // Bước 7: useEffect theo dõi số lượng công việc
  useEffect(() => {
    console.log(`Danh sách hiện có ${todos.length} công việc`);
  }, [todos.length]);

  // Bước 5: useMemo để lọc công việc theo từ khóa
  const filteredTodos = useMemo(() => {
    return todos.filter(todo =>
      todo.title.toLowerCase().includes(keyword.toLowerCase().trim())
    );
  }, [todos, keyword]);

  // Bước 5: useMemo để đếm số công việc chưa hoàn thành
  const uncompletedCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  // Bước 6: useCallback cho các hàm đánh dấu hoàn thành, xóa và thêm
  const handleToggleTodo = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  }, []);

  const handleDeleteTodo = useCallback((id: string) => {
    setDeleteId(id);
  }, []);

  const confirmDelete = () => {
    if (deleteId) {
      dispatch({ type: 'DELETE_TODO', payload: deleteId });
      setDeleteId(null);
    }
  };

  const handleAddTodo = () => {
    if (newTitle.trim()) {
      dispatch({ type: 'ADD_TODO', payload: newTitle });
      setNewTitle('');
    }
  };

  const bgColor = isDarkMode ? '#1c1c1e' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#1c1c1e';
  const inputBg = isDarkMode ? '#2c2c2e' : '#f0f0f2';
  const borderColor = isDarkMode ? '#3a3a3c' : '#cccccc';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header & Nút chuyển giao diện Sáng/Tối */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Quản Lý Công Việc
        </Text>
        <View style={styles.themeToggleRow}>
          <Text style={{ color: textColor, fontSize: 13 }}>
            {isDarkMode ? '🌙 Tối' : '☀️ Sáng'}
          </Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>
      </View>

      {/* Số công việc chưa hoàn thành */}
      <View
        style={[
          styles.statsBox,
          { backgroundColor: isDarkMode ? '#2c2c2e' : '#e3f2fd' },
        ]}
      >
        <Text
          style={[
            styles.statsText,
            { color: isDarkMode ? '#90caf9' : '#0288d1' },
          ]}
        >
          Công việc chưa hoàn thành: {uncompletedCount} / {todos.length}
        </Text>
      </View>

      {/* Form thêm công việc mới */}
      <View style={styles.addForm}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBg, borderColor, color: textColor },
          ]}
          value={newTitle}
          onChangeText={setNewTitle}
          placeholder="Nhập công việc mới..."
          placeholderTextColor="#888888"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <Text style={styles.addButtonText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* Ô tìm kiếm từ khóa */}
      <TextInput
        style={[
          styles.input,
          { backgroundColor: inputBg, borderColor, color: textColor, marginBottom: 12 },
        ]}
        value={keyword}
        onChangeText={setKeyword}
        placeholder="🔍 Tìm kiếm công việc..."
        placeholderTextColor="#888888"
      />

      {/* Danh sách công việc */}
      <FlatList
        data={filteredTodos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            isDarkMode={isDarkMode}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: isDarkMode ? '#aaa' : '#888' }]}>
              {todos.length === 0
                ? 'Chưa có công việc nào. Hãy thêm mới!'
                : 'Không tìm thấy công việc phù hợp.'}
            </Text>
          </View>
        }
      />

      {/* Modal xác nhận xóa */}
      <Modal
        transparent
        animationType="fade"
        visible={deleteId !== null}
        onRequestClose={() => setDeleteId(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalBox,
              { backgroundColor: isDarkMode ? '#2c2c2e' : '#ffffff' },
            ]}
          >
            <Text style={[styles.modalTitle, { color: textColor }]}>
              Xác nhận xóa
            </Text>
            <Text
              style={[
                styles.modalText,
                { color: isDarkMode ? '#cccccc' : '#666666' },
              ]}
            >
              Bạn có chắc chắn muốn xóa công việc này không?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setDeleteId(null)}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.confirmBtn]}
                onPress={confirmDelete}
              >
                <Text style={styles.confirmBtnText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Container chính bọc ThemeContext Provider
export default function TodoAppScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <TodoThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <TodoAppContent />
    </TodoThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  themeToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statsBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  statsText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addForm: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 18,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  todoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  checkbox: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  todoTitle: {
    fontSize: 16,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  emptyText: {
    fontSize: 15,
    fontStyle: 'italic',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#e0e0e0',
  },
  cancelBtnText: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 15,
  },
  confirmBtn: {
    backgroundColor: '#d9534f',
  },
  confirmBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
