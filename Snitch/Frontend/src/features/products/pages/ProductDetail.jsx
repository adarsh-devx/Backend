import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useProduct } from "../hook/use.product";
import { cn } from "@/lib/utils";
import UiverseSearchInput from "@/components/ui/UiverseSearchInput";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Expand,
  X,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  Ruler,
} from "lucide-react";

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProductById } = useProduct();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isAddedToBag, setIsAddedToBag] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [openAccordions, setOpenAccordions] = useState({
    returnPolicy: true,
    shipping: false,
    manufacturing: false,
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDecrementQty = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrementQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const [activeTab, setActiveTab] = useState("details");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const prod = await handleGetProductById(id);
        if (isMounted) {
          setProduct(prod);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load product",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const images = useMemo(() => {
    if (product?.images && product.images.length > 0) {
      return product.images.map((img) => img.url);
    }
    return ["/assets/hero_black.jpg"];
  }, [product]);

  const activeImg = images[activeImageIdx] || images[0];
  const currencySymbol = product?.price?.currency === "USD" ? "$" : "₹";
  const formattedPrice = Number(product?.price?.amount || 0).toLocaleString();
  const prodId = product?._id ? product._id.slice(-6).toUpperCase() : "PROD-01";

  const availableSizes = useMemo(() => {
    if (product?.variants && product.variants.length > 0) {
      const set = new Set();
      product.variants.forEach((v) => {
        const rawAttrs = v.attributes;
        const attrs =
          rawAttrs instanceof Map
            ? Object.fromEntries(rawAttrs)
            : typeof rawAttrs === "object" && rawAttrs !== null
              ? rawAttrs
              : {};
        const sz = attrs.size || attrs.Size || attrs.SIZE;
        if (sz) set.add(sz.toUpperCase());
      });
      if (set.size > 0) return Array.from(set);
    }
    return ["S", "M", "L", "XL"];
  }, [product]);

  const handleAddToBag = () => {
    setIsAddedToBag(true);
    setTimeout(() => setIsAddedToBag(false), 2500);
  };

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 40) {
      handleNextImage();
    } else if (distance < -40) {
      handlePrevImage();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#e7e7e0] text-zinc-950 flex flex-col font-inter">
        <header className="w-full px-6 py-3 border-b border-zinc-300 bg-[#e7e7e0]/90 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              to="/"
              className="font-michroma text-base font-bold tracking-widest uppercase"
            >
              SNITCH
            </Link>
          </div>
        </header>

        <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start animate-pulse">
          <div className="md:col-span-7 flex gap-3">
            <div className="w-14 hidden md:flex flex-col gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-14 aspect-[3/4] bg-zinc-300" />
              ))}
            </div>
            <div className="flex-1 aspect-[3/4] max-h-[480px] bg-zinc-300 w-full" />
          </div>
          <div className="md:col-span-5 space-y-4">
            <div className="h-4 bg-zinc-300 w-1/4" />
            <div className="h-8 bg-zinc-300 w-3/4" />
            <div className="h-6 bg-zinc-300 w-1/3" />
            <div className="h-20 bg-zinc-300 w-full" />
            <div className="h-11 bg-zinc-300 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen w-full bg-[#e7e7e0] text-zinc-950 flex flex-col font-inter">
        <header className="w-full px-6 py-3 border-b border-zinc-300 bg-[#e7e7e0]/90">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              to="/"
              className="font-michroma text-base font-bold tracking-widest uppercase"
            >
              SNITCH
            </Link>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-3">
          <h2 className="font-michroma text-lg font-bold uppercase text-zinc-950">
            APPAREL NOT FOUND
          </h2>
          <p className="text-xs text-zinc-600 font-inter">
            {error ||
              "The requested product could not be located in the atelier archive."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-5 py-2 bg-zinc-950 text-white font-space text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            &larr; Return to Runway
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#e7e7e0] text-zinc-950 flex flex-col font-inter select-none">
      {/* ── Editorial Header ─────────────────────────────────────────── */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-3 border-b border-zinc-300/80 bg-[#e7e7e0]/95 backdrop-blur-xs sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase text-zinc-700 hover:text-zinc-950 transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RUNWAY ARCHIVE</span>
          </Link>

          {/* Center Brand or Uiverse Inline Search */}
          {isSearchOpen ? (
            <div className="flex-1 max-w-md mx-2 sm:mx-4 flex items-center gap-2 animate-in fade-in">
              <UiverseSearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSubmit={(e) => {
                  if (e) e.preventDefault();
                  if (searchQuery.trim()) {
                    navigate(
                      `/?search=${encodeURIComponent(searchQuery.trim())}`,
                    );
                  }
                }}
                placeholder="search..."
                autoFocus
                containerClassName="flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-1 hover:text-zinc-950 text-zinc-600 transition-colors cursor-pointer shrink-0"
                title="Close Search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/"
              className="font-michroma text-base sm:text-lg font-bold tracking-[0.25em] uppercase text-zinc-950 hover:opacity-80 transition-opacity"
            >
              SNITCH
            </Link>
          )}

          <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-mono shrink-0">
            {!isSearchOpen && (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 hover:text-zinc-950 text-zinc-700 transition-colors cursor-pointer"
                title="Search Collection"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            <div
              className="relative p-1.5 text-zinc-700 hover:text-zinc-950 cursor-pointer transition-colors"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 bg-zinc-950 text-white text-[9px] font-mono font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                1
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Detail Canvas: Refined Reference Layout (Aligned with Navbar) ── */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-start w-full">
          {/* ── Left Column: Gallery Unit (Thumbnails Strip + Main Hero Stage) ── */}
          <div className="md:col-span-7 flex flex-col-reverse md:flex-row gap-3 items-start max-w-[540px] w-full">
            {/* Slim Vertical Thumbnails Ribbon */}
            {images.length > 1 && (
              <div className="w-full md:w-16 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[500px] scrollbar-none pb-1 md:pb-0">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={cn(
                      "w-14 sm:w-16 md:w-full aspect-[3/4] overflow-hidden transition-all shrink-0 cursor-pointer p-0.5",
                      activeImageIdx === idx
                        ? "border border-zinc-950 shadow-xs"
                        : "border border-zinc-300 opacity-70 hover:opacity-100",
                    )}
                  >
                    <img
                      src={imgUrl}
                      alt={`Angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Hero Visual Stage (Seamless - Aligned Left Flush with RUNWAY ARCHIVE) */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="flex-1 max-w-[460px] w-full aspect-[3/4] max-h-[500px] border border-zinc-300 bg-transparent relative select-none group flex items-center justify-center overflow-hidden"
            >
              <img
                src={activeImg}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />

              {/* Expand Fullscreen Button (Top-Right) */}
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-zinc-800 border border-zinc-200/80 flex items-center justify-center shadow-xs transition-all cursor-pointer z-10 hover:scale-105"
                title="Fullscreen Image"
              >
                <Expand className="w-3.5 h-3.5" />
              </button>

              {/* Next & Previous Arrow Controls (Desktop Bottom-Right) */}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-zinc-900 border border-zinc-300 flex items-center justify-center shadow-xs transition-all cursor-pointer hover:scale-105"
                    title="Previous Angle"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-zinc-900 border border-zinc-300 flex items-center justify-center shadow-xs transition-all cursor-pointer hover:scale-105"
                    title="Next Angle"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Mobile Swipe Pagination Indicator Dots */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex sm:hidden items-center gap-1.5 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                  {images.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setActiveImageIdx(dotIdx)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                        activeImageIdx === dotIdx
                          ? "w-4 bg-white"
                          : "w-1.5 bg-white/50 hover:bg-white/80",
                      )}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column: Unboxed Seamless Product Details (Exact Reference Spacing & Placing) ── */}
          <div className="md:col-span-5 order-3 w-full max-w-[400px]">
            {/* Product Title */}
            <h1 className="font-syne text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 uppercase leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="font-space text-sm sm:text-base font-semibold text-zinc-700 tracking-tight mt-1.5 sm:mt-2">
              {currencySymbol}
              {formattedPrice}
            </div>

            {/* Divider Line under Price */}
            <div className="w-full border-b border-zinc-300 mt-4 sm:mt-5" />

            {/* Size Selector */}
            <div className="mt-6 sm:mt-7">
              <label className="block text-xs font-space font-semibold uppercase tracking-wider text-zinc-800 mb-2">
                Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "h-11 border font-space font-bold text-xs uppercase transition-all flex items-center justify-center cursor-pointer",
                      selectedSize === size
                        ? "bg-zinc-950 text-white border-zinc-950 shadow-2xs"
                        : "bg-white text-zinc-800 border-zinc-200 hover:border-zinc-800",
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Find Your Size */}
              <div className="mt-3">
                <button
                  type="button"
                  className="inline-flex flex-col items-start gap-1 group cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase text-zinc-800 group-hover:text-black">
                    <Ruler className="w-3.5 h-3.5 text-zinc-700" />
                    <span>FIND YOUR SIZE</span>
                  </span>
                  <span className="w-20 h-[2px] bg-zinc-900 group-hover:bg-black transition-colors" />
                </button>
              </div>
            </div>

            {/* Stepper + Add to Cart Row & Buy It Now */}
            <div className="mt-6 sm:mt-7 space-y-2.5">
              <div className="flex items-center gap-2.5">
                {/* Quantity Stepper */}
                <div className="flex items-center justify-between border border-zinc-300 bg-white h-11 px-3 w-28 shrink-0 shadow-2xs">
                  <button
                    type="button"
                    onClick={handleDecrementQty}
                    disabled={quantity <= 1}
                    className="w-5 h-5 flex items-center justify-center text-zinc-500 hover:text-black disabled:opacity-30 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-space font-bold text-xs text-zinc-950">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrementQty}
                    className="w-5 h-5 flex items-center justify-center text-zinc-500 hover:text-black cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  type="button"
                  onClick={handleAddToBag}
                  className={cn(
                    "flex-1 h-11 px-4 font-space text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]",
                    isAddedToBag
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-950 text-white hover:bg-zinc-800",
                  )}
                >
                  {isAddedToBag ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to cart</span>
                    </>
                  )}
                </button>
              </div>

              {/* Buy it now (Full-width button) */}
              <button
                type="button"
                onClick={handleAddToBag}
                className="w-full h-11 bg-zinc-950 hover:bg-zinc-800 text-white font-space text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-[0.99]"
              >
                <span>Buy it now</span>
              </button>
            </div>

            {/* Clean Accordions (Return policy, Shipping, Manufacturing) */}
            <div className="mt-8 divide-y divide-zinc-200 border-t border-zinc-200">
              {/* Return policy */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion("returnPolicy")}
                  className="w-full flex items-center justify-between text-left font-space text-xs font-bold uppercase tracking-wider text-zinc-950 cursor-pointer"
                >
                  <span>Return policy</span>
                  {openAccordions.returnPolicy ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </button>
                {openAccordions.returnPolicy && (
                  <p className="mt-2 text-xs font-inter text-zinc-600 leading-relaxed animate-in fade-in duration-200">
                    Our goal is for every customer to be totally satisfied with
                    their purchase. If this isn't the case, let us know and
                    we'll do our best to work with you to make it right.
                  </p>
                )}
              </div>

              {/* Shipping */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full flex items-center justify-between text-left font-space text-xs font-bold uppercase tracking-wider text-zinc-950 cursor-pointer"
                >
                  <span>Shipping</span>
                  {openAccordions.shipping ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </button>
                {openAccordions.shipping && (
                  <p className="mt-2 text-xs font-inter text-zinc-600 leading-relaxed animate-in fade-in duration-200">
                    Dispatched from our central atelier within 24 hours.
                    Complimentary express courier delivery with live telemetry
                    tracking. Delivery usually takes 2-4 business days.
                  </p>
                )}
              </div>

              {/* Manufacturing / Product Details */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion("manufacturing")}
                  className="w-full flex items-center justify-between text-left font-space text-xs font-bold uppercase tracking-wider text-zinc-950 cursor-pointer"
                >
                  <span>Manufacturing</span>
                  {openAccordions.manufacturing ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </button>
                {openAccordions.manufacturing && (
                  <p className="mt-2 text-xs font-inter text-zinc-600 leading-relaxed animate-in fade-in duration-200">
                    {product.description ||
                      "Engineered with bespoke architectural seams and reinforced stitching. Features ergonomic chest draping, custom matte hardware buttons, and an oversized minimalist silhouette tailored for progressive streetwear styling."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-zinc-300 py-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-[#e7e7e0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <span>SNITCH ATELIER // SPECIFICATION ARCHIVE</span>
          <span>&copy; 2026 SNITCH // ALL RIGHTS RESERVED</span>
        </div>
      </footer>

      {/* ── Fullscreen Lightbox Modal ───────────────────────────────── */}
      {isFullscreen && (
        <div
          onClick={() => setIsFullscreen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
        >
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-zinc-950 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={activeImg}
            alt={product.title}
            className="max-h-[85vh] max-w-[85vw] object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
