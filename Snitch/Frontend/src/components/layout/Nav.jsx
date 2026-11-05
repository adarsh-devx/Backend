import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import DrawUnderlineLink from "@/components/ui/DrawUnderlineLink";
import { useCart } from "@/features/cart/hook/useCart";
import AccountPopover from "@/features/auth/components/AccountPopover";
import SearchModal from "@/components/ui/SearchModal";

/**
 * Global Navigation Header Component
 * Handles sticky scroll auto-hide, brand wordmark, route navigation, cart drawer toggle, and user profile popover.
 */
export default function Nav({ className = "" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { openCart, cartItems = [] } = useCart();
  const [activeItem, setActiveItem] = useState("MEN");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const lastScrollY = useRef(0);

  // Keyboard shortcut Ctrl/Cmd + K to toggle search modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Total cart items count
  const cartCount =
    cartItems?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  // Dedicated pages that have their own minimal/focused layout
  const hideOnPaths = ["/login", "/register", "/cart", "/order-success"];
  const isSellerRoute = location.pathname.startsWith("/seller");

  // Scroll behavior: hide on scroll down, reveal on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY.current + 8) {
          setIsNavVisible(false);
        } else if (currentScrollY < lastScrollY.current - 6) {
          setIsNavVisible(true);
        }
      } else {
        setIsNavVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (hideOnPaths.includes(location.pathname) || isSellerRoute) {
    return null;
  }

  const navLinks = [
    { label: "MEN", href: "#catalog" },
    { label: "WOMEN", href: "#catalog" },
    { label: "NEW ARRIVALS", href: "#catalog" },
    { label: "COLLECTIONS", href: "#fw26" },
    { label: "EDITORIAL", href: "#editorial" },
    { label: "ABOUT", href: "#about" },
  ];

  const handleNavClick = (link) => {
    setActiveItem(link.label);
    if (location.pathname !== "/") {
      navigate(`/${link.href}`);
      return;
    }
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
          isNavVisible
            ? "translate-y-0 shadow-xs"
            : "-translate-y-full shadow-none",
          className,
        )}
      >
        <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 py-3 sm:py-3.5 flex items-center justify-between gap-4 lg:gap-6">
          {/* Left: Brand Wordmark */}
          <Link
            to="/"
            className="font-michroma text-xl sm:text-2xl font-bold tracking-[0.25em] uppercase text-zinc-950 hover:opacity-80 transition-opacity shrink-0"
          >
            NOIRVAYN
          </Link>

          {/* Center: Navigation Links with Hand-Drawn Atelier Underline */}
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

          {/* Right: Cart + User Profile + Mobile Hamburger */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Search shortcut button (opens live search modal) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-1 hover:text-zinc-950 text-zinc-700 transition-colors cursor-pointer"
              title="Search Catalog (Ctrl+K)"
              aria-label="Open search dialog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart Icon — opens Slide-over Cart Drawer */}
            <button
              id="nav-cart-btn"
              type="button"
              onClick={openCart}
              className="relative p-1 hover:text-zinc-950 text-zinc-700 transition-colors cursor-pointer"
              title="Cart"
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-950 text-white text-[9px] font-mono font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Account Popover */}
            <AccountPopover />

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

        {/* Mobile Drawer (Directly anchored under header navigation) */}
        {isMobileMenuOpen && (
          <div className="md:hidden w-full bg-[#F3F1E9] border-t border-[#D9D6CE] p-5 sm:p-6 shadow-xl space-y-4 font-mono text-xs uppercase tracking-wider animate-in slide-in-from-top-2 max-h-[calc(100dvh-60px)] overflow-y-auto">
            {/* Mobile search bar trigger */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center justify-between p-2.5 bg-white border border-zinc-900 text-xs font-mono tracking-wider text-zinc-700 hover:text-zinc-950 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5" />
                <span>SEARCH CATALOG...</span>
              </span>
              <span className="text-[10px] bg-zinc-100 px-1.5 py-0.5 border border-zinc-300">
                Ctrl+K
              </span>
            </button>

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
      </header>

      {/* Luxury Search Modal Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

