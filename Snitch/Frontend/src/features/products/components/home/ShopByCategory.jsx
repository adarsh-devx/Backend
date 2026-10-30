import { motion } from "motion/react";

const CATEGORIES = [
  {
    name: "SHIRTS",
    slug: "shirt",
    image: "/catagory/shirt.webp",
  },
  {
    name: "TROUSERS",
    slug: "trouser",
    image: "/catagory/trousers.webp",
  },
  {
    name: "T-SHIRTS",
    slug: "t-shirt",
    image: "/catagory/t-shirt.webp",
  },
  {
    name: "JEANS",
    slug: "jeans",
    image: "/catagory/jeans.webp",
  },
  {
    name: "OUTERWEAR",
    slug: "outerwear",
    image: "/catagory/outerwear.webp",
  },
];

export default function ShopByCategory({ onSelectCategory }) {
  const handleCategoryClick = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category.slug);
    }
    const catalogEl = document.getElementById("catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShopAll = () => {
    if (onSelectCategory) {
      onSelectCategory("all");
    }
    const catalogEl = document.getElementById("catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const easeCurve = [0.16, 1, 0.3, 1];

  return (
    <section className="w-full bg-[#fbfbf9] border-b border-zinc-200 py-8 sm:py-12 select-none overflow-hidden">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header with Title and Orange Underline - Smooth Slide In */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: easeCurve }}
          className="mb-6 sm:mb-8"
        >
          <div className="inline-block">
            <h2 className="text-xl sm:text-2xl lg:text-[25px] tracking-tight text-zinc-900 leading-tight">
              <span className="font-light block text-base sm:text-lg text-zinc-600 tracking-wide mb-0.5">
                SHOP BY
              </span>
              <span className="font-extrabold block tracking-tight text-zinc-950 text-xl sm:text-2xl lg:text-[26px]">
                CATEGORY
              </span>
            </h2>
            <div className="h-[2.5px] w-full bg-[#f1592a] mt-1.5 rounded-full" />
          </div>
        </motion.div>

        {/* Categories Row (5 columns with staggered wave entrance) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 items-start justify-items-center">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.65,
                delay: idx * 0.1,
                ease: easeCurve,
              }}
              onClick={() => handleCategoryClick(cat)}
              className="group flex flex-col items-center justify-start cursor-pointer w-full"
            >
              <div className="w-full max-w-[190px] sm:max-w-[220px] md:max-w-[240px] lg:max-w-[260px] h-[190px] sm:h-[220px] md:h-[250px] lg:h-[270px] flex items-center justify-center relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="max-h-full max-w-full object-contain drop-shadow-xs transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-1.5"
                  loading="lazy"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* SHOP ALL Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 sm:mt-8"
        >
          <button
            type="button"
            onClick={handleShopAll}
            className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-zinc-900 hover:text-[#f1592a] underline underline-offset-4 decoration-zinc-400 hover:decoration-[#f1592a] transition-all cursor-pointer"
          >
            SHOP ALL
          </button>
        </motion.div>
      </div>
    </section>
  );
}
