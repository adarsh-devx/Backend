import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { X, ArrowRight, Loader2, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { getAllProducts } from "@/features/products/services/product.api";
import UiverseSearchInput from "./UiverseSearchInput";

const POPULAR_TAGS = ["JACKET", "SHIRT", "LINEN", "BLACK", "UTILITY", "OVERSIZED"];

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Access cached products from redux store for instant local lookup
  const reduxProducts = useSelector((state) => state.product?.products || []);

  const handleClose = useCallback(() => {
    setSearchTerm("");
    setSearchResults([]);
    onClose();
  }, [onClose]);

  // Filter local products instantly as user types
  const localFiltered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return reduxProducts.filter(
      (p) =>
        p.title?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
    );
  }, [searchTerm, reduxProducts]);

  // Debounced API search for server-side lookup
  useEffect(() => {
    const term = searchTerm.trim();
    if (!term) return;

    let isMounted = true;
    const timeoutId = setTimeout(async () => {
      try {
        setIsLoading(true);
        const data = await getAllProducts(term);
        if (isMounted) {
          setSearchResults(data.products || []);
        }
      } catch (err) {
        console.error("Search API error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }, 280);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  // Merge results, removing duplicates by _id
  const displayResults = useMemo(() => {
    const term = searchTerm.trim();
    if (!term) return [];

    const combined = [...localFiltered];
    const seen = new Set(combined.map((p) => String(p._id)));
    for (const item of searchResults) {
      if (!seen.has(String(item._id))) {
        combined.push(item);
        seen.add(String(item._id));
      }
    }
    return combined;
  }, [searchTerm, localFiltered, searchResults]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSelectProduct = (productId) => {
    handleClose();
    navigate(`/products/${productId}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#F3F1E9] border-2 border-zinc-950 shadow-[8px_8px_0px_#18181b] overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Search Bar */}
        <div className="p-4 sm:p-5 border-b-2 border-zinc-950 flex items-center justify-between gap-3 bg-[#ebe7dc]">
          <div className="flex-1">
            <UiverseSearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SEARCH PIECES, FABRICS, ARCHIVES..."
              autoFocus
              containerClassName="w-full"
              className="w-full text-xs sm:text-sm tracking-widest uppercase font-mono"
            />
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 border border-zinc-900 bg-white hover:bg-zinc-950 hover:text-white transition-colors cursor-pointer shrink-0 shadow-xs active:translate-y-0.5"
            title="Close Search (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Popular Tags Strip */}
        <div className="px-4 py-2.5 bg-[#f8f6f0] border-b border-zinc-300 flex items-center gap-2 overflow-x-auto text-[11px] font-mono select-none">
          <span className="text-zinc-600 shrink-0 uppercase tracking-wider font-semibold">
            Trending:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchTerm(tag)}
                className="px-2 py-0.5 bg-white hover:bg-zinc-950 hover:text-white border border-zinc-400 text-zinc-800 transition-colors cursor-pointer uppercase tracking-wider"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-zinc-300/80">
          {isLoading && displayResults.length === 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3 px-1">
                <Skeleton className="h-3 w-32 bg-zinc-300/80" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest animate-pulse">
                  Searching Archive...
                </span>
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 sm:p-3 border border-zinc-200/80 bg-white/40"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <Skeleton className="w-12 h-14 sm:w-14 sm:h-16 shrink-0 bg-zinc-300/70" />
                    <div className="space-y-2">
                      <Skeleton className="h-3.5 w-32 sm:w-48 bg-zinc-300/80" />
                      <Skeleton className="h-2.5 w-20 sm:w-28 bg-zinc-300/60" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-14 bg-zinc-300/80" />
                    <Skeleton className="w-4 h-4 bg-zinc-300/60" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm.trim() && displayResults.length === 0 ? (
            <div className="py-12 text-center font-mono">
              <p className="text-sm font-semibold text-zinc-950 uppercase tracking-wider">
                NO PIECES FOUND FOR &quot;{searchTerm}&quot;
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Try searching for jackets, linen, shirts, or utility items.
              </p>
            </div>
          ) : displayResults.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-700 font-bold mb-2">
                MATCHING PIECES ({displayResults.length})
              </p>
              {displayResults.map((product) => {
                const imgUrl =
                  product.images?.[0]?.url ||
                  product.variants?.[0]?.images?.[0]?.url ||
                  "/placeholder.webp";
                const price =
                  product.price?.amount ||
                  product.variants?.[0]?.price?.amount ||
                  0;

                return (
                  <div
                    key={product._id}
                    onClick={() => handleSelectProduct(product._id)}
                    className="group flex items-center justify-between p-2.5 sm:p-3 hover:bg-white border border-transparent hover:border-zinc-900 transition-all cursor-pointer shadow-none hover:shadow-xs"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-12 h-14 sm:w-14 sm:h-16 bg-zinc-200 border border-zinc-300 shrink-0 overflow-hidden">
                        <img
                          src={imgUrl}
                          alt={product.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-950 truncate group-hover:text-black">
                          {product.title}
                        </h4>
                        <p className="text-[11px] text-zinc-500 font-mono line-clamp-1 mt-0.5">
                          {product.description}
                        </p>
                        <p className="font-mono text-xs font-semibold text-zinc-900 mt-1">
                          ₹{Number(price).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 pl-3">
                      <span className="p-1.5 border border-zinc-300 group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white flex items-center justify-center transition-colors">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center font-mono">
              <Search className="w-8 h-8 mx-auto text-zinc-400 mb-2 stroke-[1.5]" />
              <p className="text-xs uppercase tracking-wider text-zinc-700 font-bold">
                TYPE TO EXPLORE THE RUNWAY CATALOG
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Search by piece name, fabric category, or style silhouette.
              </p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Info */}
        <div className="px-4 py-2.5 bg-[#ebe7dc] border-t border-zinc-300 flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
          <span>PRESS [ESC] TO EXIT</span>
          <span>NOIRVAYN ATELIER ARCHIVE</span>
        </div>
      </div>
    </div>
  );
}
