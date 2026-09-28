import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../components/Common';
import { AuthExerciseScreen } from '../screens/AuthExerciseScreen';
import {
  CartNavigationExerciseScreen,
  CartStoreExerciseScreen,
  CheckoutScreen,
} from '../screens/CartExerciseScreen';
import { ExerciseListScreen } from '../screens/ExerciseListScreen';
import {
  AccountTabScreen,
  BookDetailScreen,
  CartTabScreen,
  CategoriesScreen,
  HomeScreen,
} from '../screens/NavigationScreens';
import { WishlistExerciseScreen } from '../screens/WishlistExerciseScreen';
import {
  HomeStackParamList,
  MainTabParamList,
  RootStackParamList,
} from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Bài tập 1 - Home' }}
      />
      <HomeStack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{ title: 'Chi tiết sách' }}
      />
    </HomeStack.Navigator>
  );
}

const tabLabels: Record<keyof MainTabParamList, string> = {
  HomeFlow: 'Home',
  Categories: 'Danh mục',
  Cart: 'Giỏ hàng',
  Account: 'Tài khoản',
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const routeName = route.name as keyof MainTabParamList;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            }}
            style={[styles.tabItem, isFocused && styles.tabItemActive]}
          >
            <Text style={[styles.tabText, isFocused && styles.tabTextActive]}>
              {tabLabels[routeName]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeFlow"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="HomeFlow" component={HomeStackNavigator} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Cart" component={CartTabScreen} />
      <Tab.Screen name="Account" component={AccountTabScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            contentStyle: { backgroundColor: colors.background },
            headerTintColor: colors.navy,
            headerTitleStyle: { fontWeight: '700' },
          }}
        >
          <RootStack.Screen
            name="ExerciseList"
            component={ExerciseListScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ title: 'Bài tập 1' }}
          />
          <RootStack.Screen
            name="CartNavigationExercise"
            component={CartNavigationExerciseScreen}
            options={{ title: 'Bài tập 2' }}
          />
          <RootStack.Screen
            name="CartStoreExercise"
            component={CartStoreExerciseScreen}
            options={{ title: 'Bài tập 3' }}
          />
          <RootStack.Screen
            name="AuthExercise"
            component={AuthExerciseScreen}
            options={{ title: 'Bài tập 4' }}
          />
          <RootStack.Screen
            name="WishlistExercise"
            component={WishlistExerciseScreen}
            options={{ title: 'Thử thách' }}
          />
          <RootStack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{ title: 'Thanh toán' }}
          />
        </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    minHeight: 58,
  },
  tabItem: {
    alignItems: 'center',
    borderTopColor: 'transparent',
    borderTopWidth: 3,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  tabItemActive: {
    backgroundColor: colors.paleBlue,
    borderTopColor: colors.navy,
  },
  tabText: {
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
  },
  tabTextActive: {
    color: colors.navy,
    fontWeight: '700',
  },
});
