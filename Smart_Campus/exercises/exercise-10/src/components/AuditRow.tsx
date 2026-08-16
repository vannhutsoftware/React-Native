import { StyleSheet, Text, View } from 'react-native';

import type { AuditFinding } from '../data/auditFindings';

type AuditRowProps = {
  finding: AuditFinding;
  fixed: boolean;
};

export function AuditRow({ finding, fixed }: AuditRowProps) {
  return (
    <View
      accessible
      accessibilityLabel={`${finding.title}. ${fixed ? 'Đạt' : 'Chưa đạt'}. ${
        fixed ? finding.after : finding.before
      }`}
      style={styles.row}
    >
      <View style={styles.titleRow}>
        <View style={[styles.statusDot, fixed ? styles.passDot : styles.failDot]} />
        <Text style={styles.title}>{finding.title}</Text>
        <Text style={[styles.status, fixed ? styles.passText : styles.failText]}>
          {fixed ? 'ĐẠT' : 'CHƯA ĐẠT'}
        </Text>
      </View>
      <Text style={styles.detail}>{fixed ? finding.after : finding.before}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginHorizontal: 18,
    borderWidth: 1,
    borderColor: '#D8E0EC',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 13,
    gap: 7,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  passDot: {
    backgroundColor: '#087A55',
  },
  failDot: {
    backgroundColor: '#C4322A',
  },
  title: {
    flex: 1,
    color: '#172033',
    fontSize: 15,
    fontWeight: '800',
  },
  status: {
    fontSize: 11,
    fontWeight: '900',
  },
  passText: {
    color: '#087A55',
  },
  failText: {
    color: '#B42318',
  },
  detail: {
    color: '#56647A',
    fontSize: 13,
    lineHeight: 19,
  },
});
