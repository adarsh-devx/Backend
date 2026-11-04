import { useState, useEffect } from "react";
import { useSearchParams, useLocation, Link } from "react-router";
import { Check, Copy, CheckCheck, ArrowUpRight, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "../hook/useCart";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { handleGetOrderDetails } = useCart();

  const orderIdFromQuery = searchParams.get("order_id");
  const initialOrder = location.state?.order || null;

  const [orderData, setOrderData] = useState(initialOrder);
  const [loading, setLoading] = useState(!initialOrder && !!orderIdFromQuery);
  const [copied, setCopied] = useState(false);

  const activeOrderId =
    orderData?.Razorpay?.orderId || orderIdFromQuery || "NV-ORDER-CONFIRMED";

  useEffect(() => {
    if (!orderData && orderIdFromQuery) {
      let isMounted = true;
      handleGetOrderDetails(orderIdFromQuery)
        .then((data) => {
          if (isMounted && data) {
            setOrderData(data);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch order details:", err);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [orderIdFromQuery, orderData, handleGetOrderDetails]);

  const handleCopy = () => {
    if (!activeOrderId) return;
    navigator.clipboard.writeText(activeOrderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currencySymbol =
    orderData?.price?.currency === "USD" ? "$" : "₹";
  const totalAmount = orderData?.price?.amount;
  const items = orderData?.orderItems || [];

  return (
    <div className="min-h-screen sm:h-screen w-full bg-[#e7e7e0] text-zinc-950 font-space flex flex-col justify-between p-6 sm:p-10 lg:px-16 lg:py-6 select-none">
      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between border-b border-zinc-300/80 pb-4">
        <Link
          to="/"
          className="font-michroma text-xl sm:text-2xl font-bold tracking-[0.25em] uppercase text-zinc-950 hover:opacity-80 transition-opacity"
        >
          NOIRVAYN
        </Link>
        <div className="flex items-center gap-2 font-mono text-xs tracking-wider uppercase text-zinc-700">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>PAYMENT VERIFIED</span>
        </div>
      </header>

      {/* ── Center Content: High-Fashion Minimalist Order Manifest ── */}
      <main className="w-full max-w-xl mx-auto my-auto py-3 sm:py-4">
        <div className="bg-[#f4f4f0] border border-zinc-300/90 p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950 text-white rounded-full text-[10px] font-mono tracking-widest uppercase mb-4">
            <Check size={12} strokeWidth={2.5} />
            <span>ACQUISITION ALLOCATED</span>
          </div>

          {/* Heading */}
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h1 className="font-michroma text-2xl sm:text-3xl font-bold tracking-tight uppercase text-zinc-950 leading-tight">
              Order Confirmed.
            </h1>
            {totalAmount && (
              <span className="font-mono text-sm sm:text-base font-bold text-zinc-950 shrink-0">
                {currencySymbol}
                {Number(totalAmount).toLocaleString()}
              </span>
            )}
          </div>

          <p className="text-zinc-600 text-xs sm:text-sm font-space leading-relaxed mb-5">
            Your piece has been recorded in the atelier catalog. Preparation and dispatch verification are underway.
          </p>

          {/* Order Reference Row */}
          <div className="bg-white border border-zinc-200 p-3 sm:px-4 mb-4 flex items-center justify-between font-mono text-xs">
            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">
              Order Reference
            </span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-950 tracking-wider">
                {activeOrderId}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-zinc-400 hover:text-zinc-950 transition-colors p-1 cursor-pointer"
                title="Copy Order ID"
              >
                {copied ? (
                  <CheckCheck size={14} className="text-emerald-600" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          </div>

          {/* ── Purchased Items Summary ── */}
          <div className="bg-white border border-zinc-200 p-4 mb-5">
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
              <span className="flex items-center gap-1.5 font-semibold text-zinc-800">
                <ShoppingBag size={13} />
                Archive Manifest ({items.length || 1} {items.length === 1 ? "Item" : "Items"})
              </span>
              <span>Settled</span>
            </div>

            {loading ? (
              <div className="py-6 flex items-center justify-center gap-2 text-zinc-500 text-xs font-mono">
                <Loader2 size={14} className="animate-spin" />
                <span>Fetching items...</span>
              </div>
            ) : items.length > 0 ? (
              <div className="divide-y divide-zinc-100 max-h-40 overflow-y-auto pr-1">
                {items.map((item, idx) => {
                  const itemImg =
                    item.images?.[0]?.url ||
                    (typeof item.images?.[0] === "string" ? item.images[0] : null);
                  const itemPrice = item.price?.amount || 0;
                  const itemCurrency =
                    item.price?.currency === "USD" ? "$" : "₹";

                  return (
                    <div
                      key={item._id || item.productId || idx}
                      className="py-2.5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {itemImg ? (
                          <img
                            src={itemImg}
                            alt={item.title || "Product"}
                            className="w-10 h-10 object-cover bg-zinc-100 border border-zinc-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 shrink-0 font-mono text-[10px]">
                            NV
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-space font-medium text-zinc-950 uppercase truncate text-xs">
                            {item.title || "Noirvayn Garment"}
                          </p>
                          <p className="font-mono text-[11px] text-zinc-500">
                            Qty: {item.quantity || 1}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono font-semibold text-zinc-900 shrink-0 text-xs">
                        {itemCurrency}
                        {Number(itemPrice * (item.quantity || 1)).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-3 flex items-center justify-between text-xs font-mono text-zinc-600">
                <span>Garments allocated from order verification</span>
                <span className="font-semibold text-zinc-950">Confirmed</span>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/"
              className="w-full sm:flex-1 py-3.5 px-6 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-mono font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Return to Runway</span>
              <ArrowUpRight size={15} />
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto py-3.5 px-6 border border-zinc-300 hover:border-zinc-950 text-zinc-800 hover:text-zinc-950 text-xs font-mono font-semibold tracking-widest uppercase text-center transition-colors cursor-pointer"
            >
              Explore Archive
            </Link>
          </div>
        </div>
      </main>

      {/* ── Minimal Footer ── */}
      <footer className="flex items-center justify-between border-t border-zinc-300/80 pt-4 text-[11px] font-mono text-zinc-500 tracking-wider uppercase">
        <span>NOIRVAYN ATELIER // ARCHIVE</span>
        <span>GLOBAL COUTURE DISPATCH</span>
      </footer>
    </div>
  );
}
