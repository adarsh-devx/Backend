import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

export default function RealPeoplePlaces({ onViewCommunity }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Bidirectional parallax lift on scroll-down and scroll-up
  const leftParallax = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const rightParallax = useTransform(scrollYProgress, [0, 1], [-38, 38]);

  const easeCurve = [0.16, 1, 0.3, 1];

  return (
    <section
      ref={containerRef}
      className="w-full bg-[#e7e7e0] border-b border-zinc-300 py-16 sm:py-24 select-none overflow-hidden"
    >
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
        {/* Section Header - Slide In */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: easeCurve }}
          className="space-y-2"
        >
          <h2 className="font-michroma text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-zinc-950 leading-tight">
            REAL PEOPLE
            <br />
            REAL PLACES
          </h2>

          <p className="font-inter text-xs sm:text-sm text-zinc-600 max-w-lg leading-relaxed">
            SNITCH in the wild. From city streets to remote landscapes. Built
            for every story.
          </p>
        </motion.div>

        {/* Asymmetrical Community Gallery Layout - Converging from Left and Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Large Left Urban Streetwear Photo (4:3) - Slides from Left */}
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: easeCurve }}
            className="md:col-span-7 bg-[#eae9e2] border border-zinc-300 overflow-hidden shadow-xs relative group min-h-[380px] sm:min-h-[460px]"
          >
            <motion.img
              src="/useImage/mockups/community_streetwear_urban_4_3.jpg"
              alt="Community streetwear in urban architecture"
              style={{ y: leftParallax }}
              className="w-full h-[115%] -top-[7%] relative object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
              loading="lazy"
            />
          </motion.div>

          {/* Right Column with Stacked Portraits - Slides from Right */}
          <motion.div
            initial={{ opacity: 0, x: 70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: easeCurve, delay: 0.15 }}
            className="md:col-span-5 flex flex-col gap-5 sm:gap-6"
          >
            {/* Top Seated Portrait (16:9) */}
            <div className="bg-[#eae9e2] border border-zinc-300 overflow-hidden shadow-xs relative group aspect-[16/9]">
              <motion.img
                src="/useImage/mockups/community_louver_crouch_16_9.jpg"
                alt="Community portrait crouching against louver wall"
                style={{ y: rightParallax }}
                className="w-full h-[115%] -top-[7%] relative object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                loading="lazy"
              />
            </div>

            {/* Bottom 2 Small Detail Portraits (3:4) */}
            <div className="grid grid-cols-2 gap-5 sm:gap-6 flex-1">
              <div className="bg-[#eae9e2] border border-zinc-300 overflow-hidden shadow-xs relative group aspect-[3/4]">
                <img
                  src="/useImage/mockups/community_detail_bat_3_4.jpg"
                  alt="Streetwear apparel detail bat reaching"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="bg-[#eae9e2] border border-zinc-300 overflow-hidden shadow-xs relative group aspect-[3/4]">
                <img
                  src="/useImage/mockups/community_detail_vest_3_4.jpg"
                  alt="Streetwear apparel detail puffer vest"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* View Community CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-2"
        >
          <button
            type="button"
            onClick={onViewCommunity}
            className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-950 hover:opacity-75 transition-opacity inline-flex items-center gap-2 cursor-pointer"
          >
            <span>VIEW COMMUNITY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
