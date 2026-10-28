import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DROP_ANGLES = [
  {
    main: "/featureDrop/drop_0_4x5.png",
    thumb: "/featureDrop/drop_0_3x4.png",
    alt: "Angle 1 Front View",
  },
  {
    main: "/featureDrop/drop_1_4x5.png",
    thumb: "/featureDrop/drop_1_3x4.png",
    alt: "Angle 2 Detail View",
  },
  {
    main: "/featureDrop/drop_2_4x5.png",
    thumb: "/featureDrop/drop_2_3x4.png",
    alt: "Angle 3 Side View",
  },
  {
    main: "/featureDrop/drop_3_4x5.png",
    thumb: "/featureDrop/drop_3_3x4.png",
    alt: "Angle 4 Back View",
  },
];

export default function FeaturedDrop({ featuredProduct }) {
  const navigate = useNavigate();
  const [activeThumbIdx, setActiveThumbIdx] = useState(0);
  const totalAngles = DROP_ANGLES.length;

  const targetProductId =
    featuredProduct?._id || "6adc8023b4aa805289d00ab1";

  const handlePrev = () => {
    setActiveThumbIdx((prev) => (prev > 0 ? prev - 1 : totalAngles - 1));
  };

  const handleNext = () => {
    setActiveThumbIdx((prev) => (prev < totalAngles - 1 ? prev + 1 : 0));
  };

  return (
    <section className="w-full bg-[#e7e7e0] border-b border-zinc-300 py-16 sm:py-24 select-none">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left Column: Product Specifications & Direct Purchase CTA */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-500">
            FEATURED DROP / 01
          </div>

          <h2 className="font-michroma text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-zinc-950 leading-tight">
            BRANDED BLACK
            <br />
            AND WHITE JACKET
          </h2>

          <p className="font-inter text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-md">
            A technical shell designed for modern streets. Water-resistant,
            breathable and built for movement.
          </p>

          <div className="font-space text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight pt-1">
            ₹1,111
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate(`/products/${targetProductId}`)}
              className="bg-zinc-950 hover:bg-zinc-800 text-white font-space text-xs font-bold uppercase tracking-wider px-7 py-3.5 inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              <span>VIEW PRODUCT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center & Right Column: Garment Hero Stage + Vertical Thumbnails */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center">
            {/* Center Main Product Display (4:5 Ratio) */}
            <div
              onClick={() => navigate(`/products/${targetProductId}`)}
              className="flex-1 w-full max-w-[410px] aspect-[4/5] bg-[#eae9e2] border border-zinc-300 overflow-hidden relative shadow-xs flex items-center justify-center cursor-pointer group"
            >
              <img
                src={DROP_ANGLES[activeThumbIdx].main}
                alt={DROP_ANGLES[activeThumbIdx].alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Right Vertical Angles Strip (3:4 Ratio) */}
            <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 shrink-0">
              {DROP_ANGLES.map((angle, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveThumbIdx(idx)}
                  className={cn(
                    "w-12 sm:w-14 aspect-[3/4] bg-[#eae9e2] border overflow-hidden transition-all cursor-pointer shrink-0",
                    activeThumbIdx === idx
                      ? "border-zinc-950 ring-1 ring-zinc-950"
                      : "border-zinc-300 opacity-70 hover:opacity-100",
                  )}
                >
                  <img
                    src={angle.thumb}
                    alt={angle.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Slider Pagination & Navigation Arrows */}
          <div className="w-full max-w-[410px] flex items-center justify-between pt-4 px-2">
            <span className="font-mono text-xs font-bold tracking-widest text-zinc-500">
              0{activeThumbIdx + 1} / 0{totalAngles}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="w-7 h-7 rounded-full border border-zinc-300 hover:border-zinc-950 bg-white text-zinc-900 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105"
                title="Previous Angle"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-7 h-7 rounded-full border border-zinc-300 hover:border-zinc-950 bg-white text-zinc-900 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105"
                title="Next Angle"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
