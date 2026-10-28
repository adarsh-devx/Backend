import { Globe, ShieldCheck, Box, Leaf } from "lucide-react";

export default function BrandTrustStrip() {
  const promises = [
    {
      icon: Globe,
      title: "GLOBAL DISPATCH",
      desc: "Worldwide Shipping",
    },
    {
      icon: ShieldCheck,
      title: "ATELIER VERIFIED",
      desc: "Premium Quality",
    },
    {
      icon: Box,
      title: "LIMITED RELEASES",
      desc: "Curated Pieces",
    },
    {
      icon: Leaf,
      title: "SUSTAINABLE",
      desc: "Ethically Sourced",
    },
  ];

  return (
    <section className="w-full bg-[#e7e7e0] border-b border-zinc-300 select-none">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-5 grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-300/80">
        {promises.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 pt-3 sm:pt-0 sm:px-4 first:pl-0 last:pr-0"
            >
              <div className="w-8 h-8 rounded-full bg-white/70 border border-zinc-300 flex items-center justify-center shrink-0 text-zinc-900 shadow-2xs">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-950 truncate">
                  {p.title}
                </div>
                <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-tight">
                  {p.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
