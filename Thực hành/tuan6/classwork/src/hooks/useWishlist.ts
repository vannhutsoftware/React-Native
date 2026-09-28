import { wishlistActions, useAppDispatch, useAppSelector } from '../store/store';

export function useWishlist() {
  const dispatch = useAppDispatch();
  const bookIds = useAppSelector((state) => state.wishlist.bookIds);

  return {
    bookIds,
    total: bookIds.length,
    has: (bookId: string) => bookIds.includes(bookId),
    toggle: (bookId: string) =>
      dispatch(wishlistActions.toggleWishlist(bookId)),
  };
}
