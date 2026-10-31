import { useState, useEffect, useRef } from "react";
import { Minus, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * VariantStockStepper
 * Tactile atelier inventory control with instant local response,
 * debounced server synchronization, and clean typography.
 */
export default function VariantStockStepper({
  stock: initialStock = 0,
  variantId,
  productId,
  onStockChange,
  isSyncing: externalSyncing = false,
  className,
}) {
  const [currentStock, setCurrentStock] = useState(initialStock);
  const [isUpdating, setIsUpdating] = useState(false);
  const [inputValue, setInputValue] = useState(String(initialStock));
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    setCurrentStock(initialStock);
    setInputValue(String(initialStock));
  }, [initialStock]);

  const triggerStockUpdate = (newStock) => {
    const sanitized = Math.max(0, parseInt(newStock, 10) || 0);
    setCurrentStock(sanitized);
    setInputValue(String(sanitized));

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsUpdating(true);
      try {
        if (onStockChange) {
          await onStockChange(variantId, sanitized);
        }
      } catch (err) {
        console.error("Failed to update stock:", err);
        setCurrentStock(initialStock);
        setInputValue(String(initialStock));
      } finally {
        setIsUpdating(false);
      }
    }, 350);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    triggerStockUpdate(currentStock + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (currentStock <= 0) return;
    triggerStockUpdate(currentStock - 1);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    triggerStockUpdate(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 select-none",
        className,
      )}
    >
      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
        STOCK UNITS
      </span>

      {/* Tactile Stepper Unit */}
      <div className="flex items-center border border-zinc-300 bg-white shadow-2xs hover:border-zinc-950 transition-colors">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={currentStock <= 0 || isUpdating || externalSyncing}
          className="w-7 h-7 flex items-center justify-center text-zinc-700 hover:text-black hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          aria-label="Decrease stock"
        >
          <Minus className="w-3 h-3 stroke-[2.5]" />
        </button>

        <div className="w-12 text-center relative py-0.5">
          {isUpdating || externalSyncing ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-3 h-3 animate-spin text-zinc-500" />
            </div>
          ) : (
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputValue}
              onClick={(e) => e.stopPropagation()}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className="w-full text-center font-space text-xs font-bold text-zinc-950 bg-transparent outline-none py-0.5"
            />
          )}
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={isUpdating || externalSyncing}
          className="w-7 h-7 flex items-center justify-center text-zinc-700 hover:text-black hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          aria-label="Increase stock"
        >
          <Plus className="w-3 h-3 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
