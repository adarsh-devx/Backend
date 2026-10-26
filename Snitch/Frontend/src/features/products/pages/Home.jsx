import { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/use.product";
import { cn } from "@/lib/utils";
import gsap from "gsap";

// Icons
import {
  Search,
  LayoutGrid,
  List,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  PackageOpen,
  X,
  SlidersHorizontal,
  User,
  ArrowRight,
  ChevronDown,
  Check,
} from "lucide-react";

// Components
import DecagonButton from "../components/DecagonButton";
import ProductCard from "../components/ProductCard";
import QuickLookModal from "../components/QuickLookModal";
import LogoMarquee from "@/components/ui/logo-marquee";

const RUNWAY_MARQUEE_ITEMS = [
  { text: "VOGUE RUNWAY" },
  { text: "CORDURA® REINFORCED" },
  { text: "HYPEBEAST ARCHIVE" },
  { text: "JAPANESE RAW DENIM" },
  { text: "GQ EDITORIAL" },
  { text: "YKK® TACTICAL HARDWARE" },
  { text: "HIGHSNOBIETY SELECTS" },
  { text: "HYDROPHOBIC DWR MEMBRANE" },
  { text: "COMPLEX STYLE" },
  { text: "PARIS // TOKYO // NEW YORK" },
];

export default function Home() {
  const navigate = useNavigate();
  const { handleGetAllProducts } = useProduct();
  const products = useSelector((state) => state.product.products) || [];
  const currentUser = useSelector((state) => state.auth.user);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedHeroProduct, setSelectedHeroProduct] = useState(null);
  const [heroImageIdx, setHeroImageIdx] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "price-desc" | "price-asc" | "title-asc"
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectProduct, setInspectProduct] = useState(null);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // GSAP animation refs
  const heroImgRef = useRef(null);
  const heroTitleRef = useRef(null);
  const catalogRef = useRef(null);
  const sortRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close sort menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch all products from Backend
  const loadAllProducts = async () => {
    setIsLoading(true);
    try {
      const prods = await handleGetAllProducts();
      if (prods && prods.length > 0) {
        setSelectedHeroProduct(prods[0]);
      }
    } catch (e) {
      console.error("Failed to load products:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  // Determine active hero product
  const activeHero = useMemo(() => {
    if (selectedHeroProduct) return selectedHeroProduct;
    if (products.length > 0) return products[0];
    return null;
  }, [selectedHeroProduct, products]);

  // Images of the active hero
  const activeHeroImages = useMemo(() => {
    if (activeHero?.images && activeHero.images.length > 0) {
      return activeHero.images.map((img) => img.url);
    }
    return ["/assets/hero_black.jpg"];
  }, [activeHero]);

  const currentHeroImg =
    activeHeroImages[heroImageIdx] ||
    activeHeroImages[0] ||
    "/assets/hero_black.jpg";

  // GSAP transition when Hero product or image switches
  useEffect(() => {
    if (heroImgRef.current) {
      gsap.fromTo(
        heroImgRef.current,
        { opacity: 0.35, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" },
      );
    }
  }, [currentHeroImg, activeHero?._id]);

  // Filtered & Sorted Catalog for Buyers
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }

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
  }, [products, searchQuery, sortBy]);

  const heroCurrency = activeHero?.price?.currency === "USD" ? "$" : "₹";
  const heroPriceStr = activeHero
    ? `${heroCurrency}${Number(activeHero?.price?.amount || 0).toLocaleString()}`
    : "—";

  const handleSelectHero = (prod) => {
    setSelectedHeroProduct(prod);
    setHeroImageIdx(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full bg-[#e7e7e0] text-zinc-950 flex flex-col font-inter select-none">
      {/* ── 1. Editorial Marquee Ticker ───────────────────────────────────── */}
      <div className="w-full bg-zinc-950 text-white font-mono text-[10px] tracking-widest py-2 px-6 flex items-center justify-between border-b border-zinc-800 uppercase overflow-hidden">
        <div className="flex items-center gap-6 animate-pulse">
          <span>SNITCH // RUNWAY ARCHIVE FW-26</span>
          <span className="hidden sm:inline text-zinc-500">|</span>
          <span className="hidden sm:inline">
            HIGH-DENSITY URBAN SHELLS &amp; TECHNICAL SILHOUETTES
          </span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <span>GLOBAL DISPATCH</span>
          <span className="text-zinc-600">/</span>
          <span>CURATED COLLECTION</span>
        </div>
      </div>

      {/* ── 2. Top Minimal Navbar ────────────────────────────────────────── */}
      <header className="w-full px-6 sm:px-10 lg:px-16 pt-5 pb-4 flex items-center justify-between gap-6 z-30 border-b border-zinc-300/70 bg-[#e7e7e0]/95 backdrop-blur-xs sticky top-0">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <span className="font-michroma text-xl sm:text-2xl font-bold tracking-[0.28em] uppercase text-zinc-950 group-hover:opacity-80 transition-opacity">
            SNITCH
          </span>
          <span className="text-zinc-400 font-mono text-xs hidden sm:inline">
            /
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 font-bold hidden sm:inline">
            RUNWAY STOREFRONT
          </span>
        </Link>

        {/* Center: Jump to Catalog Link */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-600">
          <button
            type="button"
            onClick={() =>
              catalogRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className="hover:text-zinc-950 transition-colors cursor-pointer"
          >
            All Apparel [{products.length}]
          </button>
          <span className="text-zinc-400">·</span>
          <span className="text-zinc-500">Edition: FW//2026</span>
        </nav>

        {/* Right: Auth & User Actions */}
        <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {currentUser.role === "seller" && (
                <Link
                  to="/seller/dashboard"
                  className="bg-zinc-950 text-white px-3 py-1.5 font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors text-[11px]"
                >
                  Seller Studio &rarr;
                </Link>
              )}
              <div className="hidden sm:flex items-center gap-1.5 text-zinc-700 bg-white/80 border border-zinc-300 px-2.5 py-1 text-[11px]">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                <span className="font-bold truncate max-w-[120px]">
                  {currentUser.fullName}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-zinc-700 hover:text-zinc-950 font-semibold uppercase tracking-wider transition-colors px-2 py-1"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-zinc-950 text-white px-3.5 py-1.5 font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors text-[11px]"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* ── 3. Editorial Hero Stage (Featured Drop) ───────────────────────── */}
      {activeHero ? (
        <section className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative min-h-[560px]">
          {/* Left Column: Big Typographic Headline & Desktop Decagon CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full z-10 space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-600">
                  FEATURED RUNWAY DROP // 01
                </span>
              </div>

              <h1
                ref={heroTitleRef}
                className="font-michroma text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-bold tracking-tight text-zinc-950 uppercase leading-[1.08]"
              >
                {activeHero.title}
              </h1>

              {activeHero.description && (
                <p className="text-xs sm:text-sm text-zinc-600 font-inter leading-relaxed line-clamp-3 pt-1">
                  {activeHero.description}
                </p>
              )}
            </div>

            {/* Desktop Decagon Action Button & Price (Hidden on mobile) */}
            <div className="pt-2 hidden lg:block">
              <DecagonButton
                price={heroPriceStr}
                label="ACQUIRE PIECE"
                onClick={() => navigate(`/products/${activeHero._id}`)}
              />
            </div>
          </div>

          {/* Center Column: Cutout Model Photography (Seamless Alpha Blend) & Mobile CTA */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative h-full min-h-[380px] lg:min-h-[540px]">
            <div
              onClick={() => navigate(`/products/${activeHero._id}`)}
              className="relative w-full max-w-[390px] h-full flex items-center justify-center cursor-pointer group"
            >
              <img
                ref={heroImgRef}
                src={currentHeroImg}
                alt={activeHero.title}
                className="w-full h-auto max-h-[540px] object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                loading="eager"
              />
            </div>

            {/* Phone Screen: Decagon Action Button & Price Underneath Product Photo (Aligned Left) */}
            <div className="pt-4 sm:pt-6 w-full flex justify-start lg:hidden z-20">
              <DecagonButton
                price={heroPriceStr}
                label="ACQUIRE PIECE"
                onClick={() => navigate(`/products/${activeHero._id}`)}
              />
            </div>
          </div>

          {/* Right Column: Lookbook Thumbnails & Angle Progress Slider */}
          <div className="lg:col-span-3 flex flex-col justify-end lg:items-end h-full z-10 space-y-6 lg:pl-4">
            {/* Multi-angle cards */}
            <div className="flex lg:flex-col gap-3 sm:gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {activeHeroImages.length > 1
                ? activeHeroImages.slice(1, 3).map((imgUrl, idx) => {
                    const targetIdx = idx + 1;
                    const isSelected = heroImageIdx === targetIdx;

                    return (
                      <div
                        key={idx}
                        onClick={() => setHeroImageIdx(targetIdx)}
                        className={cn(
                          "w-24 sm:w-28 lg:w-32 aspect-[3/4] bg-white border cursor-pointer overflow-hidden transition-all duration-300 relative group shrink-0",
                          isSelected
                            ? "border-zinc-950 shadow-md ring-1 ring-zinc-950"
                            : "border-zinc-200/90 hover:border-zinc-400 opacity-90 hover:opacity-100",
                        )}
                      >
                        <img
                          src={imgUrl}
                          alt={`View angle ${targetIdx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    );
                  })
                : products.slice(1, 3).map((other) => (
                    <div
                      key={other._id}
                      onClick={() => handleSelectHero(other)}
                      className="w-24 sm:w-28 lg:w-32 aspect-[3/4] bg-white border border-zinc-200/90 hover:border-zinc-950 cursor-pointer overflow-hidden transition-all duration-300 relative group shrink-0"
                    >
                      <img
                        src={other.images?.[0]?.url || "/assets/hero_black.jpg"}
                        alt={other.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/75 text-white font-mono text-[9px] p-1 truncate">
                        {other.title}
                      </div>
                    </div>
                  ))}
            </div>

            {/* Angle Slider Progress */}
            {activeHeroImages.length > 1 && (
              <div className="w-full max-w-[180px] flex items-center gap-3 pt-2 text-xs font-mono font-bold text-zinc-900 select-none">
                <span className="tracking-widest">
                  {String(heroImageIdx + 1).padStart(2, "0")}
                </span>

                <div
                  onClick={() => {
                    setHeroImageIdx((prev) =>
                      prev < activeHeroImages.length - 1 ? prev + 1 : 0,
                    );
                  }}
                  className="flex-1 h-[1.5px] bg-zinc-300 relative cursor-pointer group py-1"
                >
                  <div
                    className="h-[2px] bg-zinc-950 transition-all duration-300 relative top-[-0.25px]"
                    style={{
                      width: `${((heroImageIdx + 1) / (activeHeroImages.length || 1)) * 100}%`,
                    }}
                  />
                </div>

                <span className="tracking-widest text-zinc-500">
                  {String(activeHeroImages.length || 1).padStart(2, "0")}
                </span>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* ── 4. Infinite Smooth Runway Marquee ────────────────────────────── */}
      <section className="w-full">
        <LogoMarquee
          logos={RUNWAY_MARQUEE_ITEMS}
          duration={38}
          durationOnHover={75}
          className="border-y border-zinc-300 bg-[#e5e4de]"
        />
      </section>

      {/* ── 5. Main Catalog Header Bar & Controls ─────────────────────────── */}
      <section
        ref={catalogRef}
        className="w-full border-b border-zinc-300 bg-[#f4f3ed] sticky top-[69px] z-20"
      >
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Section Title & Live Count */}
          <div className="flex items-center gap-3">
            <span className="font-michroma text-sm sm:text-base font-bold uppercase tracking-wider text-zinc-950">
              RUNWAY CATALOG
            </span>
            <span className="font-mono text-xs text-zinc-600 font-semibold px-2 py-0.5 bg-white border border-zinc-300 tracking-wider">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "PIECE" : "PIECES"}
            </span>
          </div>

          {/* Unified Runway Tactical Control Dock */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center bg-white border border-zinc-300 shadow-2xs divide-x divide-zinc-200">
              {/* 1. Search Segment */}
              <div className="relative flex items-center px-3 py-1.5 min-w-[170px] sm:min-w-[230px]">
                <Search className="w-3.5 h-3.5 text-zinc-400 mr-2 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH RUNWAY..."
                  className="w-full text-xs font-mono font-medium text-zinc-950 placeholder:text-zinc-400 placeholder:text-[10px] tracking-wider uppercase outline-none bg-transparent"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="hidden sm:inline-block text-[9px] font-mono text-zinc-400 border border-zinc-200 px-1 py-0.5 rounded-xs select-none">
                    /
                  </span>
                )}
              </div>

              {/* 2. Custom Popover Sort Filter */}
              <div ref={sortRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium text-zinc-800 hover:text-zinc-950 hover:bg-zinc-50 transition-colors cursor-pointer select-none"
                  aria-expanded={isSortOpen}
                >
                  <SlidersHorizontal className="w-3 h-3 text-zinc-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wide">
                    {sortBy === "newest"
                      ? "NEWEST"
                      : sortBy === "price-desc"
                        ? "PRICE: HIGH"
                        : sortBy === "price-asc"
                          ? "PRICE: LOW"
                          : "TITLE: A-Z"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 text-zinc-400 transition-transform duration-200",
                      isSortOpen && "rotate-180",
                    )}
                  />
                </button>

                {/* Dropdown Popover */}
                {isSortOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-zinc-950 shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150 font-mono text-xs">
                    <div className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100">
                      SORT RUNWAY BY
                    </div>
                    {[
                      { value: "newest", label: "Newest First" },
                      { value: "price-desc", label: "Price: High → Low" },
                      { value: "price-asc", label: "Price: Low → High" },
                      { value: "title-asc", label: "Alphabetical: A → Z" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.value);
                          setIsSortOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 flex items-center justify-between hover:bg-zinc-100 transition-colors cursor-pointer text-xs",
                          sortBy === opt.value
                            ? "font-bold text-zinc-950 bg-zinc-50"
                            : "text-zinc-600",
                        )}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.value && (
                          <Check className="w-3.5 h-3.5 text-zinc-950" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. View Switcher Segment */}
              <div className="flex items-center p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-1.5 transition-all cursor-pointer flex items-center justify-center",
                    viewMode === "grid"
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "text-zinc-400 hover:text-zinc-950",
                  )}
                  title="Lookbook Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={cn(
                    "p-1.5 transition-all cursor-pointer flex items-center justify-center",
                    viewMode === "table"
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "text-zinc-400 hover:text-zinc-950",
                  )}
                  title="Technical Matrix View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4. Refresh Segment */}
              <button
                type="button"
                onClick={loadAllProducts}
                disabled={isLoading}
                className="px-2.5 py-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 transition-colors cursor-pointer"
                title="Sync Runway Products"
              >
                <RefreshCw
                  className={cn(
                    "w-3.5 h-3.5",
                    isLoading && "animate-spin text-zinc-950",
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. All Products Catalog Display ──────────────────────────────── */}
      <section className="w-full bg-[#f9f8f4] flex-1">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-14">
          {isLoading ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div
                  key={n}
                  className="bg-white border border-zinc-200 p-3 space-y-3 animate-pulse"
                >
                  <div className="aspect-[3/4] bg-zinc-200 w-full" />
                  <div className="h-4 bg-zinc-200 w-3/4" />
                  <div className="h-3 bg-zinc-200 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="bg-white border border-dashed border-zinc-300 p-16 text-center max-w-lg mx-auto space-y-4">
              <PackageOpen className="w-12 h-12 stroke-[1.2] text-zinc-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-space text-lg font-bold text-zinc-950 uppercase tracking-wide">
                  {searchQuery
                    ? "No matching apparel found"
                    : "Atelier Vault Empty"}
                </h3>
                <p className="text-xs font-inter text-zinc-500">
                  {searchQuery
                    ? `No pieces found matching "${searchQuery}". Clear your search query to see the archive.`
                    : "The runway collection is currently being prepared. Check back shortly for the next harvest drop."}
                </p>
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-mono font-bold uppercase underline underline-offset-4 text-zinc-900 cursor-pointer"
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            /* ── Lookbook Grid View (3:4 ratio with Animos 3D tilt) ────────── */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  actionLabel="View Apparel ↗"
                  onQuickLook={setInspectProduct}
                />
              ))}
            </div>
          ) : (
            /* ── Technical Matrix Table View ─────────────────────────────── */
            <div className="bg-white border border-zinc-300 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-100 border-b border-zinc-300 uppercase text-zinc-500 text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Curated Assets</th>
                      <th className="py-3 px-4">Season Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {filteredProducts.map((p) => {
                      const img =
                        p?.images?.[0]?.url || "/assets/hero_black.jpg";
                      const price = `${p?.price?.currency === "USD" ? "$" : "₹"}${Number(
                        p?.price?.amount || 0,
                      ).toLocaleString()}`;
                      const prodId = p?._id
                        ? p._id.slice(-6).toUpperCase()
                        : "PROD-01";

                      return (
                        <tr
                          key={p._id}
                          onClick={() => navigate(`/products/${p._id}`)}
                          className="hover:bg-zinc-50 transition-colors cursor-pointer group"
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={img}
                                alt={p.title}
                                className="w-12 h-16 object-cover border border-zinc-200 shrink-0"
                              />
                              <div>
                                <span className="font-space text-xs font-bold text-zinc-950 block group-hover:underline">
                                  {p.title}
                                </span>
                                <span className="text-[10px] text-zinc-400">
                                  ID // {prodId}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-zinc-950">
                            {price}
                          </td>
                          <td className="py-3.5 px-4 text-zinc-600">
                            {p.images?.length || 1} High-Res Assets
                          </td>
                          <td className="py-3.5 px-4 text-zinc-700 font-semibold">
                            Live on Runway
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setInspectProduct(p);
                              }}
                              className="text-[11px] text-zinc-500 hover:text-zinc-950 px-2 py-1 cursor-pointer"
                            >
                              Quick Look
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/products/${p._id}`);
                              }}
                              className="text-[11px] font-bold bg-zinc-950 text-white hover:bg-zinc-800 px-3 py-1 cursor-pointer"
                            >
                              View &rarr;
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

      {/* ── 7. Editorial Brand Manifesto Banner ──────────────────────────── */}
      <section className="w-full border-t border-zinc-300 bg-[#e7e7e0] py-14 px-6 sm:px-10 lg:px-16">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-500 block">
              THE SNITCH ATELIER PHILOSOPHY
            </span>
            <h2 className="font-michroma text-xl sm:text-2xl font-bold uppercase tracking-tight text-zinc-950">
              ANTI-OBSOLESCENCE TECHNICAL APPAREL
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl font-inter leading-relaxed">
              Every garment in the Snitch archive is built with waterproof
              membranes, precision-sealed seams, and functional ergonomic
              draping designed to outlast ordinary fast fashion.
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <button
              type="button"
              onClick={() =>
                catalogRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-6 py-3.5 bg-zinc-950 text-white font-space text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              DISCOVER FULL COLLECTION &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* ── 8. Bottom Status Footer ───────────────────────────────────────── */}
      <footer className="w-full border-t border-zinc-300 bg-[#dfded7] py-8 px-6 sm:px-10 lg:px-16 text-[11px] font-mono text-zinc-600">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-zinc-950 uppercase">
              SNITCH // GLOBAL ATELIER RUNWAY
            </span>
            <span className="text-zinc-400">|</span>
            <span>STOREFRONT ACTIVE</span>
          </div>

          <div className="flex items-center gap-6">
            <span>
              TOTAL PUBLISHED: {products.length}{" "}
              {products.length === 1 ? "PRODUCT" : "PRODUCTS"}
            </span>
            {currentUser?.role === "seller" ? (
              <Link
                to="/seller/dashboard"
                className="text-zinc-950 font-bold uppercase underline underline-offset-4 hover:opacity-75"
              >
                Seller Studio
              </Link>
            ) : (
              <Link
                to="/register"
                className="text-zinc-950 font-bold uppercase underline underline-offset-4 hover:opacity-75"
              >
                Become a Seller
              </Link>
            )}
          </div>
        </div>
      </footer>

      {/* ── 9. Quick Look Lightbox Modal ──────────────────────────────────── */}
      {inspectProduct && (
        <QuickLookModal
          product={inspectProduct}
          onClose={() => setInspectProduct(null)}
          onSelectAsHero={() => navigate(`/products/${inspectProduct._id}`)}
        />
      )}
    </div>
  );
}
