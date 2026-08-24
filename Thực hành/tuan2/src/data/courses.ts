export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  students: number;
}

export const courses: Course[] = [
  {
    id: 'course-01',
    title: 'React Native cơ bản',
    instructor: 'Nguyễn Minh Anh',
    category: 'Lập trình di động',
    students: 42,
  },
  {
    id: 'course-02',
    title: 'Thiết kế giao diện UI/UX',
    instructor: 'Trần Hoàng Nam',
    category: 'Thiết kế',
    students: 35,
  },
  {
    id: 'course-03',
    title: 'JavaScript nâng cao',
    instructor: 'Lê Thu Hà',
    category: 'Lập trình web',
    students: 58,
  },
  {
    id: 'course-04',
    title: 'Cơ sở dữ liệu',
    instructor: 'Phạm Quang Huy',
    category: 'Khoa học máy tính',
    students: 47,
  },
  {
    id: 'course-05',
    title: 'Lập trình ứng dụng với Expo',
    instructor: 'Nguyễn Minh Anh',
    category: 'Lập trình di động',
    students: 30,
  },
  {
    id: 'course-06',
    title: 'TypeScript thực hành',
    instructor: 'Võ Thanh Tùng',
    category: 'Lập trình web',
    students: 51,
  },
  {
    id: 'course-07',
    title: 'Thiết kế giao diện với Figma',
    instructor: 'Đỗ Ngọc Mai',
    category: 'Thiết kế',
    students: 28,
  },
  {
    id: 'course-08',
    title: 'Cấu trúc dữ liệu và giải thuật',
    instructor: 'Phan Đức Long',
    category: 'Khoa học máy tính',
    students: 63,
  },
  {
    id: 'course-09',
    title: 'React Native nâng cao',
    instructor: 'Nguyễn Minh Anh',
    category: 'Lập trình di động',
    students: 39,
  },
  {
    id: 'course-10',
    title: 'Xây dựng API với Node.js',
    instructor: 'Trần Quốc Bảo',
    category: 'Lập trình web',
    students: 46,
  },
  {
    id: 'course-11',
    title: 'Thiết kế trải nghiệm người dùng',
    instructor: 'Đỗ Ngọc Mai',
    category: 'Thiết kế',
    students: 33,
  },
  {
    id: 'course-12',
    title: 'Nhập môn trí tuệ nhân tạo',
    instructor: 'Phạm Quang Huy',
    category: 'Khoa học máy tính',
    students: 72,
  },
  {
    id: 'course-13',
    title: 'Phát triển ứng dụng với Flutter',
    instructor: 'Hoàng Gia Linh',
    category: 'Lập trình di động',
    students: 44,
  },
  {
    id: 'course-14',
    title: 'HTML và CSS từ cơ bản đến nâng cao',
    instructor: 'Lê Thu Hà',
    category: 'Lập trình web',
    students: 25,
  },
  {
    id: 'course-15',
    title: 'Kiểm thử ứng dụng di động',
    instructor: 'Hoàng Gia Linh',
    category: 'Lập trình di động',
    students: 37,
  },
];
