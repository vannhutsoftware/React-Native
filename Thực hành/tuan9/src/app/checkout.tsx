import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { Action, money, Page, styles } from '../components/Common';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/authSlice';
import { clearCart, removeFromCart } from '../store/cartSlice';
import { getJwtExpiry } from '../utils/auth';

export default function CheckoutScreen() {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth.session);
  const cart = useAppSelector((state) => state.cart);
  const [message, setMessage] = useState('');
  const valid = !!session && getJwtExpiry(session.token) > Date.now();
  useEffect(() => { if (session && !valid) void dispatch(logout()); }, [session, valid, dispatch]);
  if (!valid || !session) return <Redirect href={{ pathname: '/login', params: { redirect: '/checkout' } }} />;

  return (
    <Page title="Bài 2 - Thanh toán">
      <Action title="Về trang chủ" onPress={() => router.replace('/')} />
      <Text>Tài khoản: {session.user.email}</Text>
      {!!message && <Text>{message}</Text>}
      {!cart.length && <Text>Giỏ hàng trống. Hãy chọn sách ở trang chi tiết.</Text>}
      {cart.map(({ book, quantity }) => (
        <View key={book.id} style={styles.item}>
          <Text style={styles.heading}>{book.title}</Text>
          <Text>{quantity} x {money(book.price)} = {money(quantity * book.price)}</Text>
          <Action title="Bỏ khỏi giỏ" onPress={() => dispatch(removeFromCart(book.id))} />
        </View>
      ))}
      <Text style={styles.heading}>Tổng tiền: {money(cart.reduce((sum, item) => sum + item.quantity * item.book.price, 0))}</Text>
      <Text style={styles.muted}>Thanh toán mô phỏng cho bài tập, không trừ tiền thật.</Text>
      <Action title="Xác nhận thanh toán" disabled={!cart.length} onPress={() => {
        if (getJwtExpiry(session.token) <= Date.now()) { void dispatch(logout()); return; }
        dispatch(clearCart()); setMessage('Thanh toán mô phỏng thành công.');
      }} />
    </Page>
  );
}
