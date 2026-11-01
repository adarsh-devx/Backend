import { addItem, fetchCart } from "../service/cart.api.js";
import { useDispatch, useSelector } from "react-redux";
import { addItem as addItemToCart, setItems } from "../state/cart.slice.js";

export const useCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.items || []);

  async function handleAddToCart({ productId, variantId, quantity = 1 }) {
    const data = await addItem({ productId, variantId, quantity });
    if (data.cart?.items) {
      dispatch(setItems(data.cart.items));
    } else if (data.item) {
      dispatch(addItemToCart(data.item));
    }
    return data;
  }

  async function handleGetCart() {
    const data = await fetchCart();
    if (data.cart?.items) {
      dispatch(setItems(data.cart.items));
    }
    return data;
  }

  return {
    cartItems,
    handleAddToCart,
    handleGetCart,
  };
};
