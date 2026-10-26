import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Eye, ArrowUpRight } from "lucide-react";

/**
 * High-Fashion Techwear Lookbook Product Card (SHADXW Brutalist Style)
 * Includes Animos 3D perspective mouse tilt, photo switcher dots, and instant hero selector
 */
export default function ProductCard({
  product,
  isSelected = false,
  onSelectHero,
  onQuickLook,
  actionLabel,
  onAction,
}) {
  const navigate = useNavigate();
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const images = product?.images || [];
  const primaryImg =
    images[activeImgIdx]?.url ||
    images[0]?.url ||
    "/assets/hero_black.jpg";

  const currencySymbol = product?.price?.currency === "USD" ? "$" : "₹";
  const formattedPrice = Number(product?.price?.amount || 0).toLocaleString();
  const prodId = product?._id ? product._id.slice(-6).toUpperCase() : "PROD-01";

  // Animos 3D Perspective Tilt on Mouse Movement
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: "transform 0.1s ease-out",
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
    });
  };

  const handleCardClick = () => {
    if (onSelectHero) {
      onSelectHero(product);
    } else if (onAction) {
      onAction(product);
    } else if (product?._id) {
      navigate(`/products/${product._id}`);
    }
  };

  const primaryBtnText =
    actionLabel || (onSelectHero ? "Feature on Stage" : "View Details ↗");

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      onClick={handleCardClick}
      className={cn(
        "group relative bg-white border cursor-pointer select-none transition-all duration-300 flex flex-col will-change-transform",
        isSelected
          ? "border-zinc-950 ring-2 ring-zinc-950 shadow-xl"
          : "border-zinc-200/90 hover:border-zinc-950 shadow-xs hover:shadow-lg"
      )}
    >
      {/* 3:4 High-Fashion Media Frame */}
      <div className="aspect-[3/4] w-full bg-[#e8e7e1] relative overflow-hidden">
        <img
          src={primaryImg}
          alt={product?.title || "Product"}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Minimal Technical Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-2 z-10 font-mono text-[9px] font-bold">
          <span className="bg-zinc-950 text-white tracking-widest uppercase px-2 py-0.5">
            ID // {prodId}
          </span>

          <span className="bg-white/90 backdrop-blur-xs text-zinc-900 px-1.5 py-0.5 border border-zinc-200/80">
            {images.length || 1} {images.length === 1 ? "PHOTO" : "PHOTOS"}
          </span>
        </div>

        {/* Quick Action Overlay on Hover */}
        <div
          className={cn(
            "absolute inset-0 bg-black/35 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 p-4 transition-opacity duration-200 z-20",
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="w-full py-2 bg-white text-zinc-950 font-space text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition-colors flex items-center justify-center gap-1 shadow-md cursor-pointer"
          >
            <span>{primaryBtnText}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {onQuickLook && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickLook(product);
              }}
              className="w-full py-1.5 bg-zinc-900/80 hover:bg-zinc-950 text-white font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              <span>Inspect Specs</span>
            </button>
          )}
        </div>

        {/* Multi-photo switcher preview dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1 z-10 pointer-events-auto">
            {images.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImgIdx(idx);
                }}
                className={cn(
                  "h-1 rounded-full transition-all cursor-pointer",
                  activeImgIdx === idx ? "w-4 bg-zinc-950" : "w-1.5 bg-zinc-400/80"
                )}
                aria-label={`Select photo ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Info Bar */}
      <div className="p-3 bg-white flex flex-col justify-between border-t border-zinc-100">
        <div className="flex items-start justify-between gap-2">
          <span className="font-space font-bold text-xs uppercase text-zinc-950 line-clamp-1 tracking-tight">
            {product?.title || "Untitled Product"}
          </span>
          <span className="font-mono text-[11px] font-bold text-zinc-950 shrink-0">
            {currencySymbol}{formattedPrice}
          </span>
        </div>

        <p className="text-[10px] font-mono text-zinc-400 mt-1 line-clamp-1">
          {product?.description || "High-performance techwear apparel"}
        </p>
      </div>
    </div>
  );
}
