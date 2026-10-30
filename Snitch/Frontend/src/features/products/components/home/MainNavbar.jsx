import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import DrawUnderlineLink from "@/components/ui/DrawUnderlineLink";

export default function MainNavbar({
  wishlistCount = 0,
  cartCount = 0,
  onOpenWishlist,
  onOpenCart,
}) {
  const [activeItem, setActiveItem] = useState("MEN");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY.current + 8) {
          // Scrolling Down -> Hide navbar to maximize runway screen space
          setIsNavVisible(false);
        } else if (currentScrollY < lastScrollY.current - 6) {
          // Scrolling Up -> Smoothly reveal navbar
          setIsNavVisible(true);
        }
      } else {
        // At the top of page -> always visible
        setIsNavVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "MEN", href: "#catalog" },
    { label: "WOMEN", href: "#catalog" },
    { label: "NEW ARRIVALS", href: "#catalog" },
    { label: "COLLECTIONS", href: "#fw26" },
    { label: "EDITORIAL", href: "#editorial" },
    { label: "ABOUT", href: "#footer" },
  ];

  const handleNavClick = (link) => {
    setActiveItem(link.label);
    const targetId = link.href.replace("#", "");
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={cn(
          "w-full bg-[#F3F1E9]/95 backdrop-blur-md border-b border-[#D9D6CE] sticky top-0 z-40 select-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
          isNavVisible ? "translate-y-0 shadow-xs" : "-translate-y-full shadow-none",
        )}
      >
        <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 py-3 sm:py-3.5 flex items-center justify-between gap-4 lg:gap-6">
          {/* Left: SNITCH Brand Wordmark */}
          <Link
            to="/"
            className="font-michroma text-xl sm:text-2xl font-bold tracking-[0.25em] uppercase text-zinc-950 hover:opacity-80 transition-opacity shrink-0"
          >
            SNITCH
          </Link>

          {/* Center-Left: Navigation Links with Hand-Drawn Atelier Underline */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-mono text-xs uppercase tracking-wider text-zinc-700">
            {navLinks.map((link) => (
              <DrawUnderlineLink
                key={link.label}
                label={link.label}
                isActive={activeItem === link.label}
                onClick={() => handleNavClick(link)}
                strokeColor="#18181b"
              />
            ))}
          </nav>

          {/* Right: Search Input + Heart + User + Bag + Hamburger */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">

            {/* Wishlist Heart Icon */}
            <button
              type="button"
              onClick={onOpenWishlist}
              className="relative p-1 hover:text-zinc-950 text-zinc-700 transition-colors cursor-pointer"
              title="Curated Wishlist"
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-colors",
                  wishlistCount > 0
                    ? "fill-red-500 text-red-500"
                    : "text-zinc-700 hover:text-zinc-950",
                )}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-mono font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Icon with live count badge */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-1 hover:text-zinc-950 text-zinc-700 transition-colors cursor-pointer"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-950 text-white text-[9px] font-mono font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User / Account Icon (At the last) */}
            <Link
              to="/login"
              className="p-1 hover:text-zinc-950 text-zinc-700 transition-colors"
              title="Account"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 hover:text-zinc-950 text-zinc-800 transition-colors cursor-pointer md:hidden"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[49px] bg-[#F3F1E9] border-b border-[#D9D6CE] p-6 z-30 shadow-xl space-y-4 font-mono text-xs uppercase tracking-wider animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => {
                handleNavClick(link);
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "block w-full text-left border-b border-zinc-300 pb-2 transition-colors",
                activeItem === link.label
                  ? "font-bold text-zinc-950"
                  : "text-zinc-600 hover:text-zinc-950",
              )}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
