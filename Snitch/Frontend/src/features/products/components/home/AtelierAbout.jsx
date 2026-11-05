import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

/**
 * AtelierAbout (Section: The Noirvayn Atelier)
 * Anti-AI-slop brutalist editorial manifesto:
 * 1. Monolithic architectural discipline over seasonal trends
 * 2. High-contrast typography (Michroma + Mono)
 * 3. Authentic studio collage & tactile technical specifications
 * 4. Zero generic buzzwords; authentic atelier voice
 */
export default function AtelierAbout() {
  const easeCurve = [0.16, 1, 0.3, 1];

  const pillars = [
    {
      index: "01",
      title: "MONOLITHIC PURISM",
      subtitle: "OBSIDIAN // CONCRETE // BLEACHED BONE",
      desc: "We eliminate chromatic noise. By restricting our palette to elemental tones, the eye is forced to register pure form, textural weight, and structural silhouette.",
    },
    {
      index: "02",
      title: "ANTI-SEASONAL CADENCE",
      subtitle: "PERMANENCE OVER THE TREND CYCLE",
      desc: "Fast fashion thrives on planned obsolescence. Noirvayn constructs pieces designed to age with dignity across decades, never bound to artificial quarterly calendars.",
    },
    {
      index: "03",
      title: "ANATOMICAL ENGINEERING",
      subtitle: "DROP SHOULDER // ARTICULATED FIT",
      desc: "Every pattern is draped on living bodies in motion. Reinforced double-needle French seams, high-density ribbing, and custom hardware engineered for the street.",
    },
  ];

  return (
    <section
      id="about"
      className="w-full bg-[#F3F1E9] text-zinc-950 border-b border-[#D9D6CE] py-10 sm:py-14 select-none overflow-hidden relative"
    >
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header with Technical Serial Metadata */}
        <div className="border-b-2 border-zinc-950 pb-4 mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-zinc-600 font-bold">
              <span className="w-2 h-2 bg-[#CC171C] inline-block" />
              <span>SECTION 14 // THE ATELIER MANIFESTO</span>
            </div>
            <h2 className="font-michroma text-lg sm:text-xl md:text-2xl lg:text-[26px] font-bold uppercase tracking-tight text-zinc-950 leading-snug">
              ARCHITECTURAL DISCIPLINE.
              <br />
              GARMENTS FOR PERMANENCE.
            </h2>
          </div>
          <div className="font-mono text-xs text-zinc-600 uppercase tracking-widest text-left md:text-right shrink-0">
            <span>NOIRVAYN ATELIER // DEL</span>
            <br />
            <span className="text-zinc-400">EST. 2026 // EDITION 01</span>
          </div>
        </div>

        {/* 2-Column Asymmetrical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Left Column: Visual Studio Artwork (Refined Editorial Proportion) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: easeCurve }}
            className="lg:col-span-4 flex justify-center lg:justify-start"
          >
            <div className="w-full max-w-[270px] sm:max-w-[290px] border-2 border-zinc-950 bg-zinc-900 overflow-hidden shadow-[4px_4px_0px_#18181b]">
              <img
                src="/assets/atelier-collage.webp"
                alt="Noirvayn Atelier Craftsmanship Collage"
                className="w-full aspect-[3/4] object-cover object-center filter contrast-[1.05] brightness-[0.96] hover:scale-102 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Right Column: Manifesto Statement + 3 Tactical Pillars */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* The Brand Narrative Lead */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: easeCurve }}
              className="space-y-2.5"
            >
              <p className="font-inter text-sm sm:text-base text-zinc-800 leading-relaxed font-medium">
                Noirvayn was founded on a singular premise: streetwear had surrendered its soul to hyper-disposable trend chasing. We build in opposition.
              </p>
              <p className="font-inter text-xs sm:text-[13px] text-zinc-600 leading-relaxed max-w-2xl">
                Drawing direct inspiration from brutalist monoliths, industrial utility, and high-density textile engineering, every piece in our archive is crafted to feel like armour for the modern urban wanderer. Form does not compromise for comfort; it commands it.
              </p>
            </motion.div>

            {/* 3 Pillars Divided by Stiff Hairlines */}
            <div className="border-t-2 border-zinc-950 divide-y divide-zinc-300">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: easeCurve }}
                  className="py-3.5 sm:py-4 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-5 items-baseline group"
                >
                  <div className="md:col-span-4 flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#CC171C] group-hover:scale-110 transition-transform">
                      {pillar.index}
                    </span>
                    <div>
                      <h3 className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-wider text-zinc-950">
                        {pillar.title}
                      </h3>
                      <p className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase mt-0.5">
                        {pillar.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="md:col-span-8 font-inter text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Interactive Callout to Runway Catalog */}
            <div className="pt-1 flex items-center gap-4">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-zinc-950 hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[3px_3px_0px_#71717a] active:translate-y-0.5 active:shadow-none cursor-pointer"
              >
                <span>EXPLORE THE RUNWAY ARCHIVE</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

