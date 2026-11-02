import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, AlertCircle } from "lucide-react";
import gsap from "gsap";
import { useCart } from "../hook/useCart";
import { cn } from "@/lib/utils";

/**
 * Premium E-Commerce Add-to-Cart Action Component
 * Features:
 * - Instant Parabolic Flying Thumbnail animation from button to navbar cart
 * - Animated SVG circular outlined checkmark on server success
 * - Framer Motion state transitions (idle, loading, success, error)
 * - Immune to Windows reduced-motion blockers or API network latency
 */
export default function AddToCartButton({
  product,
  variant,
  quantity = 1,
  imageUrl,
  targetCartSelector = "#nav-cart-btn",
  className = "",
  onSuccess,
}) {
  const { handleAddToCart } = useCart();
  const buttonRef = useRef(null);
  const [buttonState, setButtonState] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [ariaAnnouncement, setAriaAnnouncement] = useState("");

  const timerRef = useRef(null);
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Resolve best product image URL
  const resolveImage = useCallback(() => {
    if (imageUrl && typeof imageUrl === "string") return imageUrl;
    if (product?.images?.length > 0) {
      const first = product.images[0];
      return typeof first === "string" ? first : first.url;
    }
    if (variant?.images?.length > 0) {
      const first = variant.images[0];
      return typeof first === "string" ? first : first.url;
    }
    const heroImg = document.getElementById("product-hero-img");
    if (heroImg && heroImg.src) return heroImg.src;
    return "";
  }, [imageUrl, product, variant]);

  // Find navbar cart button or fallback to top-right
  const resolveTargetCart = useCallback(() => {
    return (
      document.querySelector(targetCartSelector) ||
      document.querySelector("#nav-cart-btn") ||
      document.querySelector('[aria-label*="cart" i]') ||
      document.querySelector("header button[title*='Cart' i]")
    );
  }, [targetCartSelector]);

  // Trigger elastic bounce on cart icon
  const triggerCartIconBump = useCallback(
    (targetEl) => {
      const cartEl = targetEl || resolveTargetCart();
      if (!cartEl) return;

      gsap
        .timeline()
        .to(cartEl, {
          scale: 1.35,
          duration: 0.15,
          ease: "back.out(2)",
          onStart: () => {
            cartEl.style.transformOrigin = "center center";
          },
        })
        .to(cartEl, {
          scale: 1,
          duration: 0.35,
          ease: "elastic.out(1.2, 0.4)",
        });
    },
    [resolveTargetCart],
  );

  // Launch Flying Thumbnail animation from button to cart icon
  const launchFlyingThumbnail = useCallback(() => {
    if (!buttonRef.current) return;

    const btnRect = buttonRef.current.getBoundingClientRect();
    const cartEl = resolveTargetCart();

    const cartRect = cartEl
      ? cartEl.getBoundingClientRect()
      : { left: window.innerWidth - 65, top: 22, width: 24, height: 24 };

    // Initial position: centered over the Add to Cart button
    const startW = 54;
    const startH = 54;
    const startX = btnRect.left + btnRect.width / 2 - startW / 2;
    const startY = btnRect.top + btnRect.height / 2 - startH / 2;

    // Target coordinates: centered over navbar cart icon
    const targetW = 22;
    const targetH = 22;
    const targetX = cartRect.left + cartRect.width / 2 - targetW / 2;
    const targetY = cartRect.top + cartRect.height / 2 - targetH / 2;

    // Upward parabolic curve peak
    const peakY = Math.min(startY, targetY) - 65;

    // Create floating clone element
    const flyEl = document.createElement("div");
    Object.assign(flyEl.style, {
      position: "fixed",
      left: `${startX}px`,
      top: `${startY}px`,
      width: `${startW}px`,
      height: `${startH}px`,
      borderRadius: "10px",
      overflow: "hidden",
      zIndex: "99999",
      pointerEvents: "none",
      boxShadow: "0 14px 30px -4px rgba(0, 0, 0, 0.45)",
      border: "2px solid rgba(255, 255, 255, 0.85)",
      backgroundColor: "#ffffff",
      willChange: "transform, top, left, width, height, opacity",
    });

    const img = document.createElement("img");
    img.src = resolveImage();
    img.alt = "";
    Object.assign(img.style, {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    });

    flyEl.appendChild(img);
    document.body.appendChild(flyEl);

    // GSAP Parabolic Arc Flight
    const tl = gsap.timeline({
      onComplete: () => {
        if (flyEl.parentNode) {
          flyEl.parentNode.removeChild(flyEl);
        }
        triggerCartIconBump(cartEl);
      },
    });

    // 1. Horizontal movement
    tl.to(
      flyEl,
      {
        left: targetX,
        duration: 0.72,
        ease: "power2.inOut",
      },
      0,
    );

    // 2. Vertical movement with parabolic arc curve
    tl.to(
      flyEl,
      {
        keyframes: [
          { top: peakY, duration: 0.32, ease: "power1.out" },
          { top: targetY, duration: 0.4, ease: "power2.in" },
        ],
      },
      0,
    );

    // 3. Shrink, round into circle, and fade-out near destination
    tl.to(
      flyEl,
      {
        width: targetW,
        height: targetH,
        borderRadius: "9999px",
        opacity: 0.8,
        duration: 0.72,
        ease: "power2.inOut",
      },
      0,
    );
  }, [resolveImage, resolveTargetCart, triggerCartIconBump]);

  const handleClick = async (e) => {
    e.preventDefault();
    if (buttonState === "loading" || buttonState === "success") return;

    if (!product?._id) {
      setButtonState("error");
      setErrorMessage("Select a product");
      timerRef.current = setTimeout(() => setButtonState("idle"), 1500);
      return;
    }

    // 1. Instant Visual Feedback: Launch Flying Thumbnail IMMEDIATELY on click!
    launchFlyingThumbnail();

    // 2. Set button to loading state
    setButtonState("loading");
    setAriaAnnouncement("Adding item to cart...");

    try {
      // 3. Server add to cart call
      await handleAddToCart({
        productId: product._id,
        variantId: variant?._id,
        quantity: Math.max(1, quantity),
      });

      // 4. Success State with animated checkmark
      setButtonState("success");
      setAriaAnnouncement("Item added to cart successfully");
      if (onSuccess) onSuccess();

      // Hold success state for 1100ms then restore
      timerRef.current = setTimeout(() => {
        setButtonState("idle");
      }, 1100);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      setButtonState("error");
      setErrorMessage("Could not add");
      setAriaAnnouncement("Failed to add item to cart");
      timerRef.current = setTimeout(() => {
        setButtonState("idle");
      }, 1600);
    }
  };

  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {ariaAnnouncement}
      </div>

      <motion.button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        disabled={buttonState === "loading"}
        aria-busy={buttonState === "loading"}
        className={cn(
          "relative overflow-hidden font-space text-xs font-bold uppercase tracking-wider",
          "flex items-center justify-center gap-2 select-none cursor-pointer transition-colors duration-200",
          "shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
          buttonState === "success"
            ? "bg-[#27272a] text-white" // Charcoal success state
            : buttonState === "error"
              ? "bg-zinc-900 text-red-400 border border-red-500/40"
              : "bg-zinc-950 text-white hover:bg-zinc-800 active:scale-[0.99]",
          className,
        )}
      >
        <AnimatePresence mode="wait">
          {buttonState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" strokeWidth={2} />
              <span>Add to cart</span>
            </motion.div>
          )}

          {buttonState === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                />
              </svg>
            </motion.div>
          )}

          {buttonState === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5 text-white"
              >
                {/* Outlined circular stroke drawing */}
                <motion.circle
                  cx="12"
                  cy="12"
                  r="9.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 0.28,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                />
                {/* SVG path drawing for the checkmark */}
                <motion.path
                  d="M8 12.2L10.7 14.8L16 9.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 0.24,
                    delay: 0.16,
                    ease: "easeOut",
                  }}
                />
              </svg>
            </motion.div>
          )}

          {buttonState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              className="flex items-center justify-center gap-1.5 text-xs text-red-400 font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage || "Failed"}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
