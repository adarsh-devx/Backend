import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

export default function StreetsToArchive({ onReadEditorial }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Bidirectional parallax lift on scroll-down and scroll-up
  const editorialParallax = useTransform(scrollYProgress, [0, 1], [-26, 26]);
  const easeCurve = [0.16, 1, 0.3, 1];

  return (
    <section
      ref={containerRef}
      id="editorial"
      className="w-full bg-[#e7e7e0] border-b border-zinc-300 py-16 sm:py-24 select-none overflow-hidden"
    >
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left Column: Editorial Headline & Copy - Glides in from Left */}
        <motion.div
          initial={{ opacity: 0, x: -75 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: easeCurve }}
          className="lg:col-span-5 space-y-5 sm:space-y-6"
        >
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-500">
            EDITORIAL
          </div>

          <h2 className="font-michroma text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-zinc-950 leading-tight">
            STREETS
            <br />
            TO ARCHIVE
          </h2>

          <p className="font-inter text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-md">
            Real people. Real places. Pieces that live beyond seasons.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={onReadEditorial}
              className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-950 hover:opacity-75 transition-opacity inline-flex items-center gap-2 cursor-pointer"
            >
              <span>READ EDITORIAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-4 font-mono text-xs font-bold tracking-widest text-zinc-500">
            01 / 01
          </div>
        </motion.div>

        {/* Right Column: Streetwear Model Photograph - Glides in from Right */}
        <motion.div
          initial={{ opacity: 0, x: 75 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: easeCurve }}
          className="lg:col-span-7 relative flex items-center justify-center"
        >
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#eae9e2] border border-zinc-300 overflow-hidden shadow-sm group">
            <motion.img
              src="/useImage/mockups/streets_to_archive_moto_editorial.jpg"
              alt="Streets to Archive Editorial Photograph"
              style={{ y: editorialParallax }}
              className="w-full h-[115%] -top-[7%] relative object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
