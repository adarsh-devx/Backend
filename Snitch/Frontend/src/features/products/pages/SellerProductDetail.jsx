import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useProduct } from "../hook/use.product";
import { cn } from "@/lib/utils";
import gsap from "gsap";

// Icons
import {
  ArrowLeft,
  Plus,
  PackageOpen,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Eye,
  ExternalLink,
} from "lucide-react";

// Components
import CreateVariantDrawer from "../components/CreateVariantDrawer";
import { Skeleton } from "@/components/ui/Skeleton";

// Safe helper to extract attributes object from variant
const getVariantAttrs = (v) => {
  if (!v || !v.attributes) return {};
  if (v.attributes instanceof Map) {
    return Object.fromEntries(v.attributes);
  }
  if (typeof v.attributes === "object" && !Array.isArray(v.attributes)) {
    return { ...v.attributes };
  }
  return {};
};

export default function SellerProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const {
    handleGetSellerProductById,
    handleAddVariant,
    handleUpdateVariantStock,
    handleDeleteVariant,
  } = useProduct();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAttrs, setSelectedAttrs] = useState({});

  // GSAP animation refs
  const heroImgRef = useRef(null);

  // Fetch product detail strictly for owner
  const fetchProduct = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const prod = await handleGetSellerProductById(productId);
      setProduct(prod);
    } catch (err) {
      console.error("Error fetching seller product details:", err);
      if (err?.response?.status === 403) {
        setAuthError(
          "You do not own this collection or garment. Access is strictly restricted to the verified atelier owner.",
        );
      } else {
        setAuthError(
          err?.response?.data?.message ||
            "Product not found or inaccessible in seller atelier.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const hasVariants = Boolean(product?.variants && product.variants.length > 0);

  // Dynamically group attributes across all variants from database
  const attributeGroups = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return [];

    const keyMap = new Map();
    const valuesMap = new Map();

    product.variants.forEach((v) => {
      const attrs = getVariantAttrs(v);
      Object.entries(attrs).forEach(([k, val]) => {
        if (!val) return;
        const normKey = String(k).trim().toLowerCase();
        if (!keyMap.has(normKey)) {
          const pretty = String(k).charAt(0).toUpperCase() + String(k).slice(1);
          keyMap.set(normKey, pretty);
          valuesMap.set(normKey, new Set());
        }
        valuesMap.get(normKey).add(String(val).trim());
      });
    });

    const priority = ["color", "size", "fit", "fabric"];
    const sortedKeys = Array.from(keyMap.keys()).sort((a, b) => {
      const idxA = priority.indexOf(a);
      const idxB = priority.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    return sortedKeys.map((normKey) => ({
      key: normKey,
      displayName: keyMap.get(normKey),
      values: Array.from(valuesMap.get(normKey)),
    }));
  }, [product]);

  // Initialize selectedAttrs when product loads
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const firstInStock =
        product.variants.find((v) => (v.stock || 0) > 0) || product.variants[0];
      const vAttrs = getVariantAttrs(firstInStock);
      const initObj = {};
      Object.entries(vAttrs).forEach(([k, val]) => {
        initObj[String(k).trim().toLowerCase()] = String(val).trim();
      });
      setSelectedAttrs(initObj);
    } else {
      setSelectedAttrs({});
    }
  }, [product]);

  // Resolve currently active variant based on selected attributes
  const activeVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;

    // 1. Exact match
    const exact = product.variants.find((v) => {
      const vAttrs = getVariantAttrs(v);
      const normVAttrs = {};
      Object.entries(vAttrs).forEach(([k, val]) => {
        normVAttrs[String(k).trim().toLowerCase()] = String(val).trim().toLowerCase();
      });

      return Object.entries(selectedAttrs).every(([key, val]) => {
        if (!normVAttrs[key]) return true;
        return normVAttrs[key] === String(val).toLowerCase();
      });
    });

    if (exact) return exact;

    // 2. Score-based fallback
    let best = product.variants[0];
    let highestScore = -1;
    product.variants.forEach((v) => {
      const vAttrs = getVariantAttrs(v);
      const normVAttrs = {};
      Object.entries(vAttrs).forEach(([k, val]) => {
        normVAttrs[String(k).trim().toLowerCase()] = String(val).trim().toLowerCase();
      });
      let score = 0;
      Object.entries(selectedAttrs).forEach(([key, val]) => {
        if (normVAttrs[key] && normVAttrs[key] === String(val).toLowerCase()) {
          score++;
        }
      });
      if (score > highestScore) {
        highestScore = score;
        best = v;
      }
    });

    return best;
  }, [product, selectedAttrs]);

  // Handler for user selecting an attribute value
  const handleSelectAttribute = (normKey, value) => {
    const match = product.variants.find((v) => {
      const vAttrs = getVariantAttrs(v);
      const normVAttrs = {};
      Object.entries(vAttrs).forEach(([k, vVal]) => {
        normVAttrs[String(k).trim().toLowerCase()] = String(vVal).trim().toLowerCase();
      });
      if (normVAttrs[normKey] !== String(value).toLowerCase()) return false;
      return true;
    });

    if (match) {
      const vAttrs = getVariantAttrs(match);
      const resolved = {};
      Object.entries(vAttrs).forEach(([k, vVal]) => {
        resolved[String(k).trim().toLowerCase()] = String(vVal).trim();
      });
      resolved[normKey] = value;
      setSelectedAttrs((prev) => ({ ...prev, ...resolved }));
    } else {
      setSelectedAttrs((prev) => ({ ...prev, [normKey]: value }));
    }
  };

  // Gallery display images (Variant images if present, otherwise product images)
  const displayImages = useMemo(() => {
    if (activeVariant?.images && activeVariant.images.length > 0) {
      const vImgs = activeVariant.images
        .map((img) => (typeof img === "string" ? img : img?.url))
        .filter(Boolean);
      if (vImgs.length > 0) return vImgs;
    }
    if (product?.images && product.images.length > 0) {
      const pImgs = product.images
        .map((img) => (typeof img === "string" ? img : img?.url))
        .filter(Boolean);
      if (pImgs.length > 0) return pImgs;
    }
    return ["/assets/hero_black.jpg"];
  }, [activeVariant, product]);

  useEffect(() => {
    setActiveImageIdx(0);
  }, [activeVariant?._id]);

  const currentDisplayImg =
    displayImages[activeImageIdx] ||
    displayImages[0] ||
    "/assets/hero_black.jpg";

  // GSAP transition when focused image updates
  useEffect(() => {
    if (heroImgRef.current) {
      gsap.fromTo(
        heroImgRef.current,
        { opacity: 0.4, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" },
      );
    }
  }, [currentDisplayImg, activeVariant?._id]);

  // Price & currency fallback
  const priceAmount = useMemo(() => {
    if (
      activeVariant?.price?.amount !== undefined &&
      activeVariant?.price?.amount !== null &&
      Number(activeVariant.price.amount) > 0
    ) {
      return Number(activeVariant.price.amount);
    }
    return Number(product?.price?.amount || 0);
  }, [product, activeVariant]);

  const currency = useMemo(() => {
    return activeVariant?.price?.currency || product?.price?.currency || "INR";
  }, [product, activeVariant]);

  const currencySymbol = currency === "USD" ? "$" : "INR ";
  const formattedPrice = priceAmount.toLocaleString();

  // Stock
  const currentStock = useMemo(() => {
    if (!hasVariants) return 0;
    return activeVariant?.stock !== undefined ? Number(activeVariant.stock) : 0;
  }, [hasVariants, activeVariant]);

  const handleStockUpdate = async (variantId, newStock) => {
    setProduct((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        variants: prev.variants.map((v) =>
          v._id === variantId ? { ...v, stock: newStock } : v,
        ),
      };
    });

    try {
      await handleUpdateVariantStock(product._id, variantId, {
        stock: newStock,
      });
    } catch (err) {
      console.error("Stock update failed on server:", err);
      fetchProduct();
    }
  };

  // Handler: Delete variant
  const handleDeleteVariantAction = async (variantId) => {
    try {
      await handleDeleteVariant(product._id, variantId);
      setProduct((prev) => {
        if (!prev) return prev;
        const updated = prev.variants.filter((v) => v._id !== variantId);
        return { ...prev, variants: updated };
      });
    } catch (err) {
      console.error("Variant delete error:", err);
      fetchProduct();
    }
  };

  // Handler: Create variant
  const handleVariantCreated = async (formData) => {
    const res = await handleAddVariant(product._id, formData);
    if (res?.product) {
      setProduct(res.product);
    } else {
      await fetchProduct();
    }
  };

  // Total stock across all variants
  const totalStockUnits = useMemo(() => {
    return (product?.variants || []).reduce(
      (sum, v) => sum + (Number(v.stock) || 0),
      0,
    );
  }, [product]);

  return (
    <div className="min-h-screen w-full bg-[#e7e7e0] text-zinc-950 flex flex-col font-inter">
      {/* ── 1. Top Atelier Navigation Bar ──────────────────────────────── */}
      <header className="w-full px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between gap-4 z-20 border-b border-zinc-300 bg-[#e7e7e0]/95 backdrop-blur-xs sticky top-0">
        {/* Left: Brand + Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            to="/seller/dashboard"
            className="flex items-center gap-1.5 font-space text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">DASHBOARD</span>
          </Link>

          <span className="text-zinc-400 font-mono text-xs">/</span>

          <span className="font-michroma text-sm sm:text-base font-bold tracking-[0.2em] uppercase text-zinc-950">
            NOIRVAYN ATELIER
          </span>

          <span className="hidden md:inline font-mono text-[11px] uppercase tracking-wider text-zinc-500 border-l border-zinc-300 pl-3">
            STUDIO
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-zinc-600">
            <span className="text-zinc-400 uppercase text-[10px]">
              TOTAL STOCK:
            </span>
            <span className="font-space font-bold text-zinc-950">
              {totalStockUnits} UNITS
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center gap-2 text-xs font-space font-bold tracking-wider uppercase bg-zinc-950 text-white px-4 py-2 hover:bg-zinc-800 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>CRAFT VARIANT</span>
          </button>
        </div>
      </header>

      {/* ── 2. Main Studio Content ─────────────────────────────────────── */}
      {isLoading ? (
        <main className="flex-1 w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12 sm:pb-16">
          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center justify-center -translate-y-4 sm:-translate-y-7">
            {/* Left Column Gallery Skeleton */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
              <div className="w-full max-w-[450px]">
                <div className="flex flex-col-reverse sm:flex-row gap-3 items-start w-full">
                  <div className="w-full sm:w-16 shrink-0 flex flex-row sm:flex-col gap-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton
                        key={i}
                        className="w-14 sm:w-16 sm:w-full aspect-[3/4] bg-zinc-300/80 border border-zinc-300"
                      />
                    ))}
                  </div>
                  <Skeleton className="flex-1 w-full aspect-[3/4] max-h-[500px] bg-zinc-300/80 border border-zinc-300" />
                </div>
              </div>
            </div>

            {/* Right Column Product Details Skeleton */}
            <div className="lg:col-span-6 flex justify-center lg:justify-start w-full">
              <div className="w-full max-w-[390px] space-y-5">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28 bg-zinc-300/70" />
                  <Skeleton className="h-8 w-4/5 bg-zinc-300/90" />
                  <Skeleton className="h-6 w-24 bg-zinc-300/80" />
                  <div className="w-full border-b border-zinc-300/60 pt-2" />
                </div>

                {/* Attribute Group Skeletons */}
                <div className="space-y-3">
                  <Skeleton className="h-3.5 w-20 bg-zinc-300/70" />
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-9 w-12 bg-zinc-300/80" />
                    ))}
                  </div>
                </div>

                {/* Stock Card Skeleton */}
                <div className="border border-zinc-300 bg-white/40 p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24 bg-zinc-300/80" />
                    <Skeleton className="h-7 w-24 bg-zinc-300/80" />
                  </div>
                  <Skeleton className="h-3 w-40 bg-zinc-300/60" />
                </div>

                {/* Action CTA Skeleton */}
                <Skeleton className="h-11 w-full bg-zinc-300/90" />
              </div>
            </div>
          </div>
        </main>
      ) : authError ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
          <ShieldAlert className="w-14 h-14 stroke-[1.2] text-rose-600 mx-auto" />
          <div className="space-y-1">
            <h2 className="font-space text-lg font-bold uppercase tracking-wider text-zinc-950">
              UNAUTHORIZED ATELIER ACCESS
            </h2>
            <p className="text-xs font-inter text-zinc-600 max-w-md mx-auto">
              {authError}
            </p>
          </div>
          <Link
            to="/seller/dashboard"
            className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-space text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            RETURN TO YOUR DASHBOARD
          </Link>
        </div>
      ) : !product ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
          <PackageOpen className="w-14 h-14 stroke-[1.2] text-zinc-500" />
          <h2 className="font-michroma text-lg font-bold uppercase">
            PRODUCT NOT FOUND
          </h2>
          <Link
            to="/seller/dashboard"
            className="px-5 py-2.5 bg-zinc-950 text-white font-space text-xs uppercase"
          >
            RETURN TO INVENTORY
          </Link>
        </div>
      ) : (
        <main className="flex-1 w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12 sm:pb-16">
          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center justify-center -translate-y-4 sm:-translate-y-7">
            {/* ══════════════════════════════════════════════════════════════
                LEFT COLUMN: Lookbook Stage (Centered)
               ══════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
              <div className="w-full max-w-[450px]">
                {/* Gallery Unit: Vertical Thumbnails + Hero Runway Stage */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 items-start w-full">
                  {/* Thumbnails Ribbon */}
                  {displayImages.length > 1 && (
                    <div className="w-full sm:w-16 shrink-0 flex flex-row sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[480px] scrollbar-none pb-1 sm:pb-0">
                      {displayImages.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIdx(idx)}
                          className={cn(
                            "w-14 sm:w-16 sm:w-full aspect-[3/4] bg-[#eae9e2] border overflow-hidden transition-all shrink-0 cursor-pointer p-0.5",
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
                  <div className="flex-1 w-full aspect-[3/4] max-h-[500px] bg-[#eae9e2] border border-zinc-300 overflow-hidden relative shadow-xs flex items-center justify-center select-none group">
                    <img
                      ref={heroImgRef}
                      src={currentDisplayImg}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Angle Controls */}
                    {displayImages.length > 1 && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveImageIdx((prev) =>
                              prev > 0 ? prev - 1 : displayImages.length - 1,
                            )
                          }
                          className="w-7 h-7 bg-white/90 hover:bg-white text-zinc-900 border border-zinc-300 flex items-center justify-center shadow-xs transition-all cursor-pointer"
                          title="Previous"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveImageIdx((prev) =>
                              prev < displayImages.length - 1 ? prev + 1 : 0,
                            )
                          }
                          className="w-7 h-7 bg-white/90 hover:bg-white text-zinc-900 border border-zinc-300 flex items-center justify-center shadow-xs transition-all cursor-pointer"
                          title="Next"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                RIGHT COLUMN: Product Details & Variant Studio (Centered)
               ══════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-6 flex justify-center lg:justify-start w-full">
              <div className="w-full max-w-[390px] space-y-4">
                {/* Header: Title & Price */}
                <div className="space-y-1.5">
                  <h1 className="font-syne text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-zinc-950 leading-tight">
                    {product.title}
                  </h1>

                  {/* Price */}
                  <div className="font-space text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                    {currencySymbol}
                    {formattedPrice}
                  </div>

                  {/* Light Gray Border Line under Price */}
                  <div className="w-full border-b border-zinc-300 pt-2.5" />
                </div>

                {/* ── Dynamic Multi-Attribute Variant Selection (Image 1, 2, 3 Layout) ── */}
                {hasVariants ? (
                  <div className="space-y-3.5">
                    {/* Dynamically Render Each Attribute Group (e.g. COLOR, SIZE, FIT) */}
                    {attributeGroups.map((group) => {
                      const currentVal = selectedAttrs[group.key] || "";

                      return (
                        <div key={group.key} className="space-y-1.5">
                          <label className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase font-semibold">
                            {group.displayName}
                          </label>
                          <div className="flex flex-wrap items-center gap-2">
                            {group.values.map((val) => {
                              const isSelected =
                                currentVal.toLowerCase() === val.toLowerCase();

                              return (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() =>
                                    handleSelectAttribute(group.key, val)
                                  }
                                  className={cn(
                                    "px-3.5 py-1.5 border text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer",
                                    isSelected
                                      ? "bg-black text-white border-black shadow-xs"
                                      : "bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400",
                                  )}
                                >
                                  {val}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {/* Live Stock Status (Green Text - Exactly as in Image 1, 2, 3) */}
                    <div className="pt-0.5">
                      {currentStock <= 0 ? (
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-600">
                          OUT OF STOCK
                        </span>
                      ) : (
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-600">
                          {currentStock} IN STOCK
                        </span>
                      )}
                    </div>

                    {/* Seller Studio Actions (Replaced buyer buttons with seller controls) */}
                    <div className="space-y-2 pt-2.5 max-w-[270px]">
                      <button
                        type="button"
                        onClick={() => setIsDrawerOpen(true)}
                        className="w-full h-11 bg-black text-white hover:bg-zinc-800 text-xs font-mono font-extrabold uppercase tracking-widest transition-all cursor-pointer shadow-xs active:scale-[0.99] flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>CRAFT VARIANT</span>
                      </button>

                      <Link
                        to={`/products/${product._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full h-11 bg-white hover:bg-zinc-50 text-black border border-zinc-300 text-xs font-mono font-extrabold uppercase tracking-widest transition-all cursor-pointer shadow-2xs active:scale-[0.99] flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4 text-zinc-600" />
                        <span>PREVIEW AS BUYER</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 space-y-4">
                    <p className="text-xs font-inter text-zinc-600">
                      This garment has no variant sizes or colorways yet.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(true)}
                      className="inline-flex items-center gap-2 bg-black hover:bg-zinc-800 text-white px-5 py-2.5 font-space text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>CRAFT FIRST VARIANT</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ── 3. Craft Variant Slide-Over Drawer ───────────────────────────── */}
      <CreateVariantDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={product}
        onVariantCreated={handleVariantCreated}
      />
    </div>
  );
}
