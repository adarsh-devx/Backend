import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Minus, Plus, X, ChevronRight } from "lucide-react";
import { useCart } from "../hook/useCart";

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

const Cart = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.items || []);
  const { handleGetCart, handleUpdateQuantity, handleRemoveItem } = useCart();
  const [discountOpen, setDiscountOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    handleGetCart();
  }, []);

  const currencySymbol =
    cartItems.length > 0 &&
    (cartItems[0]?.price?.currency === "USD" ||
      cartItems[0]?.product?.price?.currency === "USD")
      ? "$"
      : "₹";

  const estimatedTotal = cartItems.reduce((acc, item) => {
    const price = Number(
      item.price?.amount ?? item.product?.price?.amount ?? 0
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

  return (
    <div className="min-h-screen bg-white font-space">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-zinc-200">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold text-black tracking-tight font-space">
            Cart
          </h1>
          {cartItems.length > 0 && (
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold font-space">
              {cartItems.length}
            </span>
          )}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 transition-colors"
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>

      {/* ── Items ── */}
      <div className="flex-1 px-5 py-4 divide-y divide-zinc-100">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-zinc-400">
            <span className="text-4xl">🛒</span>
            <p className="text-sm font-space">Your cart is empty</p>
          </div>
        ) : (
          cartItems.map((item, index) => {
            const price = Number(
              item.price?.amount ?? item.product?.price?.amount ?? 0
            );
            const itemCurrency =
              item.price?.currency || item.product?.price?.currency || "INR";
            const itemSymbol = itemCurrency === "USD" ? "$" : "₹";

            // Extract variant
            const variant = item.product?.variants?.find(
              (v) => String(v._id) === String(item.variant?._id || item.variant)
            );

            // Extract image safely
            const rawImg =
              variant?.images?.[0] ||
              item.product?.variants?.[0]?.images?.[0] ||
              item.product?.images?.[0] ||
              null;
            const image =
              typeof rawImg === "string" ? rawImg : rawImg?.url || null;

            const productName = item.product?.title || item.product?.name || "Product";

            // Extract size from variant attributes map or object
            const rawAttrs = variant?.attributes;
            const attrs =
              rawAttrs instanceof Map
                ? Object.fromEntries(rawAttrs)
                : typeof rawAttrs === "object" && rawAttrs !== null
                  ? rawAttrs
                  : {};
            const size =
              attrs.size || attrs.Size || attrs.SIZE || item.variant?.size || "Standard";

            const isBusy = updatingId === item._id;

            return (
              <div key={item._id ?? index} className={`py-5 flex gap-4 ${isBusy ? "opacity-60" : ""}`}>
                {/* Product image */}
                <div className="w-20 h-20 rounded-md bg-zinc-100 flex-shrink-0 overflow-hidden border border-zinc-200">
                  {image ? (
                    <img
                      src={image}
                      alt={productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-space">
                      No img
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-black leading-tight font-space truncate">
                      {productName}
                    </p>
                    <p className="text-sm font-bold text-black whitespace-nowrap font-space">
                      {itemSymbol}
                      {(price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 font-space">Size: {size}</p>
                  <p className="text-xs text-zinc-500 font-space">
                    {itemSymbol}
                    {price.toLocaleString()} each
                  </p>

                  {/* Qty stepper + delete */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-zinc-300 rounded-md bg-white">
                      <button
                        onClick={() => onQuantityChange(item._id, item.quantity - 1)}
                        disabled={isBusy}
                        className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 transition-colors rounded-l-md disabled:opacity-40"
                      >
                        <Minus size={13} strokeWidth={2} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-black font-space select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onQuantityChange(item._id, item.quantity + 1)}
                        disabled={isBusy}
                        className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 transition-colors rounded-r-md disabled:opacity-40"
                      >
                        <Plus size={13} strokeWidth={2} />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item._id)}
                      disabled={isBusy}
                      title="Remove item"
                      className="group w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-colors disabled:opacity-40"
                    >
                      <AnimatedTrash size={16} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Bottom section ── */}
      <div className="border-t border-zinc-200 px-5 pt-4 pb-6">
        {/* Discount row */}
        <button
          onClick={() => setDiscountOpen((p) => !p)}
          className="w-full flex items-center justify-between py-3 border-b border-zinc-200 text-sm text-black font-space"
        >
          <span>Discount</span>
          <span className="text-lg leading-none text-zinc-500">
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
              className="flex-1 border border-zinc-300 rounded px-3 py-2 text-sm font-space outline-none focus:border-black transition-colors"
            />
            <button className="px-4 py-2 bg-black text-white text-sm rounded font-space hover:bg-zinc-800 transition-colors">
              Apply
            </button>
          </div>
        )}

        {/* Estimated total */}
        <div className="flex items-center justify-between pt-4 pb-1">
          <span className="text-sm font-semibold text-black font-space">
            Estimated total
          </span>
          <span className="text-sm font-bold text-black font-space">
            {currencySymbol}
            {estimatedTotal.toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-zinc-500 font-space mb-5">
          Taxes and shipping calculated at checkout.
        </p>

        {/* Checkout button */}
        <button className="w-full bg-black text-white py-4 rounded-sm text-sm font-semibold tracking-wide font-space hover:bg-zinc-800 active:scale-[0.98] transition-all">
          Check out
        </button>
      </div>
    </div>
  );
};

export default Cart;