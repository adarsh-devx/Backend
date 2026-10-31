import { useState } from "react";
import { Trash2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import VariantStockStepper from "./VariantStockStepper";

/**
 * VariantCard
 * Luxury atelier swatch card showcasing variant attributes,
 * garment photo, live price, and instant stock controls.
 */
export default function VariantCard({
  variant,
  masterProduct,
  isSelected,
  onSelect,
  onStockChange,
  onDeleteVariant,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract attributes
  const rawAttrs = variant?.attributes;
  const attributes =
    rawAttrs instanceof Map
      ? Object.fromEntries(rawAttrs)
      : typeof rawAttrs === "object" && rawAttrs !== null
        ? rawAttrs
        : {};

  const size = attributes?.size || attributes?.Size || attributes?.SIZE || "OS";
  const color =
    attributes?.color || attributes?.Color || attributes?.COLOR || "Standard";
  const fit = attributes?.fit || attributes?.Fit || attributes?.FIT;

  // Other custom attributes
  const extraAttributes = Object.entries(attributes).filter(
    ([k]) => !["size", "color", "fit"].includes(k.toLowerCase()),
  );

  // Image fallback
  const variantImage =
    variant?.images?.[0]?.url ||
    masterProduct?.images?.[0]?.url ||
    "/assets/hero_black.jpg";

  // Price calculations
  const currencySymbol =
    (variant?.price?.currency || masterProduct?.price?.currency) === "USD"
      ? "$"
      : "₹";
  const variantAmount = Number(
    variant?.price?.amount ?? masterProduct?.price?.amount ?? 0,
  );
  const masterAmount = Number(masterProduct?.price?.amount ?? 0);
  const hasPriceOverride =
    variant?.price?.amount !== undefined && variantAmount !== masterAmount;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setConfirmDelete(true);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  const handleConfirmDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      if (onDeleteVariant) {
        await onDeleteVariant(variant._id);
      }
    } catch (err) {
      console.error("Failed to delete variant:", err);
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(variant)}
      className={cn(
        "group relative bg-white border transition-all duration-200 cursor-pointer p-4 flex flex-col justify-between gap-4",
        isSelected
          ? "border-zinc-950 ring-1 ring-zinc-950 shadow-sm"
          : "border-zinc-300 hover:border-zinc-700 hover:shadow-xs",
      )}
    >
      {/* Top Section: Photo + Essential Details */}
      <div className="flex items-start gap-4">
        {/* Garment Image 3:4 */}
        <div className="relative w-20 aspect-[3/4] bg-[#eae9e2] border border-zinc-200 shrink-0 overflow-hidden">
          <img
            src={variantImage}
            alt={size}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Info Column */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Top row: Size pill + Delete button */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-space text-sm font-bold px-2 py-0.5 bg-zinc-950 text-white uppercase tracking-wider">
              {size}
            </span>

            {/* Delete button or confirmation */}
            {confirmDelete ? (
              <div className="flex items-center gap-1 bg-white border border-rose-300 px-1 py-0.5 animate-in fade-in">
                <span className="text-[10px] font-mono text-rose-700 font-bold px-1">
                  DELETE?
                </span>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="p-1 hover:bg-rose-100 text-rose-700 transition-colors"
                  title="Confirm delete"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  className="p-1 hover:bg-zinc-100 text-zinc-600 transition-colors"
                  title="Cancel"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleDeleteClick}
                className="text-zinc-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 p-1"
                title="Delete Variant"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Colorway & Fit */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <div className="flex items-center gap-1.5 text-xs font-inter text-zinc-800">
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/20"
                style={{
                  backgroundColor:
                    color.toLowerCase() === "white"
                      ? "#ffffff"
                      : color.toLowerCase() === "black"
                        ? "#0f0f10"
                        : color,
                }}
              />
              <span className="font-medium">{color}</span>
            </div>

            {fit && (
              <span className="text-zinc-500 font-inter text-xs">• {fit}</span>
            )}
          </div>

          {/* Extra Attributes */}
          {extraAttributes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {extraAttributes.map(([key, val]) => (
                <span
                  key={key}
                  className="text-[10px] font-mono text-zinc-600 bg-zinc-100 px-1.5 py-0.5"
                >
                  {key}: {String(val)}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-space text-base font-bold text-zinc-950">
              {currencySymbol}
              {variantAmount.toLocaleString()}
            </span>
            {hasPriceOverride && (
              <span className="font-space text-xs text-zinc-400 line-through">
                {currencySymbol}
                {masterAmount.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Stock Management Stepper */}
      <div className="pt-3 border-t border-zinc-200">
        <VariantStockStepper
          stock={variant?.stock || 0}
          variantId={variant?._id}
          productId={masterProduct?._id}
          onStockChange={onStockChange}
        />
      </div>
    </div>
  );
}
