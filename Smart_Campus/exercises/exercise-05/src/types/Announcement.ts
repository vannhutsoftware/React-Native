export type AnnouncementCategory = 'Học tập' | 'Sự kiện' | 'Hệ thống';

export type Announcement = {
  id: string;
  category: AnnouncementCategory;
  title: string;
  summary: string;
  publishedAt: string;
  unread: boolean;
};
