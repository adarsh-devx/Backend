import { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router";
import { useProduct } from "../hook/use.product";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import gsap from "gsap";

// Icons (strictly used ones)
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  RefreshCw,
  PackageOpen,
} from "lucide-react";

// Components
import DecagonButton from "../components/DecagonButton";
import ProductCard from "../components/ProductCard";
import QuickLookModal from "../components/QuickLookModal";

export default function Dashboard() {
  const { handleGetSellerProduct } = useProduct();
  const sellerProducts =
    useSelector((state) => state.product.sellerProducts) || [];

  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "price-desc" | "price-asc" | "title-asc"
  const [inspectProduct, setInspectProduct] = useState(null);

  // GSAP animation refs
  const heroImgRef = useRef(null);
  const titleRef = useRef(null);
  const inventorySectionRef = useRef(null);

  // Fetch real seller catalog from Backend
  const loadCatalog = async () => {
    setIsLoading(true);
    try {
      const prods = await handleGetSellerProduct();
      if (prods && prods.length > 0) {
        setSelectedProduct(prods[0]);
      }
    } catch (e) {
      console.error("Seller products load error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  // Active product on stage (only real seller data)
  const activeProduct = useMemo(() => {
    if (selectedProduct) return selectedProduct;
    if (sellerProducts.length > 0) return sellerProducts[0];
    return null;
  }, [selectedProduct, sellerProducts]);

  // Image list of current active product
  const activeImages = useMemo(() => {
    if (activeProduct?.images && activeProduct.images.length > 0) {
      return activeProduct.images.map((img) => img.url);
    }
    return [];
  }, [activeProduct]);

  // Ensure activeImageIdx is within range
  const currentHeroImg =
    activeImages[activeImageIdx] || activeImages[0] || "/assets/hero_black.jpg";

  // GSAP Transition on Image or Product Change
  useEffect(() => {
    if (heroImgRef.current) {
      gsap.fromTo(
        heroImgRef.current,
        { opacity: 0.3, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" },
      );
    }
  }, [currentHeroImg, activeProduct?._id]);

  // Sorted Seller Inventory (Real data only)
  const sortedCatalog = useMemo(() => {
    const list = [...sellerProducts];

    switch (sortBy) {
      case "price-desc":
        list.sort(
          (a, b) =>
            Number(b?.price?.amount || 0) - Number(a?.price?.amount || 0),
        );
        break;
      case "price-asc":
        list.sort(
          (a, b) =>
            Number(a?.price?.amount || 0) - Number(b?.price?.amount || 0),
        );
        break;
      case "title-asc":
        list.sort((a, b) => (a?.title || "").localeCompare(b?.title || ""));
        break;
      case "newest":
      default:
        list.sort(
          (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0),
        );
        break;
    }

    return list;
  }, [sellerProducts, sortBy]);

  // Formatted price string for active product
  const activeCurrency = activeProduct?.price?.currency === "USD" ? "$" : "₹";
  const activePriceStr = activeProduct
    ? `${activeCurrency}${Number(activeProduct?.price?.amount || 0).toLocaleString()}`
    : "—";

  // Select a product to feature on the stage
  const handleSelectHero = (product) => {
    setSelectedProduct(product);
    setActiveImageIdx(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Other products for alternate preview in right column
  const otherProducts = useMemo(() => {
    if (!activeProduct) return [];
    return sellerProducts
      .filter((p) => p._id !== activeProduct._id)
      .slice(0, 2);
  }, [sellerProducts, activeProduct]);

  return (
    <div className="min-h-screen w-full bg-[#e7e7e0] text-zinc-950 flex flex-col font-inter select-none">
      {/* ── 1. Top Minimal Navbar (Full Screen) ─────────────────────────── */}
      <header className="w-full px-6 sm:px-10 lg:px-16 pt-6 pb-4 flex items-center justify-between gap-6 z-20 border-b border-zinc-300/70 bg-[#e7e7e0]/95 backdrop-blur-xs sticky top-0">
        {/* Brand Logo: SNITCH */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="font-michroma text-xl sm:text-2xl font-bold tracking-[0.25em] uppercase text-zinc-950 group-hover:opacity-80 transition-opacity">
            SNITCH
          </span>
          <span className="text-zinc-400 font-mono text-xs hidden sm:inline">
            /
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 font-bold hidden sm:inline">
            SELLER ATELIER
          </span>
        </Link>

        {/* Right Seller Actions */}
        <div className="flex items-center gap-4 sm:gap-6 text-zinc-800">
          {/* Live Product count badge */}
          <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-white border border-zinc-300 text-zinc-800 tracking-wider">
            {sellerProducts.length}{" "}
            {sellerProducts.length === 1 ? "PRODUCT" : "PRODUCTS"}
          </span>

          {/* Create Product Button */}
          <Link
            to="/seller/create-product"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider uppercase bg-zinc-950 text-white px-3.5 py-1.5 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD PRODUCT</span>
          </Link>
        </div>
      </header>

      {/* ── 2. Main Content: Real Data or Empty State ───────────────────── */}
      {isLoading ? (
        /* Loading Skeleton */
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-16 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-pulse">
            <div className="lg:col-span-4 space-y-6">
              <div className="h-10 bg-zinc-300 w-3/4" />
              <div className="h-4 bg-zinc-300 w-full" />
              <div className="h-4 bg-zinc-300 w-2/3" />
              <div className="w-24 h-24 bg-zinc-300" />
            </div>
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-72 h-96 bg-zinc-300" />
            </div>
            <div className="lg:col-span-3 space-y-4">
              <div className="w-32 h-40 bg-zinc-300" />
              <div className="w-32 h-40 bg-zinc-300" />
            </div>
          </div>
        </div>
      ) : sellerProducts.length === 0 ? (
        /* Clean Brutalist Empty State */
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-xl mx-auto space-y-6">
          <PackageOpen className="w-16 h-16 stroke-[1.2] text-zinc-400" />
          <div className="space-y-2">
            <h2 className="font-michroma text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 uppercase">
              NO PRODUCTS PUBLISHED
            </h2>
            <p className="text-xs sm:text-sm font-inter text-zinc-600 leading-relaxed">
              Your atelier catalog has no active products. Create your first
              apparel listing to launch your collection on the Snitch runway.
            </p>
          </div>
          <Link
            to="/seller/create-product"
            className="inline-flex items-center gap-2 bg-zinc-950 text-white hover:bg-zinc-800 px-6 py-3 font-space text-xs font-bold tracking-widest uppercase transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>ADD YOUR FIRST PRODUCT</span>
          </Link>
        </div>
      ) : (
        /* Real Product Active Stage */
        <>
          <main className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative min-h-[580px] lg:min-h-[640px]">
            {/* ── Left Column: Specs, Massive Title & Decagon Button (4 cols) ── */}
            <div className="lg:col-span-4 flex flex-col justify-between h-full z-10 space-y-6 sm:space-y-10">
              {/* Massive Tech Headline */}
              <div className="space-y-3">
                <h1
                  ref={titleRef}
                  className="font-michroma text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold tracking-tight text-zinc-950 uppercase leading-[1.05]"
                >
                  {activeProduct?.title}
                </h1>
                {activeProduct?.description && (
                  <p className="text-xs sm:text-sm text-zinc-600 line-clamp-3 leading-relaxed">
                    {activeProduct.description}
                  </p>
                )}
              </div>

              {/* The Decagon Action Button & Price (Desktop only) */}
              <div className="pt-2 hidden lg:block">
                <DecagonButton
                  price={activePriceStr}
                  label="VIEW PRODUCT"
                  onClick={() => setInspectProduct(activeProduct)}
                />
              </div>
            </div>

            {/* ── Center Column: Seamless Cutout Model Photography (5 cols) & Mobile CTA ── */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative h-full min-h-[380px] lg:min-h-[580px]">
              <div className="relative w-full max-w-[430px] h-full flex items-center justify-center">
                <img
                  ref={heroImgRef}
                  src={currentHeroImg}
                  alt={activeProduct?.title || "Product image"}
                  className="w-full h-auto max-h-[580px] object-contain transition-transform duration-700 ease-out pointer-events-auto"
                  loading="eager"
                />
              </div>

              {/* Mobile Screen: Decagon Action Button & Price Underneath Product Photo (Aligned Left) */}
              <div className="pt-4 sm:pt-6 w-full flex justify-start lg:hidden z-20">
                <DecagonButton
                  price={activePriceStr}
                  label="VIEW PRODUCT"
                  onClick={() => setInspectProduct(activeProduct)}
                />
              </div>
            </div>

            {/* ── Right Column: Alternate Angle Cards / Catalog Preview ── */}
            <div className="lg:col-span-3 flex flex-col justify-end lg:items-end h-full z-10 space-y-6 lg:pl-4">
              {/* Lookbook Alternate Cards */}
              <div className="flex lg:flex-col gap-3 sm:gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {activeImages.length > 1
                  ? activeImages.slice(1, 3).map((imgUrl, idx) => {
                      const targetIdx = idx + 1;
                      const isSelected = activeImageIdx === targetIdx;

                      return (
                        <div
                          key={idx}
                          onClick={() => setActiveImageIdx(targetIdx)}
                          className={cn(
                            "w-28 sm:w-32 lg:w-36 aspect-[3/4] bg-white border cursor-pointer overflow-hidden transition-all duration-300 relative group shrink-0",
                            isSelected
                              ? "border-zinc-950 shadow-md ring-1 ring-zinc-950"
                              : "border-zinc-200/90 hover:border-zinc-400 opacity-90 hover:opacity-100",
                          )}
                        >
                          <img
                            src={imgUrl}
                            alt={`Angle ${targetIdx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      );
                    })
                  : otherProducts.map((other) => (
                      <div
                        key={other._id}
                        onClick={() => handleSelectHero(other)}
                        className="w-28 sm:w-32 lg:w-36 aspect-[3/4] bg-white border border-zinc-200/90 hover:border-zinc-950 cursor-pointer overflow-hidden transition-all duration-300 relative group shrink-0"
                      >
                        <img
                          src={
                            other.images?.[0]?.url || "/assets/hero_black.jpg"
                          }
                          alt={other.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white font-mono text-[9px] p-1 truncate">
                          {other.title}
                        </div>
                      </div>
                    ))}
              </div>

              {/* Minimalist 01 ────────── N Progress Slider */}
              {activeImages.length > 1 && (
                <div className="w-full max-w-[200px] flex items-center gap-3 pt-2 text-xs font-mono font-bold text-zinc-900 select-none">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIdx((prev) =>
                        prev > 0 ? prev - 1 : activeImages.length - 1,
                      )
                    }
                    className="p-1 hover:text-zinc-500 transition-colors cursor-pointer"
                    aria-label="Previous angle"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <span className="tracking-widest">
                    {String(activeImageIdx + 1).padStart(2, "0")}
                  </span>

                  <div
                    onClick={() => {
                      setActiveImageIdx((prev) =>
                        prev < activeImages.length - 1 ? prev + 1 : 0,
                      );
                    }}
                    className="flex-1 h-[1.5px] bg-zinc-300 relative cursor-pointer group py-1"
                  >
                    <div
                      className="h-[2px] bg-zinc-950 transition-all duration-300 relative top-[-0.25px]"
                      style={{
                        width: `${((activeImageIdx + 1) / (activeImages.length || 1)) * 100}%`,
                      }}
                    />
                  </div>

                  <span className="tracking-widest text-zinc-500">
                    {String(activeImages.length || 1).padStart(2, "0")}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIdx((prev) =>
                        prev < activeImages.length - 1 ? prev + 1 : 0,
                      )
                    }
                    className="p-1 hover:text-zinc-500 transition-colors cursor-pointer"
                    aria-label="Next angle"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </main>

          {/* ── 3. Seller Inventory Catalog Controls Bar ─────────────────────── */}
          <section
            ref={inventorySectionRef}
            className="w-full border-t border-zinc-300 bg-[#f4f3ed] z-20"
          >
            <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Section Title */}
              <div className="flex items-center gap-3">
                <span className="font-michroma text-sm sm:text-base font-bold uppercase tracking-wider text-zinc-950">
                  SELLER INVENTORY
                </span>
                <span className="font-mono text-xs text-zinc-600 font-semibold px-2 py-0.5 bg-zinc-200/80 border border-zinc-300">
                  {sellerProducts.length} LIVE{" "}
                  {sellerProducts.length === 1 ? "PRODUCT" : "PRODUCTS"}
                </span>
              </div>

              {/* Sort & View Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-zinc-300 text-xs font-mono font-medium text-zinc-800 px-3 py-1.5 outline-none hover:border-zinc-950 transition-colors cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="price-desc">Price: High &rarr; Low</option>
                  <option value="price-asc">Price: Low &rarr; High</option>
                  <option value="title-asc">Title: A &rarr; Z</option>
                </select>

                {/* Grid vs Table View Mode */}
                <div className="flex items-center border border-zinc-300 bg-white">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-1.5 transition-colors cursor-pointer",
                      viewMode === "grid"
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-500 hover:text-zinc-950",
                    )}
                    title="Lookbook Grid"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={cn(
                      "p-1.5 transition-colors cursor-pointer",
                      viewMode === "table"
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-500 hover:text-zinc-950",
                    )}
                    title="Technical Table"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={loadCatalog}
                  disabled={isLoading}
                  className="p-2 border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
                  title="Refresh Catalog"
                >
                  <RefreshCw
                    className={cn("w-3.5 h-3.5", isLoading && "animate-spin")}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* ── 4. Catalog Display: Lookbook Grid or Technical Table ─────────── */}
          <section className="w-full bg-[#f9f8f4] border-t border-zinc-200">
            <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-10">
              {viewMode === "grid" ? (
                /* Lookbook Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                  {sortedCatalog.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      isSelected={activeProduct?._id === product._id}
                      onSelectHero={handleSelectHero}
                      onQuickLook={setInspectProduct}
                    />
                  ))}
                </div>
              ) : (
                /* Technical Editorial Table */
                <div className="bg-white border border-zinc-300 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-zinc-100 border-b border-zinc-300 uppercase text-zinc-500 text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Product</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4">Assets</th>
                          <th className="py-3 px-4">Published Date</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200">
                        {sortedCatalog.map((p) => {
                          const img =
                            p?.images?.[0]?.url || "/assets/hero_black.jpg";
                          const price = `${p?.price?.currency === "USD" ? "$" : "₹"}${Number(
                            p?.price?.amount || 0,
                          ).toLocaleString()}`;
                          const prodId = p?._id
                            ? p._id.slice(-6).toUpperCase()
                            : "PROD-01";
                          const date = p?.createdAt
                            ? new Date(p.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "Live";

                          const isCurrent = activeProduct?._id === p._id;

                          return (
                            <tr
                              key={p._id}
                              onClick={() => handleSelectHero(p)}
                              className={cn(
                                "hover:bg-zinc-50 transition-colors cursor-pointer group",
                                isCurrent && "bg-zinc-100/80 font-bold",
                              )}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={img}
                                    alt={p.title}
                                    className="w-10 h-13 object-cover border border-zinc-200 shrink-0"
                                  />
                                  <div>
                                    <span className="font-space text-xs font-bold text-zinc-950 block group-hover:underline">
                                      {p.title}
                                    </span>
                                    <span className="text-[10px] text-zinc-400">
                                      ID: {prodId}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-bold text-zinc-950">
                                {price}
                              </td>
                              <td className="py-3 px-4 text-zinc-600">
                                {p.images?.length || 1} High-Res
                              </td>
                              <td className="py-3 px-4 text-zinc-500">
                                {date}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectHero(p);
                                  }}
                                  className="text-[11px] font-bold text-zinc-950 hover:underline px-2 py-1 mr-2 cursor-pointer"
                                >
                                  Feature &uarr;
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInspectProduct(p);
                                  }}
                                  className="text-[11px] text-zinc-500 hover:text-zinc-950 px-2 py-1 cursor-pointer"
                                >
                                  Inspect
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* ── 5. Bottom Status Bar ─────────────────────────────────────────── */}
      <footer className="w-full border-t border-zinc-300 bg-[#e7e7e0] z-10 mt-auto">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-5 flex items-center justify-between text-[11px] font-mono text-zinc-600">
          <div className="flex items-center gap-3">
            <span className="uppercase tracking-wider font-semibold text-zinc-900">
              SNITCH ATELIER // SELLER WORKBENCH
            </span>
            <span className="text-zinc-400">|</span>
            <span className="hidden sm:inline">LIVE STOREFRONT ACTIVE</span>
          </div>

          <div className="flex items-center gap-5">
            <span className="text-zinc-600 hidden sm:inline">
              TOTAL PRODUCTS: {sellerProducts.length}
            </span>

            <Link
              to="/seller/create-product"
              className="text-zinc-950 font-bold uppercase underline underline-offset-4 hover:opacity-75 transition-opacity"
            >
              + PUBLISH APPAREL
            </Link>
          </div>
        </div>
      </footer>

      {/* ── 6. Quick Look Modal ───────────────────────────────────────────── */}
      {inspectProduct && (
        <QuickLookModal
          product={inspectProduct}
          onClose={() => setInspectProduct(null)}
          onSelectAsHero={handleSelectHero}
        />
      )}
    </div>
  );
}
