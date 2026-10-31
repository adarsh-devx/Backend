import { useState } from "react";
import { ArrowRight, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HeroSection({
  onShopMen,
  onShopWomen,
  onExplore,
  onWatchFilm,
}) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [activePoseIdx, setActivePoseIdx] = useState(0);
  const [isLookbookFilmOpen, setIsLookbookFilmOpen] = useState(false);

  // The 4 interactive runway angles using the exact renamed assets
  const poses = [
    {
      src: "/realOne/main/mainFront_1x1_upscaled.webp",
      alt: "Main Front Masked Techwear Runway Pose",
      label: "Front Profile",
    },
    {
      src: "/realOne/main/mini-2.webp",
      alt: "Mini 2 Rear Perspective",
      label: "Rear Perspective",
    },
    {
      src: "/realOne/main/mini-3.webp",
      alt: "Mini 3 High Collar Angle",
      label: "Collar Detail",
    },
    {
      src: "/realOne/main/mini-1.webp",
      alt: "Mini 1 Tactical Fit Angle",
      label: "Tactical Fit",
    },
  ];

  // The 3 vertical angle thumbnail preview items as displayed in the reference image
  const thumbImages = [
    {
      poseIdx: 1,
      src: "/realOne/main/mini-2.webp",
      alt: "Mini 2 - Rear Angle",
    },
    {
      poseIdx: 2,
      src: "/realOne/main/mini-3.webp",
      alt: "Mini 3 - High Collar Angle",
    },
    {
      poseIdx: 3,
      src: "/realOne/main/mini-1.webp",
      alt: "Mini 1 - Tactical Mask Angle",
    },
  ];

  const handleShopMenClick = () => {
    if (onShopMen) onShopMen();
    else if (onExplore) onExplore();
    else {
      const el = document.getElementById("catalog");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShopWomenClick = () => {
    if (onShopWomen) onShopWomen();
    else if (onExplore) onExplore();
    else {
      const el = document.getElementById("catalog");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenFilm = () => {
    if (onWatchFilm) onWatchFilm();
    else setIsLookbookFilmOpen(true);
  };

  const handlePrevPose = () => {
    setActivePoseIdx((prev) => (prev > 0 ? prev - 1 : poses.length - 1));
  };

  const handleNextPose = () => {
    setActivePoseIdx((prev) => (prev < poses.length - 1 ? prev + 1 : 0));
  };

  const handleResetPose = () => {
    setActivePoseIdx(0);
  };

  return (
    <>
      <section className="relative w-full bg-[#EAE8E1] border-b border-[#D9D6CE] overflow-hidden select-none">
        {/* ── Background Architectural Concrete Layer (Subtle Blur) ── */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/realOne/main/Brutalist Concrete Geometry in Sunlight.webp"
            alt="Brutalist Concrete Architecture Backdrop"
            className="w-full h-full object-cover object-left-top filter contrast-[1.05] brightness-[1.02] blur-[2.5px]"
          />
          {/* Soft sunlight wash on the left to ensure typography is ultra crisp */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F3F1E9]/85 via-[#F3F1E9]/35 to-transparent w-[50%] lg:w-[42%] pointer-events-none" />
        </div>

        {/* ── DESKTOP LOCKED EDITORIAL LAYOUT (lg & up) matching 03_hero_runway.png ── */}
        <div className="hidden lg:block relative z-10 w-full max-w-[1720px] mx-auto aspect-[1024/342] min-h-[460px] max-h-[580px]">
          {/* Left Area: Typography, Tag, Copy, CTAs (X: 0% to 34%) */}
          <div className="absolute top-0 bottom-0 left-0 w-[34%] z-20 flex flex-col justify-between pl-8 xl:pl-12 pr-4 py-8 xl:py-10">
            {/* Top Tag */}
            <div className="space-y-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#77756F]">
              <div>FW-26</div>
              <div className="text-zinc-950 font-extrabold">RUNWAY ARCHIVE</div>
            </div>

            {/* Headline matching theme font Michroma */}
            <h1 className="font-michroma text-3xl sm:text-4xl md:text-5xl lg:text-[42px] xl:text-[48px] font-bold uppercase tracking-tight text-zinc-950 leading-[1.02]">
              BUILT
              <br />
              FOR THE
              <br />
              EVERYDAY
              <br />
              RUNWAY
            </h1>

            {/* Supporting Copy */}
            <p className="font-inter text-xs xl:text-[13px] text-zinc-700 font-medium tracking-wide uppercase leading-relaxed max-w-sm">
              TECHNICAL APPAREL FOR A FASTER, BOLDER TOMORROW. CLEAN
              SILHOUETTES. REAL-WORLD FUNCTION. TIMELESS STYLE.
            </p>

            {/* Dual CTAs: SHOP MEN / SHOP WOMEN (Equal Width & Size) */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleShopMenClick}
                className="w-[145px] xl:w-[158px] bg-zinc-950 hover:bg-zinc-800 text-white font-space text-[11px] xl:text-xs font-bold uppercase tracking-wider py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs active:translate-y-0.5"
              >
                <span>SHOP MEN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleShopWomenClick}
                className="w-[145px] xl:w-[158px] bg-white hover:bg-zinc-50 text-zinc-950 border border-zinc-950 font-space text-[11px] xl:text-xs font-bold uppercase tracking-wider py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs active:translate-y-0.5"
              >
                <span>SHOP WOMEN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center Main Front Model (Shifted left to marked blue line & up to overhead beam) */}
          <div className="absolute top-[0.5%] bottom-0 left-[28.5%] w-[36%] z-10 flex items-end justify-center pointer-events-none">
            <img
              src={poses[activePoseIdx].src}
              alt={poses[activePoseIdx].alt}
              key={poses[activePoseIdx].src}
              className="w-full h-full object-contain object-bottom filter drop-shadow-2xl transition-all duration-300"
              loading="eager"
            />
          </div>

          {/* Vertical Thumbnails Strip (X: 64.8% to 70.3%, Top: 11.7%) */}
          <div className="absolute top-[11.7%] left-[64.8%] w-[5.5%] z-20 flex flex-col items-center gap-2">
            {thumbImages.map((thumb) => {
              const isActive = activePoseIdx === thumb.poseIdx;
              return (
                <button
                  key={thumb.poseIdx}
                  type="button"
                  onClick={() => setActivePoseIdx(thumb.poseIdx)}
                  className={cn(
                    "w-full aspect-[3/4] bg-transparent border overflow-hidden p-0.5 transition-all cursor-pointer shadow-2xs flex items-center justify-center",
                    isActive
                      ? "border-zinc-950 ring-2 ring-zinc-950 scale-105"
                      : "border-[#D9D6CE] opacity-80 hover:opacity-100 hover:border-zinc-600",
                  )}
                  title={thumb.alt}
                >
                  <img
                    src={thumb.src}
                    alt={thumb.alt}
                    className="w-full h-full object-contain object-bottom"
                  />
                </button>
              );
            })}

            {/* Minimalist Controls matching reference: ← ↺ → */}
            <div className="flex items-center gap-1.5 pt-1 font-mono text-zinc-800 text-[11px] font-bold">
              <button
                type="button"
                onClick={handlePrevPose}
                className="w-4 h-4 flex items-center justify-center hover:scale-125 transition-transform cursor-pointer"
                title="Previous Angle"
              >
                ←
              </button>
              <button
                type="button"
                onClick={handleResetPose}
                className="w-4 h-4 flex items-center justify-center hover:scale-125 transition-transform cursor-pointer text-[10px]"
                title="Reset to Front Model"
              >
                ↺
              </button>
              <button
                type="button"
                onClick={handleNextPose}
                className="w-4 h-4 flex items-center justify-center hover:scale-125 transition-transform cursor-pointer"
                title="Next Angle"
              >
                →
              </button>
            </div>
          </div>

          {/* Vertical Divider Line at X: 72.1% */}
          <div className="absolute top-0 bottom-0 left-[72.1%] w-[1px] bg-black/40 z-20 pointer-events-none" />

          {/* Far-Right Lookbook Panel (X: 72.1% to 100%) */}
          <div className="absolute top-0 bottom-0 left-[72.1%] right-0 z-10 bg-black/40 overflow-hidden flex flex-col justify-between group">
            {/* Background Model Image (mainRightSide) shifted left directly against the divider & lowered */}
            <div className="absolute inset-0 z-0 flex items-end justify-start pointer-events-none">
              <img
                src="/realOne/main/mainRightSide_9x16_upscaled.webp"
                alt="FW 26 Lookbook Wanderer"
                className="h-[87%] xl:h-[89%] w-auto object-contain object-bottom -ml-5 xl:-ml-7 translate-y-1 filter brightness-[0.95] group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/40 pointer-events-none" />
            </div>

            {/* Top-Right Slide Numbers (01, 02, 03) */}
            <div className="relative z-10 flex justify-end p-5">
              <div className="flex flex-col gap-1.5 font-mono text-[11px] font-bold text-zinc-300">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCurrentSlide(num)}
                    className={cn(
                      "cursor-pointer transition-colors px-1",
                      currentSlide === num
                        ? "text-white font-extrabold border-l-2 border-white pl-1.5"
                        : "text-zinc-400 hover:text-zinc-100",
                    )}
                  >
                    0{num}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom-Right: FW 26 LOOKBOOK (Interactive) */}
            <div
              onClick={handleOpenFilm}
              className="relative z-10 p-5 xl:p-6 flex items-end cursor-pointer group/lookbook"
              title="Watch Lookbook Film"
            >
              <div>
                <div className="font-mono text-[10px] xl:text-[11px] uppercase tracking-widest text-zinc-300 group-hover/lookbook:text-white transition-colors">
                  FW 26
                </div>
                <div className="font-michroma text-sm xl:text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span>LOOKBOOK</span>
                  <Play className="w-3.5 h-3.5 fill-white text-white opacity-80 group-hover/lookbook:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE / TABLET STACKED LAYOUT (< lg) ── */}
        <div className="block lg:hidden relative z-10 px-4 sm:px-8 pt-6 sm:pt-10 pb-0">
          <div className="space-y-4 mb-6 sm:mb-8 max-w-xl mx-auto">
            <div className="space-y-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#77756F]">
              <div>FW-26</div>
              <div className="text-zinc-950 font-extrabold">RUNWAY ARCHIVE</div>
            </div>
            <h1 className="font-michroma text-2xl xs:text-3xl sm:text-4xl font-bold uppercase tracking-tight text-zinc-950 leading-[1.04]">
              BUILT
              <br />
              FOR THE
              <br />
              EVERYDAY
              <br />
              RUNWAY
            </h1>
            <p className="font-inter text-xs sm:text-sm text-zinc-700 font-medium tracking-wide uppercase leading-relaxed max-w-lg">
              TECHNICAL APPAREL FOR A FASTER, BOLDER TOMORROW. CLEAN
              SILHOUETTES. REAL-WORLD FUNCTION. TIMELESS STYLE.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleShopMenClick}
                className="w-[140px] sm:w-[160px] bg-zinc-950 hover:bg-zinc-800 text-white font-space text-xs font-bold uppercase py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs active:translate-y-0.5"
              >
                <span>SHOP MEN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleShopWomenClick}
                className="w-[140px] sm:w-[160px] bg-white hover:bg-zinc-50 text-zinc-950 border border-zinc-950 font-space text-xs font-bold uppercase py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs active:translate-y-0.5"
              >
                <span>SHOP WOMEN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile / Tablet Model & Thumbnails (Flush against bottom border) */}
          <div className="relative flex items-end justify-center gap-2.5 xs:gap-3.5 sm:gap-6 w-full max-w-2xl mx-auto">
            <div className="w-[72%] xs:w-[75%] sm:w-[68%] md:w-[64%] max-w-[240px] xs:max-w-[340px] sm:max-w-[440px] md:max-w-[500px] h-[280px] xs:h-[360px] sm:h-[450px] md:h-[520px] flex items-end justify-center">
              <img
                src={poses[activePoseIdx].src}
                alt={poses[activePoseIdx].alt}
                key={poses[activePoseIdx].src}
                className="w-full h-full object-contain object-bottom filter drop-shadow-2xl transition-all duration-300 block"
                loading="eager"
              />
            </div>
            <div className="flex flex-col gap-1.5 xs:gap-2 sm:gap-2.5 pb-2.5 sm:pb-4 shrink-0">
              {thumbImages.map((thumb) => {
                const isActive = activePoseIdx === thumb.poseIdx;
                return (
                  <button
                    key={thumb.poseIdx}
                    type="button"
                    onClick={() => setActivePoseIdx(thumb.poseIdx)}
                    className={cn(
                      "w-10 xs:w-12 sm:w-14 md:w-16 aspect-[3/4] border overflow-hidden bg-transparent flex items-center justify-center p-0.5 transition-all cursor-pointer shadow-2xs",
                      isActive
                        ? "border-zinc-950 ring-2 ring-zinc-950 scale-105"
                        : "border-[#D9D6CE] opacity-80 hover:opacity-100 hover:border-zinc-600",
                    )}
                  >
                    <img
                      src={thumb.src}
                      alt={thumb.alt}
                      className="w-full h-full object-contain object-bottom"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Lookbook Film Modal ── */}
      {isLookbookFilmOpen && (
        <div
          onClick={() => setIsLookbookFilmOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 p-5 sm:p-7 shadow-2xl text-white space-y-4"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="font-michroma text-xs font-bold uppercase tracking-wider text-zinc-200">
                  SNITCH ATELIER // FW-26 RUNWAY LOOKBOOK FILM
                </span>
                <p className="font-mono text-[10px] text-zinc-400 uppercase mt-0.5">
                  Autumn Archive / Direction 01
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLookbookFilmOpen(false)}
                className="p-1 hover:text-red-400 text-zinc-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-center p-6 space-y-3 relative overflow-hidden group">
              <img
                src="/realOne/main/Masked Techwear Wanderer.png"
                alt="Lookbook background"
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.4]"
              />
              <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-white/20 border border-white/60 flex items-center justify-center text-white backdrop-blur-xs">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
                <p className="font-mono text-xs uppercase tracking-wider text-zinc-300">
                  35mm Archival Runway Footage
                </p>
                <p className="font-inter text-xs text-zinc-400 max-w-md">
                  Captured during the FW/26 Paris runway showcase. Curated
                  exclusively for Snitch collectors.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
