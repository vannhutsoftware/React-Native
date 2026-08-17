import { StyleSheet, Text, View } from 'react-native';

import { Announcement } from '../types/Announcement';

type AnnouncementRowProps = {
  announcement: Announcement;
};

export default function AnnouncementRow({ announcement }: AnnouncementRowProps) {
  return (
    <View
      accessibilityLabel={`${announcement.unread ? 'Chưa đọc. ' : ''}${announcement.title}. ${announcement.summary}. ${announcement.time}`}
      style={styles.row}
    >
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          {announcement.unread && <View accessibilityLabel="Chưa đọc" style={styles.unreadDot} />}
          <Text style={styles.title}>{announcement.title}</Text>
        </View>
        <Text style={styles.time}>{announcement.time}</Text>
      </View>
      <Text style={styles.summary}>{announcement.summary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D3DCE9',
    borderRadius: 14,
    borderWidth: 1,
    gap: 9,
    marginHorizontal: 18,
    padding: 16,
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  titleGroup: {
    alignItems: 'flex-start',
    flex: 1,
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
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 25,
  },
  time: {
    color: '#64748B',
    flexShrink: 1,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'right',
  },
  summary: {
    color: '#526178',
    fontSize: 16,
    lineHeight: 23,
  },
});
