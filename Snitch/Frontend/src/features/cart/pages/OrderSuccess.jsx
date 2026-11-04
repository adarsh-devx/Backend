import { useSearchParams, Link } from "react-router";
import { Check, ArrowRight, Package, ShieldCheck, Mail } from "lucide-react";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id") || "NV-" + Math.random().toString(36).substring(2, 9).toUpperCase();

  return (
    <div className="min-h-screen bg-[#e7e7e0] text-black font-space flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-xl">
        {/* Top Minimalist Tag */}
        <div className="flex items-center justify-between pb-6 border-b border-black/15 text-xs uppercase tracking-widest text-zinc-500 font-mono">
          <span>NOIRVAYN ATELIER</span>
          <span className="flex items-center gap-1.5 text-black">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            TRANSACTION VERIFIED
          </span>
        </div>

        {/* Card Container */}
        <div className="bg-white border border-black/10 mt-6 p-8 sm:p-12 shadow-sm">
          {/* Success Check Icon */}
          <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-6">
            <Check size={26} strokeWidth={2.2} />
          </div>

          {/* Heading */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="font-michroma text-2xl sm:text-3xl tracking-tight uppercase text-black">
              Acquisition Confirmed
            </h1>
            <p className="text-zinc-600 text-sm max-w-sm mx-auto font-space">
              Thank you for ordering with NOIRVAYN. Your bespoke garments have been allocated from the archive.
            </p>
          </div>

          {/* Order Details Ledger */}
          <div className="bg-[#f7f7f4] border border-black/10 p-5 space-y-3.5 mb-8 text-xs sm:text-sm">
            <div className="flex justify-between items-center text-zinc-500">
              <span className="uppercase tracking-wider">Order Reference</span>
              <span className="font-mono font-semibold text-black tracking-wider break-all">{orderId}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-500 border-t border-black/5 pt-3">
              <span className="uppercase tracking-wider">Payment Status</span>
              <span className="text-emerald-700 font-semibold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={14} /> Settled & Verified
              </span>
            </div>
            <div className="flex justify-between items-center text-zinc-500 border-t border-black/5 pt-3">
              <span className="uppercase tracking-wider">Dispatch Window</span>
              <span className="text-black font-medium">2–4 Atelier Business Days</span>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-black/10 mb-8 text-xs text-zinc-600">
            <div className="flex items-start gap-2.5">
              <Package size={16} className="text-black shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-black uppercase tracking-wider">Archive Packaging</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Vacuum-sealed luxury dustbag & cert of origin</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail size={16} className="text-black shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-black uppercase tracking-wider">Digital Manifest</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Tracking code dispatched via email</p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 px-6 text-xs sm:text-sm font-semibold uppercase tracking-widest hover:bg-zinc-800 active:scale-[0.99] transition-all"
            >
              <span>Return to Runway</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/"
              className="w-full flex items-center justify-center py-3.5 px-6 border border-black/20 text-black text-xs sm:text-sm font-semibold uppercase tracking-widest hover:bg-black/5 transition-all text-center"
            >
              Explore Archive
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-zinc-500 uppercase tracking-widest mt-6 font-mono">
          NOIRVAYN ARCHIVE SYSTEM &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
