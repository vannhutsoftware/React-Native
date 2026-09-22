export type ExerciseDefinition = {
  id: string;
  title: string;
  type: 'Bài tập' | 'Thử thách';
};

export type HourDefinition = {
  hour: number;
  topic: string;
  exercises: ExerciseDefinition[];
};

export const HOURS: HourDefinition[] = [
  {
    hour: 1,
    topic: 'Nền tảng Flexbox & Layout đơn giản',
    exercises: [
      { id: '1-1', title: 'Header ứng dụng BookStore', type: 'Bài tập' },
      { id: '1-2', title: 'Thẻ sách (Book Card) đơn', type: 'Bài tập' },
      { id: '1-3', title: 'Thử thách giờ 1', type: 'Thử thách' },
    ],
  },
  {
    hour: 2,
    topic: 'Kích thước, Wrap và Lưới sản phẩm',
    exercises: [
      { id: '2-1', title: 'Danh sách danh mục dạng chip', type: 'Bài tập' },
      { id: '2-2', title: 'Lưới sản phẩm 2 cột', type: 'Bài tập' },
      { id: '2-3', title: 'Thử thách giờ 2', type: 'Thử thách' },
    ],
  },
  {
    hour: 3,
    topic: 'Position, AlignSelf và các lớp phủ',
    exercises: [
      { id: '3-1', title: "Badge giảm giá / Nhãn 'Mới' trên bìa sách", type: 'Bài tập' },
      { id: '3-2', title: 'Nút giỏ hàng nổi', type: 'Bài tập' },
      { id: '3-3', title: 'Thử thách giờ 3', type: 'Thử thách' },
    ],
  },
  {
    hour: 4,
    topic: 'Layout toàn màn hình: ScrollView & SafeAreaView',
    exercises: [
      { id: '4-1', title: 'Màn hình Trang chủ BookStore hoàn chỉnh', type: 'Bài tập' },
      { id: '4-2', title: 'Màn hình Chi tiết sách', type: 'Bài tập' },
    ],
  },
  {
    hour: 5,
    topic: 'Bottom Tab Layout & Hoàn thiện ứng dụng',
    exercises: [
      { id: '5-1', title: 'Thanh Tab Bar dưới cùng (giao diện tĩnh)', type: 'Bài tập' },
      { id: '5-2', title: 'Màn hình Giỏ hàng', type: 'Bài tập' },
      { id: '5-3', title: 'Thử thách Part_01', type: 'Thử thách' },
    ],
  },
];

export const ALL_EXERCISES = HOURS.flatMap((item) => item.exercises);
