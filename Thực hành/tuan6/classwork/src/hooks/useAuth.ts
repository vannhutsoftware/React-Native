import { authActions, useAppDispatch, useAppSelector } from '../store/store';

export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  return {
    ...auth,
    login: () => dispatch(authActions.loginDemo()),
    logout: () => dispatch(authActions.logout()),
  };
}
