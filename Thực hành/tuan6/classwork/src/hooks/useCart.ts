import { findBook } from '../data/books';
import { cartActions, useAppDispatch, useAppSelector } from '../store/store';

export function useCart() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const items = cartItems.flatMap((item) => {
    const book = findBook(item.bookId);
    return book ? [{ ...item, book }] : [];
  });

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0,
  );

  return {
    items,
    totalQuantity,
    totalPrice,
    add: (bookId: string) => dispatch(cartActions.addItem(bookId)),
    increase: (bookId: string) =>
      dispatch(cartActions.increaseQuantity(bookId)),
    decrease: (bookId: string) =>
      dispatch(cartActions.decreaseQuantity(bookId)),
    remove: (bookId: string) => dispatch(cartActions.removeItem(bookId)),
  };
}
