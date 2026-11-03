import {
  addItem,
  getCart,
  updateQuantity,
  removeItem,
} from "../service/cart.api.js";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem as addItemToCart,
  setItems,
  setPriceAlerts,
  dismissAlert,
  updateItemQuantity as updateQuantityAction,
  removeItem as removeItemAction,
  openCart as openCartAction,
  closeCart as closeCartAction,
  toggleCart as toggleCartAction,
} from "../state/cart.slice.js";

export const useCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.items || []);
  const priceAlerts = useSelector((state) => state.cart?.priceAlerts || []);
  const isCartOpen = useSelector((state) => state.cart?.isOpen || false);

  const openCart = () => dispatch(openCartAction());
  const closeCart = () => dispatch(closeCartAction());
  const toggleCart = () => dispatch(toggleCartAction());

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
    const data = await getCart();
    if (data.cart?.items) {
      dispatch(setItems(data.cart.items));
    }
    if (data.priceAlerts && Array.isArray(data.priceAlerts)) {
      dispatch(setPriceAlerts(data.priceAlerts));
    }
    return data;
  }

  async function handleUpdateQuantity(itemId, quantity) {
    // 1. Optimistic instant UI update
    dispatch(updateQuantityAction({ itemId, quantity }));
    try {
      // 2. Sync with server
      const data = await updateQuantity({ itemId, quantity });
      if (data.cart?.items) {
        dispatch(setItems(data.cart.items));
      }
      return data;
    } catch (err) {
      // Rollback to server state on error
      await handleGetCart();
      throw err;
    }
  }

  async function handleRemoveItem(itemId) {
    // 1. Optimistic instant UI update
    dispatch(removeItemAction(itemId));
    try {
      // 2. Sync with server
      const data = await removeItem(itemId);
      if (data.cart?.items) {
        dispatch(setItems(data.cart.items));
      }
      return data;
    } catch (err) {
      // Rollback to server state on error
      await handleGetCart();
      throw err;
    }
  }

  function handleDismissAlert(index) {
    dispatch(dismissAlert(index));
  }

  return {
    cartItems,
    priceAlerts,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    handleAddToCart,
    handleGetCart,
    handleUpdateQuantity,
    handleRemoveItem,
    handleDismissAlert,
  };
};
