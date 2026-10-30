import React, { useEffect, useRef } from "react";

/**
 * AtelierCursor
 * Pure luxury custom cursor for Snitch Atelier:
 * 1. Precision obsidian hairline pointer arrow
 * 2. Zero-latency mouse tracking with translate3d
 * 3. Fluid animation / smoke trail removed as requested
 * 4. Hidden on mobile/touch devices (width <= 800px)
 */
export default function AtelierCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth <= 800) return;

    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    let mouseX = -100;
    let mouseY = -100;
    let isVisible = false;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        cursorEl.style.opacity = "1";
      }
      cursorEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const onMouseLeave = () => {
      isVisible = false;
      cursorEl.style.opacity = "0";
    };

    const onMouseEnter = () => {
      isVisible = true;
      cursorEl.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  return (
    <>
      <style>{`
        @media (min-width: 801px) {
          body, body * {
            cursor: none !important;
          }
        }
        .custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 999999999;
          opacity: 0;
          will-change: transform, opacity;
          transition: opacity 0.2s ease-out;
        }
        @media (max-width: 800px) {
          .custom-cursor { display: none !important; }
        }
      `}</style>

      {/* Atelier Obsidian Hairline Pointer Arrow */}
      <div
        className="custom-cursor"
        ref={cursorRef}
        style={{
          filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.45))",
        }}
      >
        <svg
          width="26"
          height="28"
          viewBox="0 0 24 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transform -translate-x-[2px] -translate-y-[2px]"
        >
          {/* Main obsidian arrow with white hairline stroke */}
          <path
            d="M2.5 1.5L20.5 13L11.5 15L8 23.5L2.5 1.5Z"
            fill="#18181b"
            stroke="#FFFFFF"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          {/* Inner facet shadow for 3D metallic feel */}
          <path
            d="M5 5L15 11.5L9.5 13L7.5 18L5 5Z"
            fill="#27272a"
            opacity="0.9"
          />
        </svg>
      </div>
    </>
  );
}
