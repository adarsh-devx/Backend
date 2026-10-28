import { ArrowRight } from "lucide-react";

export default function RealPeoplePlaces({ onViewCommunity }) {
  return (
    <section className="w-full bg-[#e7e7e0] border-b border-zinc-300 py-16 sm:py-24 select-none">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
        {/* Section Header */}
        <div className="space-y-2">
          <h2 className="font-michroma text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-zinc-950 leading-tight">
            REAL PEOPLE
            <br />
            REAL PLACES
          </h2>

          <p className="font-inter text-xs sm:text-sm text-zinc-600 max-w-lg leading-relaxed">
            SNITCH in the wild. From city streets to remote landscapes. Built
            for every story.
          </p>
        </div>

        {/* Asymmetrical Community Gallery Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Large Left Urban Streetwear Photo (4:3) */}
          <div className="md:col-span-7 bg-[#eae9e2] border border-zinc-300 overflow-hidden shadow-xs relative group min-h-[380px] sm:min-h-[460px]">
            <img
              src="/useImage/mockups/community_streetwear_urban_4_3.jpg"
              alt="Community streetwear in urban architecture"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* Right Column with Stacked Portraits */}
          <div className="md:col-span-5 flex flex-col gap-5 sm:gap-6">
            {/* Top Seated Portrait (16:9) */}
            <div className="bg-[#eae9e2] border border-zinc-300 overflow-hidden shadow-xs relative group aspect-[16/9]">
              <img
                src="/useImage/mockups/community_louver_crouch_16_9.jpg"
                alt="Community portrait crouching against louver wall"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
          </div>
        </div>

        {/* Bottom Right Action CTA */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onViewCommunity}
            className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-950 hover:opacity-75 transition-opacity inline-flex items-center gap-2 cursor-pointer"
          >
            <span>VIEW COMMUNITY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
