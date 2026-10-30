import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

const DROP_ANGLES = [
  {
    main: "/featureDrop/drop_0_4x5.webp",
    thumb: "/featureDrop/drop_0_3x4.webp",
    alt: "Angle 1 Front View",
  },
  {
    main: "/featureDrop/drop_1_4x5.webp",
    thumb: "/featureDrop/drop_1_3x4.webp",
    alt: "Angle 2 Detail View",
  },
  {
    main: "/featureDrop/drop_2_4x5.webp",
    thumb: "/featureDrop/drop_2_3x4.webp",
    alt: "Angle 3 Side View",
  },
  {
    main: "/featureDrop/drop_3_4x5.webp",
    thumb: "/featureDrop/drop_3_3x4.webp",
    alt: "Angle 4 Back View",
  },
];

export default function FeaturedDrop({ featuredProduct }) {
  const navigate = useNavigate();
  const [activeThumbIdx, setActiveThumbIdx] = useState(0);
  const totalAngles = DROP_ANGLES.length;
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Bidirectional parallax lift on scroll-down and scroll-up
  const dropParallax = useTransform(scrollYProgress, [0, 1], [-12, 12]);

  const targetProductId =
    featuredProduct?._id || "6adc8023b4aa805289d00ab1";

  const handlePrev = () => {
    setActiveThumbIdx((prev) => (prev > 0 ? prev - 1 : totalAngles - 1));
  };

  const handleNext = () => {
    setActiveThumbIdx((prev) => (prev < totalAngles - 1 ? prev + 1 : 0));
  };

  return (
    <section
      ref={containerRef}
      className="w-full bg-[#e7e7e0] border-b border-zinc-300 py-16 sm:py-24 select-none overflow-hidden"
    >
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left Column: Product Specifications & Direct Purchase CTA - Glides in from Left */}
        <motion.div
          initial={{ opacity: 0, x: -75 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 space-y-5 sm:space-y-6"
        >
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
        </motion.div>

        {/* Center & Right Column: Garment Hero Stage + Vertical Thumbnails - Glides in from Right */}
        <motion.div
          initial={{ opacity: 0, x: 75 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col items-center"
        >
          <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center">
            {/* Center Main Product Display (Sleek Studio 4:5 Stage) */}
            <div
              onClick={() => navigate(`/products/${targetProductId}`)}
              className="w-full max-w-[340px] aspect-[4/5] bg-[#eae9e2] border border-zinc-300 overflow-hidden relative shadow-xs flex items-center justify-center cursor-pointer group p-3 sm:p-4"
            >
              <motion.img
                src={DROP_ANGLES[activeThumbIdx].main}
                alt={DROP_ANGLES[activeThumbIdx].alt}
                style={{ y: dropParallax }}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 will-change-transform"
                loading="lazy"
              />
            </div>

            {/* Right Vertical Angles Strip (Compact 3:4 Thumbnails) */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 shrink-0">
              {DROP_ANGLES.map((angle, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveThumbIdx(idx)}
                  className={cn(
                    "w-10 sm:w-11 aspect-[3/4] bg-[#eae9e2] border overflow-hidden transition-all cursor-pointer shrink-0 p-0.5",
                    activeThumbIdx === idx
                      ? "border-zinc-950 ring-1 ring-zinc-950"
                      : "border-zinc-300 opacity-70 hover:opacity-100",
                  )}
                >
                  <img
                    src={angle.thumb}
                    alt={angle.alt}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Slider Pagination & Navigation Arrows */}
          <div className="w-full max-w-[340px] flex items-center justify-between pt-3 px-1">
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
        </motion.div>
      </div>
    </section>
  );
}
