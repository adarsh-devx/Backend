import { Droplets, Wind, ShieldCheck, CloudSun, ArrowRight } from "lucide-react";

export default function FabricInnovation({ onLearnMore }) {
  const specs = [
    {
      icon: Droplets,
      title: "WATER-RESISTANT",
      desc: "Stay dry. Stay moving.",
    },
    {
      icon: Wind,
      title: "BREATHABLE",
      desc: "All day comfort.",
    },
    {
      icon: ShieldCheck,
      title: "DURABLE",
      desc: "Built to last.",
    },
    {
      icon: CloudSun,
      title: "ALL-WEATHER",
      desc: "For every season.",
    },
  ];

  return (
    <section className="w-full bg-zinc-950 text-white border-b border-zinc-900 py-16 sm:py-24 select-none">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Side: Macro Material Texture & Performance Heading */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl group">
            <img
              src="/useImage/mockups/fabric_water_resistant_droplets.jpg"
              alt="SNITCH Hydrophobic Fabric Innovation"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Fine Fabric Tag Overlay */}
            <div className="absolute top-3 left-4 font-mono text-[9px] uppercase tracking-widest text-zinc-400 bg-black/60 px-2 py-0.5">
              FABRIC // 3D LAB TESTED
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h2 className="font-michroma text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-white leading-tight">
              FABRIC
              <br />
              INNOVATION™
            </h2>

            <p className="font-inter text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg">
              Engineered fabrics for real life. Water-resistant, breathable,
              durable and made to perform in changing environments.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onLearnMore}
                className="border border-zinc-700 hover:border-white text-white font-space text-xs font-bold uppercase tracking-wider px-6 py-3.5 inline-flex items-center gap-2 transition-all hover:bg-white hover:text-zinc-950 cursor-pointer shadow-xs"
              >
                <span>LEARN MORE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: 4 Technical Specification Claims */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8 lg:pl-6">
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-3 first:pt-0 border-b border-zinc-800/80 last:border-b-0 hover:bg-zinc-900/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0 shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                    {item.title}
                  </h3>
                  <p className="font-mono text-[11px] text-zinc-400 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
