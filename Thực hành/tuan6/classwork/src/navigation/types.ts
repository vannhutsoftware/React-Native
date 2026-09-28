export type RootStackParamList = {
  ExerciseList: undefined;
  MainTabs: undefined;
  CartNavigationExercise: undefined;
  CartStoreExercise: undefined;
  AuthExercise: undefined;
  WishlistExercise: undefined;
  Checkout: { total: number };
};

export type HomeStackParamList = {
  Home: undefined;
  BookDetail: { bookId: string };
};

export type MainTabParamList = {
  HomeFlow: undefined;
  Categories: undefined;
  Cart: undefined;
  Account: undefined;
};
