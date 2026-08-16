import { StyleSheet, Text, View } from 'react-native';

import { Announcement } from '../types/Announcement';

type AnnouncementItemProps = {
  announcement: Announcement;
};

const categoryColors = {
  'Học tập': { background: '#E7F0FF', foreground: '#0B57D0' },
  'Sự kiện': { background: '#E7F7ED', foreground: '#18743A' },
  'Hệ thống': { background: '#FFF1DF', foreground: '#925000' },
};

export default function AnnouncementItem({ announcement }: AnnouncementItemProps) {
  const colors = categoryColors[announcement.category];

  return (
    <View
      accessibilityLabel={`${announcement.unread ? 'Thông báo chưa đọc. ' : ''}${announcement.title}. ${announcement.summary}`}
      style={styles.item}
    >
      <View style={styles.itemTopRow}>
        <Text
          style={[
            styles.category,
            { backgroundColor: colors.background, color: colors.foreground },
          ]}
        >
          {announcement.category}
        </Text>
        <Text style={styles.publishedAt}>{announcement.publishedAt}</Text>
      </View>

      <View style={styles.titleRow}>
        {announcement.unread && <View accessibilityLabel="Chưa đọc" style={styles.unreadDot} />}
        <Text style={styles.title}>{announcement.title}</Text>
      </View>
      <Text style={styles.summary}>{announcement.summary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D3DCE9',
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  itemTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  category: {
    borderRadius: 999,
    fontSize: 13,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  publishedAt: {
    color: '#64748B',
    flexShrink: 1,
    fontSize: 13,
    textAlign: 'right',
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 9,
  },
  unreadDot: {
    backgroundColor: '#0B57D0',
    borderRadius: 5,
    height: 10,
    marginTop: 7,
    width: 10,
  },
  title: {
    color: '#101828',
    flex: 1,
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 26,
  },
  summary: {
    color: '#526178',
    fontSize: 16,
    lineHeight: 23,
  },
});
