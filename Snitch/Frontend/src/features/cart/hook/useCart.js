import {
  addItem,
  getCart,
  updateQuantity,
  removeItem,
  createCartOrder,
  verifyCartOrder,
  getOrderDetails,
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

  async function handleCreateCartOrder() {
    const data = await createCartOrder();
    return data.order;
  }

  async function handleVerifyCartOrder({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  }) {
    const data = await verifyCartOrder({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    return data;
  }

  async function handleGetOrderDetails(orderId) {
    const data = await getOrderDetails(orderId);
    return data?.order;
  }

  const PENDING_CART_STORAGE_KEY = "noirvayn_pending_cart_item";

  /**
   * Saves product intent to localStorage when an unauthenticated guest clicks Add to Cart.
   * Includes security validation against malformed payloads and open redirects.
   */
  function handleSavePendingCartItem({
    productId,
    variantId,
    quantity = 1,
    returnUrl,
  }) {
    try {
      if (!productId || typeof productId !== "string") return null;

      // Security: Sanitize returnUrl to prevent open redirect vulnerabilities
      let safeReturnUrl = "/";
      if (
        typeof returnUrl === "string" &&
        returnUrl.startsWith("/") &&
        !returnUrl.startsWith("//") &&
        !returnUrl.includes("\\")
      ) {
        safeReturnUrl = returnUrl;
      }

      const pending = {
        productId: String(productId).trim(),
        variantId: variantId ? String(variantId).trim() : undefined,
        quantity: Math.max(1, Math.min(99, parseInt(quantity, 10) || 1)),
        returnUrl: safeReturnUrl,
        timestamp: Date.now(),
      };

      localStorage.setItem(PENDING_CART_STORAGE_KEY, JSON.stringify(pending));
      return pending;
    } catch (err) {
      console.error("Failed to save pending cart item:", err);
      return null;
    }
  }

  /**
   * Safely retrieves the pending cart item if it hasn't expired (24h TTL).
   */
  function getPendingCartItem() {
    try {
      const raw = localStorage.getItem(PENDING_CART_STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.productId) {
        localStorage.removeItem(PENDING_CART_STORAGE_KEY);
        return null;
      }

      // 24-hour TTL expiration check
      if (parsed.timestamp && Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(PENDING_CART_STORAGE_KEY);
        return null;
      }

      return parsed;
    } catch {
      localStorage.removeItem(PENDING_CART_STORAGE_KEY);
      return null;
    }
  }

  function handleClearPendingCartItem() {
    try {
      localStorage.removeItem(PENDING_CART_STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear pending cart item:", err);
    }
  }

  /**
   * Automatically adds the pending item to the user's cart upon successful authentication.
   * Atomically clears localStorage first to prevent duplicate synchronization.
   */
  async function handleSyncPendingCartItem() {
    const pending = getPendingCartItem();
    if (!pending || !pending.productId) return null;

    // Atomically remove first so concurrent triggers cannot run duplicate adds
    handleClearPendingCartItem();

    try {
      const data = await handleAddToCart({
        productId: pending.productId,
        variantId: pending.variantId,
        quantity: pending.quantity,
      });

      // Automatically open the cart drawer so the user gets immediate visual confirmation
      dispatch(openCartAction());

      return { ...pending, cartData: data };
    } catch (err) {
      console.error("Failed to sync pending cart item to user cart:", err);
      return null;
    }
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
    handleCreateCartOrder,
    handleVerifyCartOrder,
    handleGetOrderDetails,
    handleSavePendingCartItem,
    getPendingCartItem,
    handleClearPendingCartItem,
    handleSyncPendingCartItem,
  };
};
