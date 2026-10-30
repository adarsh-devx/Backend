import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function BeyondApparel({ onJoinMovement }) {
  const manifestoWords = ["EXPLORE", "CREATE", "MOVE", "BELONG"];
  const easeCurve = [0.16, 1, 0.3, 1];

  return (
    <section className="relative w-full bg-zinc-950 text-white overflow-hidden border-b border-zinc-900 select-none min-h-[480px] sm:min-h-[580px] flex items-center">
      {/* Background Mountain Photo with Subtle Cinematic Zoom In */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0.8 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.4, ease: easeCurve }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/useImage/mockups/beyond_apparel_cinematic_mountain.png"
          alt="Beyond Apparel Mountain Expedition"
          className="w-full h-full object-cover object-center filter brightness-[0.88]"
          loading="lazy"
        />
        {/* Subtle Dark Vignette / Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/70 pointer-events-none" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Manifesto Story - Enters from Left */}
        <motion.div
          initial={{ opacity: 0, x: -75 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: easeCurve }}
          className="md:col-span-7 space-y-4 sm:space-y-6"
        >
          <h2 className="font-michroma text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-tight">
            BEYOND
            <br />
            APPAREL
          </h2>

          <p className="font-inter text-xs sm:text-sm text-zinc-300 max-w-md leading-relaxed font-normal">
            A mindset for a longer tomorrow. To move, to explore and to build a
            more intentional world.
          </p>
        </motion.div>

        {/* Right Stacked Editorial Words & Join CTA - Enters from Right */}
        <div className="md:col-span-5 flex flex-col md:items-end justify-between space-y-8">
          {/* Stacked Manifesto Keywords with Stagger */}
          <div className="space-y-2 text-left md:text-right">
            {manifestoWords.map((word, idx) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.75,
                  delay: 0.15 + idx * 0.1,
                  ease: easeCurve,
                }}
                className="font-michroma text-base sm:text-lg md:text-xl font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors cursor-default"
              >
                {word}
              </motion.div>
            ))}
          </div>

          {/* Join Movement Action CTA */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, delay: 0.55, ease: easeCurve }}
            className="pt-4"
          >
            <button
              type="button"
              onClick={onJoinMovement}
              className="font-mono text-xs font-bold uppercase tracking-wider text-white hover:text-zinc-300 transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>JOIN THE MOVEMENT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
