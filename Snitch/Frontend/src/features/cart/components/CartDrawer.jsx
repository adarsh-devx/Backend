import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Minus, Plus, X } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCart } from "../hook/useCart";
import PriceAlertBanner from "./PriceAlertBanner";
import { useRazorpay } from "react-razorpay";

const AnimatedTrash = ({ size = 16, strokeWidth = 1.8, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`overflow-visible ${className}`}
  >
    <g className="transition-transform duration-200 ease-out origin-[4px_7px] group-hover:-rotate-[20deg] group-hover:-translate-y-0.5">
      <path d="M3 6h18" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </g>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

export default function CartDrawer() {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.items || []);
  const {
    isCartOpen,
    closeCart,
    handleGetCart,
    handleUpdateQuantity,
    handleRemoveItem,
    priceAlerts,
    handleDismissAlert,
    handleCreateCartOrder,
    handleVerifyCartOrder,
  } = useCart();

  const [discountOpen, setDiscountOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [isCartLoading, setIsCartLoading] = useState(false);

  const { error, isLoading, Razorpay } = useRazorpay();
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    if (isCartOpen) {
      setIsCartLoading(true);
      handleGetCart()
        .catch(() => {})
        .finally(() => {
          setIsCartLoading(false);
        });
    }
  }, [isCartOpen]);

  // Lock body scroll when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isCartOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  const currencySymbol =
    cartItems.length > 0 &&
    (cartItems[0]?.price?.currency === "USD" ||
      cartItems[0]?.product?.price?.currency === "USD")
      ? "$"
      : "₹";

  const currencyCode =
    cartItems.length > 0 &&
    (cartItems[0]?.price?.currency === "USD" ||
      cartItems[0]?.product?.price?.currency === "USD")
      ? "USD"
      : "INR";

  const estimatedTotal = cartItems.reduce((acc, item) => {
    const price = Number(
      item.price?.amount ?? item.product?.price?.amount ?? 0,
    );
    return acc + price * (item.quantity || 1);
  }, 0);

  const onQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      setUpdatingId(itemId);
      await handleUpdateQuantity(itemId, newQty);
    } finally {
      setUpdatingId(null);
    }
  };

  const onRemove = async (itemId) => {
    try {
      setUpdatingId(itemId);
      await handleRemoveItem(itemId);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCheckout = async () => {
    try {
      const order = await handleCreateCartOrder();
      if (!order) return;

      const options = {
        key: "rzp_test_Tw4xY3JTscmoUh",
        amount: order.amount, // Amount in paise
        currency: order.currency,
        name: "Noirvayn",
        description: "Fashion House",
        order_id: order.id, // Generate order_id on server
        handler: async (response) => {
          const verifyResult = await handleVerifyCartOrder(response);

          if (verifyResult?.success) {
            closeCart();
            navigate(`/order-success?order_id=${response?.razorpay_order_id}`, {
              state: { order: verifyResult.payment },
            });
          }
        },
        prefill: {
          name: user?.name || user?.username || "Noirvayn Collector",
          email: user?.email || "",
          contact: user?.contact || user?.phone || "",
        },
        theme: {
          color: "#000000",
        },
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error("Cart checkout error:", err);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] transition-visibility duration-300 ${
        isCartOpen ? "visible" : "invisible pointer-events-none"
      }`}
      aria-hidden={!isCartOpen}
    >
      {/* ── 1. Backdrop Overlay (Clean tint behind drawer) ── */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/15 transition-opacity duration-300 ease-in-out ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* ── 2. Slide-over Sheet (Right panel with clean left border) ── */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-[440px] bg-white border-l border-zinc-200 shadow-2xl flex flex-col font-space transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-black tracking-tight font-space">
              Cart
            </h2>
            {cartItems.length > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold font-space">
                {cartItems.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 hover:text-black transition-colors cursor-pointer"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* ── Cart Items List (Scrollable Area) ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <PriceAlertBanner
            alerts={priceAlerts}
            onDismiss={handleDismissAlert}
          />

          {isCartLoading && cartItems.length === 0 ? (
            <div className="space-y-4 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 py-3.5 border-b border-zinc-100">
                  <Skeleton className="w-20 h-24 shrink-0 bg-zinc-200/90" />
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-2">
                      <Skeleton className="h-3.5 w-3/4 bg-zinc-200/80" />
                      <Skeleton className="h-3 w-1/3 bg-zinc-200/70" />
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-4 w-16 bg-zinc-200/90" />
                      <Skeleton className="h-7 w-20 bg-zinc-200/80" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 gap-3 text-zinc-400">
              <span className="text-4xl">🛒</span>
              <p className="text-sm font-space">Your cart is empty</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {cartItems.map((item, index) => {
                const price = Number(
                  item.price?.amount ?? item.product?.price?.amount ?? 0,
                );
                const itemCurrency =
                  item.price?.currency ||
                  item.product?.price?.currency ||
                  "INR";
                const itemSymbol = itemCurrency === "USD" ? "$" : "₹";

                // Extract variant
                const variant = item.product?.variants?.find(
                  (v) =>
                    String(v._id) === String(item.variant?._id || item.variant),
                );

                // Extract image safely
                const rawImg =
                  variant?.images?.[0] ||
                  item.product?.variants?.[0]?.images?.[0] ||
                  item.product?.images?.[0] ||
                  null;
                const image =
                  typeof rawImg === "string" ? rawImg : rawImg?.url || null;

                const productName =
                  item.product?.title || item.product?.name || "Product";

                // Extract size
                const rawAttrs = variant?.attributes;
                const attrs =
                  rawAttrs instanceof Map
                    ? Object.fromEntries(rawAttrs)
                    : typeof rawAttrs === "object" && rawAttrs !== null
                      ? rawAttrs
                      : {};
                const size =
                  attrs.size ||
                  attrs.Size ||
                  attrs.SIZE ||
                  item.variant?.size ||
                  "Standard";

                const isBusy = updatingId === item._id;

                return (
                  <div
                    key={item._id ?? index}
                    className={`py-4 flex gap-4 ${isBusy ? "opacity-60" : ""}`}
                  >
                    {/* Product thumbnail */}
                    <div className="w-18 h-18 rounded-md bg-zinc-100 shrink-0 overflow-hidden border border-zinc-200">
                      {image ? (
                        <img
                          src={image}
                          alt={productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/assets/hero_black.jpg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-space">
                          No img
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-black leading-tight font-space truncate">
                            {productName}
                          </p>
                          <p className="text-sm font-bold text-black whitespace-nowrap font-space">
                            {itemSymbol}
                            {(price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5 font-space">
                          Size: {size}
                        </p>
                        <p className="text-xs text-zinc-500 font-space">
                          {itemSymbol}
                          {price.toLocaleString()} each
                        </p>
                      </div>

                      {/* Stepper + Animated Trash Icon */}
                      <div className="flex items-center gap-3 mt-2.5">
                        <div className="flex items-center border border-zinc-300 rounded-md bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              onQuantityChange(item._id, item.quantity - 1)
                            }
                            disabled={isBusy}
                            className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 transition-colors rounded-l-md disabled:opacity-40 cursor-pointer"
                          >
                            <Minus size={12} strokeWidth={2} />
                          </button>
                          <span className="w-7 text-center text-xs font-medium text-black font-space select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onQuantityChange(item._id, item.quantity + 1)
                            }
                            disabled={isBusy}
                            className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 transition-colors rounded-r-md disabled:opacity-40 cursor-pointer"
                          >
                            <Plus size={12} strokeWidth={2} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemove(item._id)}
                          disabled={isBusy}
                          title="Remove item"
                          className="group w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <AnimatedTrash size={16} strokeWidth={1.8} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Bottom Section (Checkout & Total) ── */}
        <div className="border-t border-zinc-200 px-6 pt-4 pb-6 bg-white shrink-0">
          {/* Discount row */}
          <button
            type="button"
            onClick={() => setDiscountOpen((p) => !p)}
            className="w-full flex items-center justify-between py-2.5 border-b border-zinc-200 text-sm text-black font-space cursor-pointer"
          >
            <span>Discount</span>
            <span className="text-base font-semibold leading-none text-zinc-500">
              {discountOpen ? "−" : "+"}
            </span>
          </button>

          {discountOpen && (
            <div className="flex gap-2 py-3 border-b border-zinc-200">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Discount code"
                className="flex-1 border border-zinc-300 rounded px-3 py-1.5 text-xs font-space outline-none focus:border-black transition-colors"
              />
              <button
                type="button"
                className="px-3.5 py-1.5 bg-black text-white text-xs rounded font-space hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}

          {/* Estimated total */}
          <div className="flex items-center justify-between pt-4 pb-0.5">
            <span className="text-sm font-medium text-black font-space">
              Estimated total
            </span>
            <span className="text-base font-bold text-black font-space">
              {currencySymbol}
              {estimatedTotal.toLocaleString()}{" "}
              <span className="text-xs font-normal text-zinc-500">
                {currencyCode}
              </span>
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-space mb-4">
            Taxes and shipping calculated at checkout.
          </p>

          {/* Checkout button */}
          <button
            onClick={() => handleCheckout()}
            type="button"
            className="w-full bg-black text-white py-3.5 rounded-none text-xs font-bold uppercase tracking-wider font-space hover:bg-zinc-800 active:scale-[0.99] transition-all cursor-pointer shadow-xs"
          >
            Check out
          </button>
        </div>
      </div>
    </div>
  );
}
