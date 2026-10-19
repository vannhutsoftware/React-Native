import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from '../store';
import AuthBootstrap from '../components/AuthBootstrap';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <AuthBootstrap>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthBootstrap>
    </Provider>
  );
}
