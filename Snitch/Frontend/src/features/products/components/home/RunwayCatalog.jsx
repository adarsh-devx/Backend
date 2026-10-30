import { useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { Heart, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import useMeasure from "react-use-measure";
import { cn } from "@/lib/utils";

const REFERENCE_CATALOG_ITEMS = [
  {
    id: "6adc7fa06ef2657b685ff2b8",
    title: "BRANDED BLACK JACKET",
    subtitle: "Technical Shell",
    price: 1111,
    image: "/refrenceCatalogItems/windbreaker_4x3.webp",
    colors: ["#18181b", "#52525b", "#d4d4d8"],
  },
  {
    id: "6ade16d56aa61c77c0317930",
    title: "PURE LINEN SHIRT",
    subtitle: "Relaxed Fit",
    price: 1699,
    image: "/refrenceCatalogItems/floral_shirt_4x3.webp",
    colors: ["#2d3748", "#cbd5e0", "#e2e8f0"],
  },
  {
    id: "6adc8023b4aa805289d00ab1",
    title: "TECHNICAL UTILITY JACKET",
    subtitle: "Water Resistant",
    price: 1100,
    image: "/refrenceCatalogItems/tiwilltang_4x3.webp",
    colors: ["#3f3f46", "#71717a", "#a1a1aa"],
  },
  {
    id: "6ade19af6aa61c77c031793f",
    title: "PURE LINEN T-SHIRT",
    subtitle: "Relaxed Fit",
    price: 699,
    image: "/refrenceCatalogItems/pink_tshirt_4x3.webp",
    colors: ["#9d4b60", "#e2b8c4", "#18181b"],
  },
];

// Eliminates transparent bottom padding for human model shots so they sit flush with the card's bottom border
const getModelOffsetClass = (product) => {
  const url = (product.image || "").toLowerCase();
  const title = (product.title || "").toLowerCase();

  if (url.includes("tiwilltang") || title.includes("noir grid")) {
    return "translate-y-[8.2%] scale-[1.09]";
  }
  if (
    url.includes("floral") ||
    url.includes("s3_3x4") ||
    url.includes("pink_tshirt") ||
    url.includes("ts1_3x4") ||
    url.includes("item_06") ||
    url.includes("item_07") ||
    title.includes("floral") ||
    title.includes("rose signal") ||
    title.includes("coastal stripe") ||
    title.includes("heritage stripe")
  ) {
    return "translate-y-[5.8%] scale-[1.06]";
  }
  return "";
};

export default function RunwayCatalog({
  backendProducts = [],
  wishlistedIds = [],
  onToggleWishlist,
}) {
  const navigate = useNavigate();

  const targetRef = useRef(null);
  const [viewportRef, { width: viewportWidth }] = useMeasure();
  const [trackRef, { width: trackWidth }] = useMeasure();

  // Scroll driven horizontal animation powered by global Lenis smooth momentum
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Direct 1:1 silky glide - synchronized with Lenis inertial lerp
  const x = useTransform(scrollYProgress, (progress) => {
    const maxScroll = Math.max(0, trackWidth - viewportWidth + 64);
    return -progress * maxScroll;
  });

  // Dynamically map backend products if available, fallback to reference items
  const catalogList = useMemo(() => {
    if (backendProducts && backendProducts.length > 0) {
      const defaultColorPalettes = [
        ["#18181b", "#52525b", "#d4d4d8"],
        ["#2d3748", "#cbd5e0", "#e2e8f0"],
        ["#3f3f46", "#71717a", "#a1a1aa"],
        ["#9d4b60", "#e2b8c4", "#18181b"],
        ["#1e293b", "#475569", "#94a3b8"],
        ["#422006", "#78350f", "#d97706"],
      ];

      return backendProducts.map((bp, idx) => {
        const colors =
          Array.isArray(bp.colors) && bp.colors.length > 0
            ? bp.colors
            : defaultColorPalettes[idx % defaultColorPalettes.length];

        return {
          id: bp._id,
          title: (bp.title || "RUNWAY PIECE").toUpperCase(),
          subtitle: bp.subtitle || bp.category || "ATELIER ARCHIVE",
          price: Number(
            bp.price?.amount ?? (typeof bp.price === "number" ? bp.price : 999),
          ),
          image:
            bp.images?.[0]?.url ||
            bp.image ||
            "/refrenceCatalogItems/windbreaker_4x3.webp",
          colors,
          raw: bp,
        };
      });
    }

    return REFERENCE_CATALOG_ITEMS;
  }, [backendProducts]);

  // Restrict to exactly 12 products for the runway horizontal scroll strip
  const displayProducts = useMemo(() => {
    return catalogList.slice(0, 12);
  }, [catalogList]);

  return (
    <section
      ref={targetRef}
      id="catalog"
      className="relative w-full h-[520vh] bg-[#e7e7e0] select-none"
    >
      <div
        ref={viewportRef}
        className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden py-5 sm:py-6 border-b border-zinc-300 bg-[#e7e7e0]"
      >
        {/* Top Header & Controls Bar */}
        <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 shrink-0">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-300 pb-3">
            {/* Section Title */}
            <div className="flex items-baseline gap-3">
              <h2 className="font-michroma text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-tight text-zinc-950">
                RUNWAY CATALOG
              </h2>
              <span className="font-mono text-xs text-zinc-500 font-bold">
                / {displayProducts.length} OF {catalogList.length} PIECES
              </span>
            </div>

            {/* Right: Option B - Small refined editorial meta tag */}
            <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-zinc-500 uppercase tracking-widest">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-950/60" />
              <span>AUTUMN / WINTER 2026 ARCHIVE</span>
            </div>
          </div>
        </div>

        {/* Middle: Horizontal Scrolling Rail of 12 Products */}
        <div className="w-full flex-1 flex items-center overflow-hidden my-auto py-2">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex items-center gap-5 sm:gap-6 pl-4 sm:pl-8 lg:pl-12 pr-12 w-max will-change-transform transform-gpu origin-center"
          >
            {displayProducts.map((product, idx) => {
              const isSaved = wishlistedIds.includes(product.id);
              return (
                <div
                  key={product.id || idx}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="group w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] shrink-0 bg-white border border-zinc-300/90 hover:border-zinc-950 transition-all duration-300 flex flex-col cursor-pointer shadow-2xs hover:shadow-md relative"
                >
                  {/* Sequence Number Tag */}
                  <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-zinc-950/80 text-white font-mono text-[9px] uppercase tracking-wider backdrop-blur-xs">
                    {(idx + 1).toString().padStart(2, "0")} / 12
                  </div>

                  {/* Image Frame - Centered Product Image */}
                  <div className="aspect-[3/4] w-full bg-[#f0eee6] relative overflow-hidden flex items-center justify-center p-2 sm:p-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className={cn(
                        "w-full h-full object-contain transition-transform duration-500 group-hover:scale-105",
                        getModelOffsetClass(product),
                      )}
                      loading="lazy"
                    />

                    {/* Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleWishlist) onToggleWishlist(product.id);
                      }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 hover:bg-white border border-zinc-200 flex items-center justify-center transition-all cursor-pointer z-10"
                      title="Save to Wishlist"
                    >
                      <Heart
                        className={cn(
                          "w-3.5 h-3.5 transition-colors",
                          isSaved
                            ? "fill-red-500 text-red-500"
                            : "text-zinc-600",
                        )}
                      />
                    </button>
                  </div>

                  {/* Product Details Row */}
                  <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 border-t border-zinc-200/80 bg-white">
                    <div>
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-950 truncate">
                        {product.title}
                      </h3>
                      <p className="font-mono text-[10px] text-zinc-500 uppercase mt-0.5 truncate">
                        {product.subtitle}
                      </p>
                    </div>

                    <div className="pt-2.5 flex items-center justify-between border-t border-zinc-100 mt-2">
                      {/* Color Preview Swatch Dots */}
                      <div className="flex items-center gap-1.5">
                        {product.colors.map((clr, i) => (
                          <span
                            key={i}
                            className="w-2.5 h-2.5 rounded-full border border-zinc-300 shadow-2xs inline-block"
                            style={{ backgroundColor: clr }}
                          />
                        ))}
                      </div>

                      {/* Price */}
                      <div className="font-space text-xs font-bold text-zinc-950">
                        ₹{Number(product.price || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* End Card: View All Products */}
            <div
              onClick={() => {
                navigate(`/products/${displayProducts[0]?.id || ""}`);
              }}
              className="w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] aspect-[3/4] shrink-0 bg-zinc-950 text-white border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between cursor-pointer group hover:bg-zinc-900 transition-colors shadow-lg"
            >
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 block">
                  RUNWAY SHOWCASE COMPLETE
                </span>
                <h3 className="font-michroma text-lg sm:text-xl font-bold uppercase tracking-tight text-white leading-snug">
                  EXPLORE FULL
                  <br />
                  ARCHIVE
                </h3>
              </div>

              <div className="space-y-4">
                <p className="font-inter text-xs text-zinc-400 leading-relaxed">
                  Discover all season pieces, limited archival garments, and tailored progressive silhouettes.
                </p>
                <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-white group-hover:translate-x-1 transition-transform">
                  <span>VIEW ALL PRODUCTS</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar: Interactive Scroll Progress Telemetry */}
        <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-zinc-500 pt-2 border-t border-zinc-300 shrink-0">
          <span className="hidden sm:inline">
            SCROLL DOWN TO ADVANCE // 01 — 12
          </span>
          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            <span className="text-zinc-600 font-bold">PROGRESS</span>
            <div className="w-36 sm:w-56 h-[3px] bg-zinc-300 rounded-full overflow-hidden">
              <motion.div
                style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
                className="h-full bg-zinc-950"
              />
            </div>
          </div>
          <span className="hidden md:inline text-zinc-400">
            AUTUMN / WINTER 2026 ARCHIVE
          </span>
        </div>
      </div>
    </section>
  );
}
