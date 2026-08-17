import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export type CourseImageCase =
  | 'local'
  | 'remote'
  | 'loading'
  | 'failed'
  | 'informative'
  | 'decorative';

type CourseCardProps = {
  imageCase: CourseImageCase;
  title: string;
  room: string;
  description: string;
  onOpen: (title: string) => void;
};

const LOCAL_IMAGE = require('../../assets/icon.png') as ImageSourcePropType;
const INFORMATIVE_IMAGE = require('../../assets/splash-icon.png') as ImageSourcePropType;
const DECORATIVE_IMAGE = require('../../assets/android-icon-background.png') as ImageSourcePropType;

const caseLabels: Record<CourseImageCase, string> = {
  local: 'Ảnh local',
  remote: 'Ảnh remote',
  loading: 'Đang tải ảnh',
  failed: 'Ảnh tải thất bại',
  informative: 'Ảnh mang thông tin',
  decorative: 'Ảnh trang trí',
};

export default function CourseCard({
  imageCase,
  title,
  room,
  description,
  onOpen,
}: CourseCardProps) {
  const [remoteLoading, setRemoteLoading] = useState(imageCase === 'remote');
  const [imageFailed, setImageFailed] = useState(false);

  const renderImage = () => {
    if (imageCase === 'loading') {
      return (
        <View accessible accessibilityLabel="Ảnh học phần đang được tải" style={styles.statePanel}>
          <ActivityIndicator color="#0B57D0" size="large" />
          <Text style={styles.stateTitle}>Đang tải hình ảnh học phần...</Text>
          <Text style={styles.stateDescription}>Bạn vẫn có thể mở học phần ngay bây giờ.</Text>
        </View>
      );
    }

    if (imageCase === 'failed' && imageFailed) {
      return (
        <View accessible accessibilityLabel="Không thể tải ảnh học phần" style={styles.failedPanel}>
          <Text accessible={false} style={styles.failedIcon}>▧</Text>
          <Text style={styles.stateTitle}>Không thể hiển thị hình ảnh</Text>
          <Text style={styles.stateDescription}>Nội dung học phần vẫn sẵn sàng bên dưới.</Text>
        </View>
      );
    }

    if (imageCase === 'local') {
      return (
        <Image
          accessibilityLabel="Biểu tượng ứng dụng Smart Campus được lưu trong dự án"
          resizeMode="cover"
          source={LOCAL_IMAGE}
          style={styles.image}
        />
      );
    }

    if (imageCase === 'informative') {
      return (
        <Image
          accessibilityLabel="Minh họa học phần thiết kế giao diện ứng dụng di động"
          resizeMode="contain"
          source={INFORMATIVE_IMAGE}
          style={[styles.image, styles.informativeImage]}
        />
      );
    }

    if (imageCase === 'decorative') {
      return (
        <Image
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          resizeMode="cover"
          source={DECORATIVE_IMAGE}
          style={styles.image}
        />
      );
    }

    const source =
      imageCase === 'failed'
        ? { uri: 'https://example.invalid/smart-campus-course.png' }
        : { uri: 'https://reactnative.dev/img/tiny_logo.png' };

    return (
      <View style={styles.remoteImageContainer}>
        <Image
          accessibilityLabel="Biểu tượng React Native được tải từ máy chủ từ xa"
          onError={() => {
            setImageFailed(true);
            setRemoteLoading(false);
          }}
          onLoadEnd={() => setRemoteLoading(false)}
          onLoadStart={() => setRemoteLoading(true)}
          resizeMode="contain"
          source={source}
          style={styles.image}
        />
        {remoteLoading && (
          <View style={[StyleSheet.absoluteFill, styles.loadingOverlay]}>
            <ActivityIndicator accessibilityLabel="Đang tải ảnh từ xa" color="#0B57D0" size="large" />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageFrame}>{renderImage()}</View>
      <View style={styles.cardBody}>
        <Text style={styles.caseLabel}>{caseLabels[imageCase]}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.room}>⌖ {room}</Text>
        <Text style={styles.description}>{description}</Text>
        <Pressable
          accessibilityHint="Thao tác này vẫn sử dụng được khi ảnh đang tải hoặc tải thất bại"
          accessibilityRole="button"
          onPress={() => onOpen(title)}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>Mở nội dung học phần</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D3DCE9',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageFrame: {
    aspectRatio: 2.15,
    backgroundColor: '#E9F0FA',
    overflow: 'hidden',
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  informativeImage: {
    backgroundColor: '#E8F1FF',
  },
  remoteImageContainer: {
    flex: 1,
  },
  loadingOverlay: {
    alignItems: 'center',
    backgroundColor: '#E9F0FA',
    justifyContent: 'center',
  },
  statePanel: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
    justifyContent: 'center',
    padding: 16,
  },
  failedPanel: {
    alignItems: 'center',
    backgroundColor: '#FFF4E8',
    flex: 1,
    gap: 4,
    justifyContent: 'center',
    padding: 16,
  },
  failedIcon: {
    color: '#9A4D00',
    fontSize: 34,
  },
  stateTitle: {
    color: '#23344D',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  stateDescription: {
    color: '#526178',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  cardBody: {
    gap: 8,
    padding: 16,
  },
  caseLabel: {
    alignSelf: 'flex-start',
    backgroundColor: '#E7F0FF',
    borderRadius: 999,
    color: '#0B57D0',
    fontSize: 13,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  title: {
    color: '#101828',
    fontSize: 21,
    fontWeight: '700',
    lineHeight: 28,
  },
  room: {
    color: '#365372',
    fontSize: 16,
    lineHeight: 23,
  },
  description: {
    color: '#526178',
    fontSize: 16,
    lineHeight: 23,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0B57D0',
    borderRadius: 9,
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  buttonPressed: {
    backgroundColor: '#08429F',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
  },
});
