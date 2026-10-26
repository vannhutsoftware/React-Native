import { useEffect, type ReactNode } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { restoreSession } from '../store/authSlice';
import { Page } from './Common';

export default function AuthBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const restoring = useAppSelector((state) => state.auth.restoring);
  useEffect(() => { void dispatch(restoreSession()); }, [dispatch]);
  if (restoring) return <Page title="BookStore"><ActivityIndicator /><Text>Đang kiểm tra phiên đăng nhập...</Text></Page>;
  return children;
}
