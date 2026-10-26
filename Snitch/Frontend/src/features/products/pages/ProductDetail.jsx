import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useProduct } from "../hook/use.product";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Share2,
  Check,
  ShoppingBag,
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProductById } = useProduct();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isAddedToBag, setIsAddedToBag] = useState(false);

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

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#e7e7e0] text-zinc-950 flex flex-col font-inter">
        <header className="w-full px-6 py-3 border-b border-zinc-300 bg-[#e7e7e0]/90 sticky top-0 z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link
              to="/"
              className="font-michroma text-base font-bold tracking-widest uppercase"
            >
              SNITCH
            </Link>
          </div>
        </header>

        <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start animate-pulse">
          <div className="md:col-span-6 aspect-[3/4] max-h-[390px] bg-zinc-300 w-full" />
          <div className="md:col-span-6 space-y-3">
            <div className="h-4 bg-zinc-300 w-1/4" />
            <div className="h-7 bg-zinc-300 w-3/4" />
            <div className="h-6 bg-zinc-300 w-1/3" />
            <div className="h-16 bg-zinc-300 w-full" />
            <div className="h-10 bg-zinc-300 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen w-full bg-[#e7e7e0] text-zinc-950 flex flex-col font-inter">
        <header className="w-full px-6 py-3 border-b border-zinc-300 bg-[#e7e7e0]/90">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
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
      {/* ── Compact Header ─────────────────────────────────────────── */}
      <header className="w-full px-6 sm:px-10 py-3 border-b border-zinc-300 bg-[#e7e7e0]/95 backdrop-blur-xs sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase text-zinc-700 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RUNWAY ARCHIVE</span>
          </Link>

          <Link
            to="/"
            className="font-michroma text-base sm:text-lg font-bold tracking-[0.25em] uppercase text-zinc-950"
          >
            SNITCH
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 border border-zinc-300 bg-white hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Share Product"
            >
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Detail Canvas: Zero-Scroll Proportions ── */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* Left Column: Visual Showcase Gallery (Compact Bounded Stage) */}
          <div className="md:col-span-6 space-y-2.5">
            {/* Primary Media Stage (Bounded to max 390px height to eliminate scrollbar) */}
            <div className="w-full aspect-[3/4] max-h-[350px] sm:max-h-[390px] bg-[#eae9e2] border border-zinc-300 overflow-hidden relative shadow-xs flex items-center justify-center">
              <img
                src={activeImg}
                alt={product.title}
                className="w-full h-full object-contain p-2 transition-transform duration-500 hover:scale-105"
              />

              {/* Technical Badge */}
              <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 font-mono text-[9px] font-bold">
                <span className="bg-zinc-950 text-white px-2 py-0.5 tracking-widest uppercase">
                  PRODUCT // {prodId}
                </span>
                <span className="bg-white/90 backdrop-blur-xs text-zinc-900 px-1.5 py-0.5 border border-zinc-200">
                  {activeImageIdx + 1}/{images.length}
                </span>
              </div>
            </div>

            {/* Compact Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={cn(
                      "w-12 sm:w-14 aspect-[3/4] bg-[#eae9e2] border overflow-hidden transition-all shrink-0 cursor-pointer p-0.5",
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
          </div>

          {/* Right Column: Compact Editorial Specs, Price & Actions */}
          <div className="md:col-span-6 space-y-4 bg-white p-4 sm:p-5 border border-zinc-300 shadow-xs">
            {/* Header & Title */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                  RUNWAY ARCHIVE
                </span>
                <span className="text-zinc-300">/</span>
                <span className="font-mono text-[9px] text-zinc-500">
                  FW//26
                </span>
              </div>

              <h1 className="font-michroma text-lg sm:text-xl font-bold tracking-tight text-zinc-950 uppercase leading-snug">
                {product.title}
              </h1>

              <div className="font-space text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight pt-0.5">
                {currencySymbol}
                {formattedPrice}
                <span className="text-[10px] font-mono text-zinc-400 font-normal ml-2">
                  TAX INCL.
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-b border-zinc-200 py-2.5 space-y-1">
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-400 block">
                EDITORIAL SYNOPSIS
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed font-inter line-clamp-3">
                {product.description ||
                  "High-specification modern silhouette constructed with meticulous precision for urban utility."}
              </p>
            </div>

            {/* Product Meta Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-zinc-50 border border-zinc-200">
                <span className="text-[9px] text-zinc-400 uppercase block tracking-wider">
                  SELLER ATELIER
                </span>
                <span className="font-bold text-zinc-900 truncate block text-[10px]">
                  {product.seller?.fullName || "Verified Artisan"}
                </span>
              </div>

              <div className="p-2 bg-zinc-50 border border-zinc-200">
                <span className="text-[9px] text-zinc-400 uppercase block tracking-wider">
                  ASSET COUNT
                </span>
                <span className="font-bold text-zinc-900 text-[10px]">
                  {images.length} High-Res{" "}
                  {images.length === 1 ? "Angle" : "Angles"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-0.5">
              <button
                type="button"
                onClick={handleAddToBag}
                className={cn(
                  "w-full py-2.5 font-space text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs",
                  isAddedToBag
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-950 text-white hover:bg-zinc-800",
                )}
              >
                {isAddedToBag ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>
                      ACQUIRE PIECE // {currencySymbol}
                      {formattedPrice}
                    </span>
                  </>
                )}
              </button>

              <Link
                to="/"
                className="w-full py-1.5 border border-zinc-300 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 font-space text-[10px] font-bold uppercase tracking-wider text-center block transition-colors"
              >
                &larr; BACK TO RUNWAY
              </Link>
            </div>

            {/* Technical Trust Strip */}
            <div className="pt-2.5 border-t border-zinc-200 grid grid-cols-3 gap-2 text-[9px] font-mono text-zinc-600 text-center">
              <div>
                <ShieldCheck className="w-3 h-3 mx-auto text-zinc-800 mb-0.5" />
                <span className="block uppercase font-bold text-zinc-900 text-[8px]">
                  AUTHENTIC
                </span>
                <span className="text-[8px] text-zinc-400">
                  Atelier Verified
                </span>
              </div>
              <div>
                <Truck className="w-3 h-3 mx-auto text-zinc-800 mb-0.5" />
                <span className="block uppercase font-bold text-zinc-900 text-[8px]">
                  DISPATCH
                </span>
                <span className="text-[8px] text-zinc-400">Within 24h</span>
              </div>
              <div>
                <RotateCcw className="w-3 h-3 mx-auto text-zinc-800 mb-0.5" />
                <span className="block uppercase font-bold text-zinc-900 text-[8px]">
                  RETURNS
                </span>
                <span className="text-[8px] text-zinc-400">
                  7-Day Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-zinc-300 bg-[#dfded7] py-3 px-6 text-[9px] font-mono text-zinc-600">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900 uppercase">
              SNITCH ATELIER
            </span>
            <span className="text-zinc-400">/</span>
            <span>SPECIFICATION ARCHIVE</span>
          </div>
          <span>
            &copy; {new Date().getFullYear()} SNITCH // ALL RIGHTS RESERVED
          </span>
        </div>
      </footer>
    </div>
  );
}
