import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/use.product";
import { X, ShoppingBag, Heart } from "lucide-react";

// 15 Sections strictly ordered matching reference
import MainNavbar from "../components/home/MainNavbar";
import HeroSection from "../components/home/HeroSection";
import BrandTrustStrip from "../components/home/BrandTrustStrip";
import ShopByCategory from "../components/home/ShopByCategory";
import RunwayCatalog from "../components/home/RunwayCatalog";
import FwCollection from "../components/home/FwCollection";
import FeaturedDrop from "../components/home/FeaturedDrop";
import FabricInnovation from "../components/home/FabricInnovation";
import StreetsToArchive from "../components/home/StreetsToArchive";
import RealPeoplePlaces from "../components/home/RealPeoplePlaces";
import BeyondApparel from "../components/home/BeyondApparel";
import JoinTheArchive from "../components/home/JoinTheArchive";
import AtelierFooter from "../components/home/AtelierFooter";
import LogoMarquee from "@/components/ui/logo-marquee";

const MARQUEE_ITEMS = [
  "SNITCH ATELIER",
  "AUTUMN / WINTER 2026",
  "TOKYO RUNWAY ARCHIVE",
  "TECHNICAL SHELL INNOVATION",
  "LIMITED RUN DROPS",
  "STREETS TO ARCHIVE",
  "EXPRESS ALL-INDIA DISPATCH",
  "PARIS EDITORIAL CURATION",
];

export default function Home() {
  const navigate = useNavigate();
  const { handleGetAllProducts } = useProduct();
  const products = useSelector((state) => state.product.products) || [];

  const [wishlistedIds, setWishlistedIds] = useState([]);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: "6adc7fa06ef2657b685ff2b8",
      title: "BRANDED BLACK JACKET",
      price: 1111,
      image: "/refrenceCatalogItems/windbreaker_4x3.png",
      quantity: 1,
      size: "M",
    },
  ]);

  useEffect(() => {
    handleGetAllProducts().catch((err) => {
      console.error("Failed to load catalog products:", err);
    });
  }, []);

  const handleToggleWishlist = (productId) => {
    setWishlistedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleExplore = () => {
    const el = document.getElementById("catalog");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleWatchFilm = () => {
    const el = document.getElementById("editorial");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleViewLookbook = () => {
    const el = document.getElementById("fw26");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const featuredProduct = products.length > 0 ? products[0] : null;

  return (
    <div className="min-h-screen w-full bg-[#e7e7e0] text-zinc-950 flex flex-col font-inter">


      {/* ── SECTION 02 — MAIN NAVIGATION ───────────────────────────────── */}
      <MainNavbar
        wishlistCount={wishlistedIds.length}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenWishlist={() => setIsWishlistDrawerOpen(true)}
        onOpenCart={() => setIsCartDrawerOpen(true)}
      />

      {/* ── SECTION 03 — HERO / RUNWAY ARCHIVE ─────────────────────────── */}
      <HeroSection onExplore={handleExplore} onWatchFilm={handleWatchFilm} />

      {/* ── KINETIC RUNWAY TICKER MARQUEE ──────────────────────────────── */}
      <LogoMarquee logos={MARQUEE_ITEMS} duration={42} durationOnHover={70} />

      {/* ── SECTION 04 — BRAND TRUST / BENEFIT STRIP ──────────────────── */}
      <BrandTrustStrip />

      {/* ── SECTION 05 — SHOP BY CATEGORY ────────────────────────────── */}
      <ShopByCategory />

      {/* ── SECTION 06 — RUNWAY CATALOGUE ──────────────────────────────── */}
      <RunwayCatalog
        backendProducts={products}
        wishlistedIds={wishlistedIds}
        onToggleWishlist={handleToggleWishlist}
      />


      {/* ── SECTION 08 — FW/26 COLLECTION / LOOKBOOK ────────────────────── */}
      <FwCollection onViewLookbook={handleViewLookbook} />

      {/* ── SECTION 09 — FEATURED DROPS ─────────────────────────────────── */}
      <FeaturedDrop featuredProduct={featuredProduct} />

      {/* ── SECTION 10 — FABRIC INNOVATION ─────────────────────────────── */}
      <FabricInnovation />

      {/* ── SECTION 11 — EDITORIAL / STREETS TO ARCHIVE ─────────────────── */}
      <StreetsToArchive onReadEditorial={handleWatchFilm} />

      {/* ── SECTION 12 — REAL PEOPLE, REAL PLACES ───────────────────────── */}
      <RealPeoplePlaces onViewCommunity={handleExplore} />

      {/* ── SECTION 13 — BEYOND APPAREL ─────────────────────────────────── */}
      <BeyondApparel onJoinMovement={handleExplore} />

      {/* ── SECTION 14 — NEWSLETTER / JOIN THE ARCHIVE ──────────────────── */}
      <JoinTheArchive />

      {/* ── SECTION 15 — FOOTER ─────────────────────────────────────────── */}
      <AtelierFooter />

      {/* ── Wishlist Slide-Over Drawer ────────────────────────────────── */}
      {isWishlistDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in select-none">
          <div
            className="fixed inset-0"
            onClick={() => setIsWishlistDrawerOpen(false)}
          />
          <aside className="relative w-full max-w-sm bg-[#e7e7e0] border-l border-zinc-300 h-full p-6 flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-zinc-300 pb-4">
              <div>
                <span className="font-michroma text-sm font-bold uppercase tracking-wider text-zinc-950">
                  WISHLIST ARCHIVE
                </span>
                <p className="font-mono text-[10px] text-zinc-500 uppercase mt-0.5">
                  {wishlistedIds.length > 0
                    ? `${wishlistedIds.length} PIECES CURATED`
                    : "EMPTY ARCHIVE"}
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

            <div className="flex-1 py-4 overflow-y-auto space-y-3">
              {wishlistedIds.length > 0 ? (
                wishlistedIds.map((id) => (
                  <div
                    key={id}
                    className="border border-zinc-300 bg-white/70 p-3 flex gap-3 items-center shadow-2xs"
                  >
                    <img
                      src="/useImage/mockups/03_catalog_black_white_jacket.png"
                      alt="Wishlist Item"
                      className="w-14 aspect-[3/4] object-contain bg-zinc-200 border border-zinc-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-mono text-xs font-bold uppercase truncate text-zinc-950">
                        CURATED APPAREL
                      </h4>
                      <p className="font-space text-xs font-bold text-zinc-900 mt-1">
                        ₹1,111
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleWishlist(id)}
                      className="p-1.5 hover:text-red-500 text-zinc-400 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="h-56 flex flex-col items-center justify-center text-center font-mono text-xs text-zinc-500 space-y-2.5">
                  <Heart className="w-8 h-8 text-zinc-400 stroke-1" />
                  <span className="font-bold text-zinc-700">
                    NO PIECES CURATED YET
                  </span>
                  <span className="text-[10px] text-zinc-500 max-w-xs">
                    USE THE HEART ICON ON CATALOG APPAREL TO SAVE PIECES TO YOUR
                    PERSONAL ARCHIVE.
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-300 pt-4">
              <button
                type="button"
                onClick={() => setIsWishlistDrawerOpen(false)}
                className="w-full h-10 border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-900 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                RETURN TO RUNWAY
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Shopping Bag Slide-Over Drawer ───────────────────────────── */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in select-none">
          <div
            className="fixed inset-0"
            onClick={() => setIsCartDrawerOpen(false)}
          />
          <aside className="relative w-full max-w-sm bg-[#e7e7e0] border-l border-zinc-300 h-full p-6 flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-zinc-300 pb-4">
              <div>
                <span className="font-michroma text-sm font-bold uppercase tracking-wider text-zinc-950">
                  SHOPPING BAG
                </span>
                <p className="font-mono text-[10px] text-zinc-500 uppercase mt-0.5">
                  1 PIECE RESERVED
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1.5 hover:bg-zinc-300/60 rounded-full transition-colors cursor-pointer text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 py-4 overflow-y-auto space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-zinc-300 bg-white/70 p-3 flex gap-3 items-center shadow-2xs"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 aspect-[3/4] object-contain bg-zinc-200 border border-zinc-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-mono text-xs font-bold uppercase truncate text-zinc-950">
                      {item.title}
                    </h4>
                    <p className="font-space text-xs font-bold text-zinc-900 mt-1">
                      ₹{item.price.toLocaleString()}
                    </p>
                    <span className="font-mono text-[9px] text-zinc-500 uppercase">
                      SIZE: {item.size} // QTY: {item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-300 pt-4 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate(`/products/${cartItems[0]?.id}`);
                }}
                className="w-full h-11 bg-zinc-950 hover:bg-zinc-800 text-white font-space text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>CHECKOUT // ₹1,111</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full h-9 border border-zinc-300 bg-white/70 hover:bg-white text-zinc-800 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                CONTINUE BROWSING
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
