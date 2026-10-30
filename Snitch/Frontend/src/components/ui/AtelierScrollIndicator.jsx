import React, { useEffect, useRef, useState } from "react";

/**
 * AtelierScrollIndicator
 * Awwwards-winning floating minimalist scroll indicator:
 * 1. Default browser scrollbars 100% hidden
 * 2. Floating 2px hairline indicator vertically centered on the right
 * 3. Auto-hides when idle, smoothly fades in on scroll or mouse proximity
 * 4. Interactive scrubbing (click/drag anywhere on the track to scroll)
 */
export default function AtelierScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hideTimeoutRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      setScrollProgress(progress);

      // Show indicator
      setIsVisible(true);

      // Clear existing timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      // Hide indicator after 1.2s idle
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const handleTrackClick = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const progress = Math.min(1, Math.max(0, clickY / rect.height));
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: progress * docHeight,
      behavior: "smooth",
    });
  };

  // Track height = 140px, thumb height = 28px
  const trackHeight = 140;
  const thumbHeight = 28;
  const maxThumbTravel = trackHeight - thumbHeight;
  const thumbTop = scrollProgress * maxThumbTravel;

  return (
    <>
      <style>{`
        .atelier-scroll-wrapper {
          position: fixed;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 999990;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 6px;
          cursor: pointer;
          user-select: none;
          transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s ease;
        }

        .atelier-scroll-track {
          position: relative;
          width: 2px;
          height: 140px;
          background: rgba(24, 24, 27, 0.12);
          border-radius: 9999px;
          transition: width 0.25s ease, background-color 0.25s ease;
        }

        .atelier-scroll-wrapper:hover .atelier-scroll-track {
          width: 3.5px;
          background: rgba(24, 24, 27, 0.22);
        }

        .atelier-scroll-thumb {
          position: absolute;
          left: 0;
          width: 100%;
          height: 28px;
          background: #18181b;
          border-radius: 9999px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.08s ease-out, background-color 0.2s ease;
          will-change: transform;
        }

        .atelier-scroll-wrapper:hover .atelier-scroll-thumb {
          background: #09090b;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
        }

        @media (max-width: 800px) {
          .atelier-scroll-wrapper {
            display: none !important;
          }
        }
      `}</style>

      <div
        className="atelier-scroll-wrapper"
        style={{
          opacity: isVisible || isHovered ? 1 : 0,
          pointerEvents: isVisible || isHovered ? "auto" : "none",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleTrackClick}
        ref={trackRef}
        title="Scroll Progress"
      >
        <div className="atelier-scroll-track">
          <div
            className="atelier-scroll-thumb"
            style={{
              transform: `translateY(${thumbTop}px)`,
            }}
          />
        </div>
      </div>
    </>
  );
}
