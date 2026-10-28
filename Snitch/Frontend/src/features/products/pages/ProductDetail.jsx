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
  ShieldCheck,
  Truck,
  RotateCcw,
  Share2,
  Check,
  ShoppingBag,
  Heart,
  Search,
  Expand,
  X,
  Star,
  Leaf,
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
  const [isCopied, setIsCopied] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToBag, setIsAddedToBag] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);

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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleAddToBag = () => {
    setIsAddedToBag(true);
    setTimeout(() => setIsAddedToBag(false), 2500);
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
      <header className="w-full px-4 sm:px-8 lg:px-12 py-3 border-b border-zinc-300/80 bg-[#e7e7e0]/95 backdrop-blur-xs sticky top-0 z-30">
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
                    navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
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
                className="p-1 hover:text-zinc-950 text-zinc-400 transition-colors cursor-pointer shrink-0"
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

            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 hover:text-zinc-950 text-zinc-700 transition-colors cursor-pointer"
              title="Share Product"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            {/* Top Wishlist Viewer with Saved Count Badge */}
            <button
              type="button"
              onClick={() => setIsWishlistDrawerOpen(true)}
              className="relative p-1.5 hover:text-zinc-950 text-zinc-700 transition-colors cursor-pointer"
              title="Wishlist Archive"
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-colors",
                  isWishlisted ? "fill-red-500 text-red-500" : "text-zinc-700",
                )}
              />
              {isWishlisted && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-mono font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center animate-in zoom-in-50">
                  1
                </span>
              )}
            </button>

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

      {/* ── Main Detail Canvas: Refined Reference Layout ── */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 items-start">
          {/* ── Left Column: Gallery Unit (Thumbnails Strip + Main Hero Stage) ── */}
          <div className="md:col-span-7 flex flex-col-reverse md:flex-row gap-2.5 sm:gap-3 items-start w-full">
            {/* Slim Vertical Thumbnails Ribbon */}
            {images.length > 1 && (
              <div className="w-full md:w-16 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[480px] scrollbar-none pb-1 md:pb-0">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={cn(
                      "w-14 sm:w-16 md:w-full aspect-[3/4] bg-[#eae9e2] border overflow-hidden transition-all shrink-0 cursor-pointer p-0.5",
                      activeImageIdx === idx
                        ? "border-zinc-950 ring-1 ring-zinc-950 shadow-xs"
                        : "border-zinc-300 opacity-70 hover:opacity-100",
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

            {/* Main Hero Visual Stage */}
            <div className="flex-1 w-full aspect-[3/4] max-h-[480px] bg-[#eae9e2] border border-zinc-300 overflow-hidden relative shadow-xs flex items-center justify-center">
              <img
                src={activeImg}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />

              {/* Technical Badges (Top-Left) */}
              <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 font-mono text-[9px] font-bold">
                <span className="bg-zinc-950 text-white px-2 py-0.5 tracking-widest uppercase">
                  PRODUCT // {prodId}
                </span>
                <span className="bg-white/90 backdrop-blur-xs text-zinc-900 px-1.5 py-0.5 border border-zinc-200">
                  {activeImageIdx + 1}/{images.length}
                </span>
              </div>

              {/* Expand Fullscreen Button (Top-Right) */}
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-zinc-800 border border-zinc-200/80 flex items-center justify-center shadow-xs transition-all cursor-pointer z-10 hover:scale-105"
                title="Fullscreen Image"
              >
                <Expand className="w-3.5 h-3.5" />
              </button>

              {/* Next & Previous Arrow Controls (Bottom-Right) */}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
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
            </div>
          </div>

          {/* ── Right Column: Unboxed Seamless Product Details (5 cols) ── */}
          <div className="md:col-span-5 order-3 space-y-3.5 sm:space-y-4">
            {/* Top Breadcrumb & Wishlist Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                <span>RUNWAY ARCHIVE</span>
                <span className="text-zinc-400">/</span>
                <span className="text-zinc-500">FW/26</span>
              </div>

              <button
                type="button"
                onClick={() => setIsWishlisted((prev) => !prev)}
                className="w-8 h-8 rounded-full bg-white/70 hover:bg-white border border-zinc-300 flex items-center justify-center shadow-xs transition-all cursor-pointer"
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isWishlisted
                      ? "fill-red-500 text-red-500"
                      : "text-zinc-600 hover:text-zinc-950",
                  )}
                />
              </button>
            </div>

            {/* Product Title */}
            <h1 className="font-michroma text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 uppercase leading-tight">
              {product.title}
            </h1>

            {/* Price & Rating Row */}
            <div className="flex items-baseline justify-between gap-2 border-b border-zinc-300/80 pb-3">
              <div className="font-space text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight flex items-baseline gap-2">
                <span>
                  {currencySymbol}
                  {formattedPrice}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 font-normal uppercase">
                  TAX INCL.
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs font-mono text-zinc-700">
                <Star className="w-3.5 h-3.5 fill-zinc-950 text-zinc-950" />
                <span className="font-bold text-zinc-950">4.6</span>
                <span className="text-zinc-500 text-[11px]">(128 reviews)</span>
              </div>
            </div>

            {/* Editorial Synopsis */}
            <div className="space-y-1">
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-500 block">
                EDITORIAL SYNOPSIS
              </span>
              <p className="text-xs text-zinc-700 leading-relaxed font-inter">
                {product.description ||
                  "Crafted from premium fabric, this silhouette offers breathable comfort, a relaxed structural cut, and timeless architectural style. Engineered for everyday wear and tactical layering."}
              </p>
            </div>

            {/* Color & Size Selectors Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-zinc-300/80">
              {/* Color Swatches */}
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-700 block">
                  COLOR: <span className="text-zinc-950">ARCHIVE TONE</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {images.slice(0, 4).map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={cn(
                        "w-7 h-9 border overflow-hidden p-0.5 bg-[#eae9e2] transition-all cursor-pointer",
                        activeImageIdx === idx
                          ? "border-zinc-950 ring-1 ring-zinc-950"
                          : "border-zinc-300 opacity-75 hover:opacity-100",
                      )}
                    >
                      <img
                        src={url}
                        alt="Color variation"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden sm:block h-10 w-[1px] bg-zinc-300/80" />

              {/* Size Selectors */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 font-mono text-[10px]">
                  <span className="font-bold uppercase tracking-wider text-zinc-700">
                    SIZE
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("fabric")}
                    className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer uppercase text-[9px]"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Size Guide</span>
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-7 sm:w-8 h-8 font-mono text-[11px] font-bold uppercase transition-all flex items-center justify-center cursor-pointer",
                        selectedSize === size
                          ? "bg-zinc-950 text-white"
                          : "bg-white/80 hover:bg-white text-zinc-800 border border-zinc-300",
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons: Primary Buy + Secondary Wishlist */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleAddToBag}
                className={cn(
                  "w-full h-11 px-5 font-space text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-between cursor-pointer shadow-xs active:scale-[0.99]",
                  isAddedToBag
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-950 text-white hover:bg-zinc-800",
                )}
              >
                <div className="flex items-center gap-2">
                  {isAddedToBag ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ShoppingBag className="w-4 h-4" />
                  )}
                  <span>
                    {isAddedToBag ? "ADDED TO BAG" : "BUY NOW"}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsWishlisted((prev) => !prev)}
                className="w-full h-10 border border-zinc-300 bg-white/70 hover:bg-white text-zinc-800 font-space text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Heart
                  className={cn(
                    "w-3.5 h-3.5 transition-colors",
                    isWishlisted ? "fill-red-500 text-red-500" : "text-zinc-600",
                  )}
                />
                <span>
                  {isWishlisted ? "SAVED IN WISHLIST" : "ADD TO WISHLIST"}
                </span>
              </button>
            </div>

            {/* Technical Trust Strip (4 items) */}
            <div className="pt-3 border-t border-zinc-300/80 grid grid-cols-4 gap-2 text-[9px] font-mono text-zinc-600 text-center">
              <div>
                <ShieldCheck className="w-3.5 h-3.5 mx-auto text-zinc-800 mb-0.5" />
                <span className="block uppercase font-bold text-zinc-900 text-[8px]">
                  AUTHENTIC
                </span>
                <span className="text-[8px] text-zinc-500">Atelier Verified</span>
              </div>
              <div>
                <Truck className="w-3.5 h-3.5 mx-auto text-zinc-800 mb-0.5" />
                <span className="block uppercase font-bold text-zinc-900 text-[8px]">
                  DISPATCH
                </span>
                <span className="text-[8px] text-zinc-500">Within 24h</span>
              </div>
              <div>
                <RotateCcw className="w-3.5 h-3.5 mx-auto text-zinc-800 mb-0.5" />
                <span className="block uppercase font-bold text-zinc-900 text-[8px]">
                  RETURNS
                </span>
                <span className="text-[8px] text-zinc-500">7-Day Guarantee</span>
              </div>
              <div>
                <Leaf className="w-3.5 h-3.5 mx-auto text-zinc-800 mb-0.5" />
                <span className="block uppercase font-bold text-zinc-900 text-[8px]">
                  SUSTAINABLE
                </span>
                <span className="text-[8px] text-zinc-500">Ethically Sourced</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Editorial Tabs (Details, Fabric & Care, Shipping, Reviews) ── */}
        <div className="mt-8 sm:mt-10 pt-4 border-t border-zinc-300/80">
          <div className="flex items-center justify-center gap-6 sm:gap-10 font-mono text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-300/60 pb-2.5">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={cn(
                "pb-2.5 -mb-3 transition-colors cursor-pointer",
                activeTab === "details"
                  ? "border-b-2 border-zinc-950 font-bold text-zinc-950"
                  : "hover:text-zinc-950",
              )}
            >
              DETAILS
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("fabric")}
              className={cn(
                "pb-2.5 -mb-3 transition-colors cursor-pointer",
                activeTab === "fabric"
                  ? "border-b-2 border-zinc-950 font-bold text-zinc-950"
                  : "hover:text-zinc-950",
              )}
            >
              FABRIC & CARE
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("shipping")}
              className={cn(
                "pb-2.5 -mb-3 transition-colors cursor-pointer",
                activeTab === "shipping"
                  ? "border-b-2 border-zinc-950 font-bold text-zinc-950"
                  : "hover:text-zinc-950",
              )}
            >
              SHIPPING & RETURNS
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={cn(
                "pb-2.5 -mb-3 transition-colors cursor-pointer",
                activeTab === "reviews"
                  ? "border-b-2 border-zinc-950 font-bold text-zinc-950"
                  : "hover:text-zinc-950",
              )}
            >
              REVIEWS (128)
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="py-4 text-xs font-inter text-zinc-700 max-w-2xl mx-auto text-center leading-relaxed">
            {activeTab === "details" && (
              <p>
                Engineered with bespoke architectural seams and reinforced stitching. Features ergonomic chest draping, custom matte hardware buttons, and an oversized minimalist silhouette tailored for progressive streetwear styling.
              </p>
            )}
            {activeTab === "fabric" && (
              <p>
                100% High-Grade Raw Linen Blend. Machine wash cold with like colors on delicate cycle. Do not bleach. Air dry in shade to preserve natural texture. Warm iron on reverse side if needed.
              </p>
            )}
            {activeTab === "shipping" && (
              <p>
                Dispatched from the central Snitch atelier within 24 hours. Complimentary express courier delivery with live GPS telemetry. 7-day hassle-free returns on unworn items with tags intact.
              </p>
            )}
            {activeTab === "reviews" && (
              <p>
                Rated ★ 4.6/5 by 128 verified collectors. Praised for ultra-breathable tactile fabric feel, true-to-size boxy drape, and exceptional longevity through continuous wear.
              </p>
            )}
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

      {/* ── Wishlist Archive Drawer ─────────────────────────────────── */}
      {isWishlistDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setIsWishlistDrawerOpen(false)}
          />
          <aside className="relative w-full max-w-sm bg-[#e7e7e0] border-l border-zinc-300 h-full p-5 sm:p-6 flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-zinc-300 pb-4">
              <div>
                <span className="font-michroma text-sm font-bold uppercase tracking-wider text-zinc-950">
                  WISHLIST ARCHIVE
                </span>
                <p className="font-mono text-[10px] text-zinc-500 uppercase mt-0.5">
                  {isWishlisted ? "1 APPAREL CURATED" : "EMPTY ARCHIVE"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsWishlistDrawerOpen(false)}
                className="p-1.5 hover:bg-zinc-300/60 rounded-full transition-colors cursor-pointer text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 py-4 overflow-y-auto">
              {isWishlisted ? (
                <div className="border border-zinc-300 bg-white/70 p-3 flex gap-3 items-center shadow-2xs">
                  <img
                    src={activeImg}
                    alt={product.title}
                    className="w-14 aspect-[3/4] object-cover bg-zinc-200 border border-zinc-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-mono text-xs font-bold uppercase truncate text-zinc-950">
                      {product.title}
                    </h4>
                    <p className="font-space text-xs font-bold text-zinc-900 mt-1">
                      {currencySymbol}{formattedPrice}
                    </p>
                    <span className="font-mono text-[9px] text-zinc-500 uppercase">
                      SIZE: {selectedSize}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsWishlisted(false)}
                    className="p-1.5 hover:text-red-500 text-zinc-400 transition-colors cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="h-56 flex flex-col items-center justify-center text-center font-mono text-xs text-zinc-500 space-y-2.5">
                  <Heart className="w-8 h-8 text-zinc-400 stroke-1" />
                  <span className="font-bold text-zinc-700">NO PIECES CURATED YET</span>
                  <span className="text-[10px] text-zinc-500 max-w-xs">
                    USE THE HEART ICON ON ANY APPAREL TO SAVE IT TO YOUR PERSONAL ARCHIVE.
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-300 pt-4 space-y-2">
              {isWishlisted && (
                <button
                  type="button"
                  onClick={() => {
                    setIsWishlistDrawerOpen(false);
                    handleAddToBag();
                  }}
                  className="w-full h-10 bg-zinc-950 hover:bg-zinc-800 text-white font-space text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>TRANSFER TO BAG</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsWishlistDrawerOpen(false)}
                className="w-full h-9 border border-zinc-300 bg-white/70 hover:bg-white text-zinc-800 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                RETURN TO APPAREL
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
