import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Mathematically precise 10-sided Decagon Button with kinetic rotation
 * Styled exactly like the SHADXW reference
 */
export default function DecagonButton({
  price = "$99.99",
  label = "ADD TO BAG",
  onClick,
  className,
}) {
  const [isHovered, setIsHovered] = useState(false);

  // 10-sided regular decagon coordinates (radius 34, center 40,40)
  const decagonPoints =
    "40.0,6.0 60.0,12.5 72.3,29.5 72.3,50.5 60.0,67.5 40.0,74.0 20.0,67.5 7.7,50.5 7.7,29.5 20.0,12.5";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "inline-flex items-center gap-4 cursor-pointer group select-none transition-transform duration-200 active:scale-95",
        className,
      )}
    >
      {/* Decagon Polygon Frame */}
      <div className="relative w-15 h-15 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 80 80"
          className={cn(
            "w-full h-full text-zinc-900 transition-transform duration-500 ease-out",
            isHovered ? "rotate-45 scale-105" : "rotate-0 scale-100",
          )}
        >
          <polygon
            points={decagonPoints}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>

        {/* Center Diagonal Arrow ↗ */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-transform duration-300",
            isHovered ? "translate-x-0.5 -translate-y-0.5" : "",
          )}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-zinc-950"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </div>
      </div>

      {/* Label & Price */}
      <div className="flex flex-col text-left">
        <span className="font-space text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-zinc-500 group-hover:text-zinc-950 transition-colors">
          {label}
        </span>
        <span className="font-space text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 leading-tight">
          {price}
        </span>
      </div>
    </div>
  );
}
