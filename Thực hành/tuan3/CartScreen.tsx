import React, { useReducer } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type State = {
  quantity: number;
};

type Action =
  | { type: 'ADD' }
  | { type: 'REMOVE' }
  | { type: 'RESET' };

const initialState: State = {
  quantity: 0,
};

function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD':
      return { ...state, quantity: state.quantity + 1 };

    case 'REMOVE':
      return {
        ...state,
        quantity: Math.max(0, state.quantity - 1),
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export default function CartScreen() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Số sản phẩm trong giỏ hàng: {state.quantity}
      </Text>

      <Button title="Thêm sản phẩm" onPress={() => dispatch({ type: 'ADD' })} />

      <Button
        title="Bớt sản phẩm"
        onPress={() => dispatch({ type: 'REMOVE' })}
      />

      <Button
        title="Xóa giỏ hàng"
        onPress={() => dispatch({ type: 'RESET' })}
        color="#d9534f"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
