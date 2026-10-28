import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { SlidersHorizontal, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import UiverseSearchInput from "@/components/ui/UiverseSearchInput";

const REFERENCE_CATALOG_ITEMS = [
  {
    id: "6adc7fa06ef2657b685ff2b8",
    title: "BRANDED BLACK JACKET",
    subtitle: "Technical Shell",
    price: 1111,
    image: "/refrenceCatalogItems/windbreaker_4x3.png",
    colors: ["#18181b", "#52525b", "#d4d4d8"],
  },
  {
    id: "6ade16d56aa61c77c0317930",
    title: "PURE LINEN SHIRT",
    subtitle: "Relaxed Fit",
    price: 1699,
    image: "/refrenceCatalogItems/floral_shirt_4x3.png",
    colors: ["#2d3748", "#cbd5e0", "#e2e8f0"],
  },
  {
    id: "6adc8023b4aa805289d00ab1",
    title: "TECHNICAL UTILITY JACKET",
    subtitle: "Water Resistant",
    price: 1100,
    image: "/refrenceCatalogItems/tiwilltang_4x3.png",
    colors: ["#3f3f46", "#71717a", "#a1a1aa"],
  },
  {
    id: "6ade19af6aa61c77c031793f",
    title: "PURE LINEN T-SHIRT",
    subtitle: "Relaxed Fit",
    price: 699,
    image: "/refrenceCatalogItems/pink_tshirt_4x3.png",
    colors: ["#9d4b60", "#e2b8c4", "#18181b"],
  },
];

export default function RunwayCatalog({
  backendProducts = [],
  wishlistedIds = [],
  onToggleWishlist,
}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Merge reference items with real backend products if available
  const catalogList = useMemo(() => {
    // If backend has products, map or use reference
    let items = REFERENCE_CATALOG_ITEMS.map((item) => {
      // Find matching backend product if any
      const match = backendProducts.find(
        (bp) =>
          bp._id === item.id ||
          bp.title?.toLowerCase() === item.title.toLowerCase(),
      );
      if (match) {
        return {
          ...item,
          id: match._id,
          title: match.title.toUpperCase(),
          price: match.price?.amount || item.price,
        };
      }
      return item;
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.subtitle.toLowerCase().includes(q),
      );
    }

    if (selectedFilter !== "all") {
      items = items.filter((i) =>
        i.subtitle.toLowerCase().includes(selectedFilter.toLowerCase()),
      );
    }

    return items;
  }, [backendProducts, searchQuery, selectedFilter]);

  return (
    <section id="catalog" className="w-full bg-[#e7e7e0] border-b border-zinc-300 py-10 sm:py-14 select-none">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 space-y-6">
        {/* Catalog Header & Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-300 pb-4">
          {/* Section Title */}
          <div className="flex items-baseline gap-3">
            <h2 className="font-michroma text-xl sm:text-2xl font-bold uppercase tracking-tight text-zinc-950">
              RUNWAY CATALOG
            </h2>
            <span className="font-mono text-xs text-zinc-500 font-bold">
              / 24 PIECES
            </span>
          </div>

          {/* Right Toolbar: Search, Filter, View Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <UiverseSearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="search products..."
              containerClassName="w-44 sm:w-56"
            />

            {/* Filters Button */}
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "font-mono text-xs font-bold uppercase tracking-wider px-3 py-1.5 border transition-colors flex items-center gap-1.5 cursor-pointer",
                isFilterOpen
                  ? "bg-zinc-950 text-white border-zinc-950"
                  : "bg-white text-zinc-800 border-zinc-300 hover:border-zinc-950",
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>FILTERS</span>
            </button>
          </div>
        </div>

        {/* Filter Drawer / Options */}
        {isFilterOpen && (
          <div className="p-3 bg-white border border-zinc-300 flex items-center gap-3 font-mono text-xs animate-in fade-in">
            <span className="text-zinc-500 font-bold uppercase">CATEGORY:</span>
            {["all", "shell", "fit", "jacket", "pants"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={cn(
                  "px-2.5 py-1 uppercase tracking-wider transition-colors cursor-pointer",
                  selectedFilter === cat
                    ? "bg-zinc-950 text-white font-bold"
                    : "text-zinc-700 hover:bg-zinc-100",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {catalogList.map((product) => {
            const isSaved = wishlistedIds.includes(product.id);
            return (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="group bg-white border border-zinc-300/90 hover:border-zinc-950 transition-all duration-300 flex flex-col cursor-pointer shadow-2xs hover:shadow-md relative"
              >
                {/* Image Frame */}
                <div className="aspect-[3/4] w-full bg-[#f0eee6] relative overflow-hidden flex items-end justify-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain object-bottom transition-transform duration-500 group-hover:scale-105 origin-bottom"
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
                        isSaved ? "fill-red-500 text-red-500" : "text-zinc-600",
                      )}
                    />
                  </button>
                </div>

                {/* Product Details Row */}
                <div className="p-3.5 flex flex-col justify-between flex-1 border-t border-zinc-200/80 bg-white">
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-950 truncate">
                      {product.title}
                    </h3>
                    <p className="font-mono text-[10px] text-zinc-500 uppercase mt-0.5">
                      {product.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t border-zinc-100 mt-2">
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
                      ₹{product.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Products Bottom Link */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedFilter("all");
            }}
            className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-950 hover:opacity-75 transition-opacity inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>VIEW ALL PRODUCTS</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
}
