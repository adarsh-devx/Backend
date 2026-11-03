import React from "react";
import { TrendingUp, TrendingDown, X } from "lucide-react";

export default function PriceAlertBanner({ alerts = [], onDismiss }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5 mb-4">
      {alerts.map((alert, index) => {
        const isIncrease = alert.type === "PRICE_INCREASED";
        const symbol = alert.currency === "USD" ? "$" : "₹";

        return (
          <div
            key={index}
            className={`relative rounded-lg p-3.5 border transition-all duration-200 font-space ${
              isIncrease
                ? "bg-zinc-50 border-zinc-200 text-zinc-900"
                : "bg-emerald-50/70 border-emerald-200/80 text-emerald-950"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isIncrease
                      ? "bg-amber-100/80 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {isIncrease ? (
                    <TrendingUp size={14} strokeWidth={2.2} />
                  ) : (
                    <TrendingDown size={14} strokeWidth={2.2} />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${
                        isIncrease
                          ? "bg-zinc-200/70 text-zinc-700"
                          : "bg-emerald-200/60 text-emerald-800"
                      }`}
                    >
                      {isIncrease ? "Price Updated" : "Price Drop"}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {isIncrease ? "Increased by" : "Saved"}{" "}
                      <span className="font-medium text-zinc-800">
                        {symbol}
                        {alert.difference?.toLocaleString() || ""}
                      </span>
                    </span>
                  </div>

                  <p className="text-xs text-zinc-700 leading-relaxed">
                    The price of{" "}
                    <span className="font-semibold text-black">
                      {alert.productTitle}
                    </span>{" "}
                    changed from{" "}
                    <span className="line-through text-zinc-400">
                      {symbol}
                      {alert.oldPrice?.toLocaleString()}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-black">
                      {symbol}
                      {alert.newPrice?.toLocaleString()}
                    </span>
                    .
                  </p>
                </div>
              </div>

              {onDismiss && (
                <button
                  type="button"
                  onClick={() => onDismiss(index)}
                  className="text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/50 p-1 rounded transition-colors shrink-0 cursor-pointer"
                  aria-label="Dismiss price alert"
                >
                  <X size={14} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

