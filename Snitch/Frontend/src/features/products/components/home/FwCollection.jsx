import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STORY_TILES = [
  {
    title: "CITY READY",
    image: "/FW26 Lookbook/fashion_model_1_4x3_enhanced.jpg",
  },
  {
    title: "FUNCTION FIRST",
    image: "/FW26 Lookbook/fashion_model_2_4x3_enhanced.jpg",
  },
  {
    title: "TIMELESS DESIGN",
    image: "/FW26 Lookbook/fashion_model_3_4x3_enhanced.jpg",
  },
];

export default function FwCollection({ onViewLookbook }) {
  const [activeSlide, setActiveSlide] = useState(1);

  return (
    <section
      id="fw26"
      className="w-full bg-zinc-950 text-white border-b border-zinc-900 py-10 sm:py-20 select-none"
    >
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
        {/* Top Area: Collection Headline, Copy, CTA & Large Model Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-5 sm:space-y-6">
            <h2 className="font-michroma text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
              FW/26
              <br />
              COLLECTION
            </h2>

            <p className="font-inter text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
              Urban essentials. Layered narratives. Modern silhouettes.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onViewLookbook}
                className="border border-zinc-700 hover:border-white text-white font-space text-xs font-bold uppercase tracking-wider px-6 py-3.5 inline-flex items-center gap-2 transition-all hover:bg-white hover:text-zinc-950 cursor-pointer shadow-xs"
              >
                <span>VIEW LOOKBOOK</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Hero Visual with Slide Numbering */}
          <div className="lg:col-span-7 xl:col-span-8 relative flex items-center justify-end">
            <div className="relative w-full max-w-[760px] h-[280px] sm:h-[315px] bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl group">
              <img
                src="/FW26 Lookbook/Urban Skybound Streetwear Pose.webp"
                alt="FW/26 Collection Showcase"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Slide Numbering Overlay (Top-Right) */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 font-mono text-[10px] text-zinc-400 bg-black/70 backdrop-blur-xs px-2.5 py-1 border border-zinc-800">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setActiveSlide(num)}
                    className={cn(
                      "cursor-pointer transition-colors",
                      activeSlide === num
                        ? "text-white font-bold"
                        : "text-zinc-500 hover:text-zinc-300",
                    )}
                  >
                    0{num}
                  </button>
                ))}
              </div>

              {/* Archive Tag Bottom-Right */}
              <div className="absolute bottom-3 right-4 z-10 font-mono text-[9px] uppercase tracking-widest text-zinc-400 bg-black/60 px-2 py-0.5">
                FW 26 // RUNWAY ARCHIVE
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 3 Story Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-4">
          {STORY_TILES.map((tile, idx) => (
            <div
              key={idx}
              className="relative aspect-[4/3] bg-zinc-900 border border-zinc-800 overflow-hidden group cursor-pointer shadow-sm "
            >
              <img
                src={tile.image}
                alt={tile.title}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Bottom Label Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-200 group-hover:text-white transition-colors">
                  {tile.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
