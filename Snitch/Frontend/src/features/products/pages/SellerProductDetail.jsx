import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useProduct } from "../hook/use.product";
import { cn } from "@/lib/utils";
import gsap from "gsap";

// Icons
import {
  ArrowLeft,
  Plus,
  Search,
  PackageOpen,
  Boxes,
  TrendingUp,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

// Components
import VariantCard from "../components/VariantCard";
import CreateVariantDrawer from "../components/CreateVariantDrawer";

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
  const [focusedVariant, setFocusedVariant] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSizeFilter, setSelectedSizeFilter] = useState("ALL");
  const [stockStatusFilter, setStockStatusFilter] = useState("ALL"); // ALL, IN_STOCK, LOW_STOCK, DEPLETED
  const [sortBy, setSortBy] = useState("default");

  // GSAP animation refs
  const heroImgRef = useRef(null);

  // Fetch product detail strictly for owner
  const fetchProduct = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const prod = await handleGetSellerProductById(productId);
      setProduct(prod);
      if (prod?.variants && prod.variants.length > 0) {
        setFocusedVariant(prod.variants[0]);
      }
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

  // Gallery display images
  // When a variant is focused and has images, show those; otherwise show master product images
  const displayImages = useMemo(() => {
    if (focusedVariant?.images && focusedVariant.images.length > 0) {
      return focusedVariant.images.map((img) => img.url);
    }
    if (product?.images && product.images.length > 0) {
      return product.images.map((img) => img.url);
    }
    return ["/assets/hero_black.jpg"];
  }, [focusedVariant, product]);

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
  }, [currentDisplayImg, focusedVariant?._id]);

  // Live Inventory Metrics
  const inventoryMetrics = useMemo(() => {
    const variants = product?.variants || [];
    const totalVariants = variants.length;
    const totalUnits = variants.reduce(
      (sum, v) => sum + (Number(v.stock) || 0),
      0,
    );
    const depletedCount = variants.filter(
      (v) => (Number(v.stock) || 0) === 0,
    ).length;
    const lowStockCount = variants.filter(
      (v) => (Number(v.stock) || 0) > 0 && (Number(v.stock) || 0) <= 5,
    ).length;

    const valuation = variants.reduce((sum, v) => {
      const price = Number(v?.price?.amount ?? product?.price?.amount ?? 0);
      const units = Number(v.stock) || 0;
      return sum + price * units;
    }, 0);

    return {
      totalVariants,
      totalUnits,
      depletedCount,
      lowStockCount,
      valuation,
    };
  }, [product]);

  // Filtered & Sorted variants
  const filteredVariants = useMemo(() => {
    let list = [...(product?.variants || [])];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((v) => {
        const rawAttrs = v.attributes;
        const attrs =
          rawAttrs instanceof Map
            ? Object.fromEntries(rawAttrs)
            : typeof rawAttrs === "object" && rawAttrs !== null
              ? rawAttrs
              : {};
        return Object.values(attrs).some((val) =>
          String(val).toLowerCase().includes(q),
        );
      });
    }

    // Size filter
    if (selectedSizeFilter !== "ALL") {
      list = list.filter((v) => {
        const rawAttrs = v.attributes;
        const attrs =
          rawAttrs instanceof Map
            ? Object.fromEntries(rawAttrs)
            : typeof rawAttrs === "object" && rawAttrs !== null
              ? rawAttrs
              : {};
        const sz = attrs.size || attrs.Size || attrs.SIZE;
        return sz?.toUpperCase() === selectedSizeFilter;
      });
    }

    // Stock status filter
    if (stockStatusFilter === "IN_STOCK") {
      list = list.filter((v) => (Number(v.stock) || 0) > 5);
    } else if (stockStatusFilter === "LOW_STOCK") {
      list = list.filter(
        (v) => (Number(v.stock) || 0) > 0 && (Number(v.stock) || 0) <= 5,
      );
    } else if (stockStatusFilter === "DEPLETED") {
      list = list.filter((v) => (Number(v.stock) || 0) === 0);
    }

    // Sorting
    switch (sortBy) {
      case "stock-desc":
        list.sort((a, b) => (Number(b.stock) || 0) - (Number(a.stock) || 0));
        break;
      case "stock-asc":
        list.sort((a, b) => (Number(a.stock) || 0) - (Number(b.stock) || 0));
        break;
      case "price-desc":
        list.sort(
          (a, b) =>
            Number(b?.price?.amount ?? product?.price?.amount ?? 0) -
            Number(a?.price?.amount ?? product?.price?.amount ?? 0),
        );
        break;
      case "price-asc":
        list.sort(
          (a, b) =>
            Number(a?.price?.amount ?? product?.price?.amount ?? 0) -
            Number(b?.price?.amount ?? product?.price?.amount ?? 0),
        );
        break;
      default:
        break;
    }

    return list;
  }, [product, searchQuery, selectedSizeFilter, stockStatusFilter, sortBy]);

  // Handler: Real-time stock change
  const handleStockUpdate = async (variantId, newStock) => {
    // Optimistic UI update
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
      if (focusedVariant?._id === variantId) {
        setFocusedVariant(null);
      }
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
      if (res?.variant) {
        setFocusedVariant(res.variant);
      }
    } else {
      await fetchProduct();
    }
  };

  const currencySymbol = product?.price?.currency === "USD" ? "$" : "₹";
  const masterPriceFormatted = `${currencySymbol}${Number(product?.price?.amount || 0).toLocaleString()}`;

  // Unique sizes present across all variants for filter pills
  const availableSizes = useMemo(() => {
    const sizes = new Set();
    product?.variants?.forEach((v) => {
      const rawAttrs = v.attributes;
      const attrs =
        rawAttrs instanceof Map
          ? Object.fromEntries(rawAttrs)
          : typeof rawAttrs === "object" && rawAttrs !== null
            ? rawAttrs
            : {};
      const sz = attrs.size || attrs.Size || attrs.SIZE;
      if (sz) sizes.add(sz.toUpperCase());
    });
    return Array.from(sizes);
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
            SNITCH ATELIER
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
              {inventoryMetrics.totalUnits} UNITS
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
        <div className="flex-1 flex items-center justify-center py-28">
          <div className="flex flex-col items-center gap-3 font-mono text-xs text-zinc-600">
            <RefreshCw className="w-6 h-6 animate-spin text-zinc-950" />
            <span>LOADING ATELIER PRODUCT STUDIO...</span>
          </div>
        </div>
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
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ══════════════════════════════════════════════════════════════
              LEFT COLUMN: Lookbook Stage & Unboxed Ledger (5 cols)
             ══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
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

            {/* Seamless Unboxed Inventory Ledger Bar (Only show when variants exist) */}
            {product?.variants && product.variants.length > 0 && (
              <div className="border border-zinc-300 bg-white p-4 shadow-xs">
                <div className="grid grid-cols-3 divide-x divide-zinc-200">
                  <div className="pr-3">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      TOTAL UNITS
                    </span>
                    <span className="block font-space text-xl font-bold text-zinc-950 mt-0.5">
                      {inventoryMetrics.totalUnits}
                    </span>
                  </div>

                  <div className="px-3">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      ACTIVE SKUS
                    </span>
                    <span className="block font-space text-xl font-bold text-zinc-950 mt-0.5">
                      {inventoryMetrics.totalVariants}
                    </span>
                  </div>

                  <div className="pl-3">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      VALUATION
                    </span>
                    <span className="block font-space text-xl font-bold text-zinc-950 mt-0.5">
                      {currencySymbol}
                      {inventoryMetrics.valuation.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════════
              RIGHT COLUMN: Product Details & Variant Studio (7 cols)
             ══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header: Editorial Breadcrumb, Title, Price, Description */}
            <div className="space-y-3 border-b border-zinc-300/80 pb-6">
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <span>ATELIER ARCHIVE</span>
                <span>/</span>
                <span>FW26</span>
                <span>/</span>
                <span className="text-zinc-900 font-bold">
                  SKU-{product._id.slice(-6).toUpperCase()}
                </span>
              </div>

              <h1 className="font-syne text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-zinc-950 leading-tight">
                {product.title}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pt-0.5">
                <span className="font-space text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
                  {masterPriceFormatted}
                </span>
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                  BASE RUNWAY PRICE
                </span>
              </div>

              {product.description && (
                <p className="text-zinc-600 font-inter text-xs sm:text-sm leading-relaxed max-w-2xl pt-1">
                  {product.description}
                </p>
              )}
            </div>

            {/* Filter & Search Bar (Only shown when product has variants) */}
            {product?.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Filter variants by size, color, fit..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-zinc-300 pl-9 pr-3 py-2 text-xs font-inter text-zinc-900 outline-none focus:border-zinc-950 transition-colors shadow-2xs"
                    />
                  </div>

                  {/* Stock status filter pills */}
                  <div className="flex items-center gap-1">
                    {[
                      { label: "All", val: "ALL" },
                      { label: "In Stock", val: "IN_STOCK" },
                      { label: "Low", val: "LOW_STOCK" },
                      { label: "Depleted", val: "DEPLETED" },
                    ].map((filter) => (
                      <button
                        key={filter.val}
                        type="button"
                        onClick={() => setStockStatusFilter(filter.val)}
                        className={cn(
                          "px-2.5 py-1.5 text-[11px] font-space font-bold uppercase transition-all cursor-pointer border",
                          stockStatusFilter === filter.val
                            ? "bg-zinc-950 text-white border-zinc-950 shadow-2xs"
                            : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-700",
                        )}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizing Filter Ribbon */}
                {availableSizes.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mr-1">
                      SIZES:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedSizeFilter("ALL")}
                      className={cn(
                        "px-2.5 py-1 text-xs font-space font-bold border transition-colors cursor-pointer",
                        selectedSizeFilter === "ALL"
                          ? "bg-zinc-950 text-white border-zinc-950"
                          : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-700",
                      )}
                    >
                      ALL
                    </button>
                    {availableSizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSizeFilter(sz)}
                        className={cn(
                          "px-2.5 py-1 text-xs font-space font-bold border transition-colors cursor-pointer",
                          selectedSizeFilter === sz
                            ? "bg-zinc-950 text-white border-zinc-950"
                            : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-700",
                        )}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Variant Matrix List */}
            {filteredVariants.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <PackageOpen className="w-12 h-12 stroke-[1.2] text-zinc-400 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-space text-sm font-bold uppercase text-zinc-950 tracking-wider">
                    NO VARIANTS AVAILABLE
                  </h3>
                  <p className="text-xs font-inter text-zinc-600 max-w-sm mx-auto">
                    {product?.variants?.length === 0
                      ? "This garment has no variant sizes or colorways yet. Create your first variant to initiate runway inventory."
                      : "No variants match your current filter criteria."}
                  </p>
                </div>

                {product?.variants?.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(true)}
                    className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white px-5 py-2.5 font-space text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>CRAFT FIRST VARIANT</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedSizeFilter("ALL");
                      setStockStatusFilter("ALL");
                    }}
                    className="inline-block text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 underline underline-offset-4 hover:text-zinc-600 cursor-pointer pt-1"
                  >
                    RESET FILTERS
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredVariants.map((variant) => (
                  <VariantCard
                    key={variant._id}
                    variant={variant}
                    masterProduct={product}
                    isSelected={focusedVariant?._id === variant._id}
                    onSelect={(v) => {
                      setFocusedVariant(v);
                      setActiveImageIdx(0);
                    }}
                    onStockChange={handleStockUpdate}
                    onDeleteVariant={handleDeleteVariantAction}
                  />
                ))}
              </div>
            )}
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
