import { useState } from "react";
import { useSearchParams, Link } from "react-router";
import { Check, Copy, CheckCheck, ArrowUpRight } from "lucide-react";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId =
    searchParams.get("order_id") ||
    "NV-" + Math.random().toString(36).substring(2, 9).toUpperCase();

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen sm:h-screen w-full bg-[#e7e7e0] text-zinc-950 font-space flex flex-col justify-between p-6 sm:p-10 lg:px-16 lg:py-8 select-none">
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

      {/* ── Center Content: High-Fashion Minimalist Receipt Card ── */}
      <main className="w-full max-w-xl mx-auto my-auto py-4 sm:py-6">
        <div className="bg-[#f4f4f0] border border-zinc-300/90 p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-950 text-white rounded-full text-[11px] font-mono tracking-widest uppercase mb-5">
            <Check size={13} strokeWidth={2.5} />
            <span>ACQUISITION ALLOCATED</span>
          </div>

          {/* Heading */}
          <h1 className="font-michroma text-2xl sm:text-3xl lg:text-[2rem] font-bold tracking-tight uppercase text-zinc-950 leading-tight mb-3">
            Order Confirmed.
          </h1>

          <p className="text-zinc-600 text-sm font-space leading-relaxed mb-7 max-w-lg">
            Your piece has been reserved in the atelier catalog. A verification receipt has been dispatched to your email address.
          </p>

          {/* Receipt Ledger Table */}
          <div className="bg-white border border-zinc-200 divide-y divide-zinc-200 text-xs sm:text-sm font-mono mb-7">
            <div className="flex items-center justify-between p-4 sm:px-5">
              <span className="text-zinc-500 uppercase tracking-wider text-[11px] sm:text-xs">
                Order Reference
              </span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-950 tracking-wider">
                  {orderId}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-zinc-400 hover:text-zinc-950 transition-colors p-1 cursor-pointer"
                  title="Copy Order ID"
                >
                  {copied ? (
                    <CheckCheck size={15} className="text-emerald-600" />
                  ) : (
                    <Copy size={15} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 sm:px-5">
              <span className="text-zinc-500 uppercase tracking-wider text-[11px] sm:text-xs">
                Payment Status
              </span>
              <span className="font-semibold text-zinc-950 uppercase tracking-wider">
                Settled (Razorpay)
              </span>
            </div>

            <div className="flex items-center justify-between p-4 sm:px-5">
              <span className="text-zinc-500 uppercase tracking-wider text-[11px] sm:text-xs">
                Estimated Dispatch
              </span>
              <span className="text-zinc-800 font-medium">
                2–4 Atelier Working Days
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/"
              className="w-full sm:flex-1 py-4 px-6 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-mono font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Return to Runway</span>
              <ArrowUpRight size={15} />
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto py-4 px-6 border border-zinc-300 hover:border-zinc-950 text-zinc-800 hover:text-zinc-950 text-xs font-mono font-semibold tracking-widest uppercase text-center transition-colors cursor-pointer"
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
