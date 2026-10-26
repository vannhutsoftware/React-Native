import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthBootstrap from '../components/AuthBootstrap';
import { store } from '../store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AuthBootstrap>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthBootstrap>
      </SafeAreaProvider>
    </Provider>
  );
}
