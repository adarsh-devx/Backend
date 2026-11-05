import { Link, useNavigate } from "react-router";
import AsciiKnightCanvas from "@/components/ui/AsciiKnightCanvas";

/**
 * 404 Not Found Page: The ASCII Wayfarer
 * Features the exact 1:1 animated ASCII Knight with waving red cloak,
 * evocative red lore quote, and direct navigation to the product catalog.
 */
export default function NotFound() {
  const navigate = useNavigate();

  const handleNavigateToCatalog = () => {
    navigate("/#catalog");
  };

  return (
    <main
      className="fixed inset-0 z-40 bg-[#141518] text-white overflow-hidden select-none cursor-pointer"
      onClick={handleNavigateToCatalog}
      title="Click anywhere to explore the runway catalog"
    >
      {/* 100% Exact 1:1 Animated ASCII Knight Canvas */}
      <AsciiKnightCanvas />

      {/* Top Brand Watermark */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-10 z-50 pointer-events-auto">
        <Link
          to="/#catalog"
          className="font-michroma text-sm sm:text-base tracking-[0.3em] uppercase text-zinc-300 hover:text-white transition-colors"
          title="Return to Product Catalog"
        >
          NOIRVAYN
        </Link>
      </div>

      {/* Top Right Coordinate Tag */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-10 z-50 font-mono text-[11px] tracking-widest text-zinc-500 uppercase pointer-events-none">
        SECTOR: 404_VOID // NULL
      </div>

      {/* Bottom Left Lore Quote (Matching User's Screenshot) */}
      <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-50 max-w-sm font-mono text-xs sm:text-sm tracking-wide leading-relaxed text-[#CC171C]/90 pointer-events-none">
        <p>He fought through countless paths,</p>
        <p>only to find that the destination</p>
        <p>never existed.</p>
      </div>
    </main>
  );
}
