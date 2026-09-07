import React, { useState, useContext } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { UserContext, UserType } from './UserContext';

function ProfileScreen() {
  const context = useContext(UserContext);

  if (!context || !context.user) {
    return (
      <View style={styles.card}>
        <Text style={styles.loggedOutText}>Bạn đã đăng xuất tài khoản.</Text>
      </View>
    );
  }

  const { name, email, avatar } = context.user;

  return (
    <View style={styles.card}>
      <Image source={avatar} style={styles.avatar} resizeMode="cover" />
      <Text style={styles.name}>Xin chào, {name}!</Text>
      <Text style={styles.email}>Email: {email}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Đăng xuất" onPress={context.logout} color="#d9534f" />
      </View>
    </View>
  );
}

export default function UserProfileScreen() {
  const [user, setUser] = useState<UserType>({
    name: 'Võ Văn Nhựt',
    email: 'vovannhut23676661@gmail.com',
    avatar: require('./img/avt.jpg'),
  });

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, logout: handleLogout }}>
      <View style={styles.container}>
        <Text style={styles.title}>Bài tập thực hành: Profile User (Context)</Text>
        <ProfileScreen />
      </View>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  card: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    width: '100%',
    maxWidth: 320,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  loggedOutText: {
    fontSize: 16,
    color: '#d9534f',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 8,
    width: '100%',
  },
});
