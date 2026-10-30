import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuickLookModal({ product, onClose, onSelectAsHero }) {
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  if (!product) return null;

  const images = product?.images || [];

  const activeImg =
    images[selectedImgIdx]?.url || images[0]?.url || "/assets/hero_black.jpg";

  const currencySymbol = product?.price?.currency === "USD" ? "$" : "₹";
  const formattedPrice = Number(product?.price?.amount || 0).toLocaleString();
  const prodId = product?._id ? product._id.slice(-6).toUpperCase() : "PROD-01";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="relative bg-[#f8f8f8] w-full max-w-4xl border border-zinc-300 shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Visual Media Gallery (3:4 aspect) */}
        <div className="md:w-1/2 bg-[#eae9e3] flex flex-col p-5 justify-between gap-3 border-r border-zinc-200">
          <div className="aspect-[3/4] w-full bg-white border border-zinc-200 overflow-hidden relative">
            <img
              src={activeImg}
              alt={product?.title || "Product image"}
              className="w-full h-full object-cover animate-in fade-in duration-300"
            />
            <span className="absolute top-3 left-3 bg-zinc-950 text-white font-mono text-[9px] font-bold tracking-widest px-2 py-0.5">
              PHOTO {selectedImgIdx + 1} // {images.length || 1}
            </span>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImgIdx(idx)}
                  className={cn(
                    "w-12 h-16 border overflow-hidden transition-all shrink-0 cursor-pointer",
                    selectedImgIdx === idx
                      ? "border-zinc-950 ring-1 ring-zinc-950"
                      : "border-zinc-200 opacity-60 hover:opacity-100",
                  )}
                >
                  <img
                    src={img.url}
                    alt={`Thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Technical Specification & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-white overflow-y-auto space-y-6">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                PRODUCT // {prodId}
              </span>
            </div>

            <h2 className="font-michroma text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 uppercase leading-snug">
              {product?.title}
            </h2>

            <div className="font-space text-2xl font-bold text-zinc-950">
              {currencySymbol}
              {formattedPrice}
            </div>

            <div className="border-t border-b border-zinc-100 py-4 space-y-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">
                Editorial Description
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed font-inter">
                {product?.description ||
                  "High-specification Japanese techwear garment constructed for urban performance."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-zinc-50 border border-zinc-100">
                <span className="text-[10px] text-zinc-400 uppercase block">
                  Total Imagery
                </span>
                <span className="font-bold text-zinc-900">
                  {images.length} High-Res Assets
                </span>
              </div>
              <div className="p-2.5 bg-zinc-50 border border-zinc-100">
                <span className="text-[10px] text-zinc-400 uppercase block">
                  Currency
                </span>
                <span className="font-bold text-zinc-900">
                  {product?.price?.currency || "INR"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            {onSelectAsHero && (
              <button
                type="button"
                onClick={() => {
                  onSelectAsHero(product);
                  onClose();
                }}
                className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-space text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Feature on Atelier Hero Stage &rarr;
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 border border-zinc-200 text-zinc-600 hover:text-zinc-950 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
