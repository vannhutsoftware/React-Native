export type Announcement = {
  id: string;
  title: string;
  summary: string;
  time: string;
  unread?: boolean;
};

export type AnnouncementSection = {
  title: 'Hôm nay' | 'Tuần này' | 'Trước đó';
  description: string;
  data: Announcement[];
};
