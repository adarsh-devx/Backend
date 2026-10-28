import React, { memo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMotionValue, animate, motion } from "motion/react";
import useMeasure from "react-use-measure";

const InfiniteSlider = memo(function InfiniteSlider({
  children,
  gap = 24,
  duration = 35,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const size = direction === "horizontal" ? width : height;
    if (!size) return;
    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    let controls;

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration:
          currentDuration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prev) => prev + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: "linear",
        duration: currentDuration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => translation.set(from),
      });
    }

    return () => controls?.stop();
  }, [
    key,
    translation,
    currentDuration,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
  ]);

  const hoverProps = durationOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentDuration(durationOnHover);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setCurrentDuration(duration);
        },
      }
    : {};

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        ref={ref}
        className="flex w-max items-center"
        style={{
          ...(direction === "horizontal"
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
});

const LogoItem = memo(function LogoItem({ logo }) {
  if (typeof logo === "string") {
    return (
      <div className="flex items-center gap-4 px-2 select-none">
        <span className="font-michroma text-[11px] sm:text-xs font-bold tracking-[0.25em] text-zinc-700 uppercase whitespace-nowrap hover:text-zinc-950 transition-colors">
          {logo}
        </span>
        <span className="text-zinc-400 font-mono text-[10px] select-none">
          //
        </span>
      </div>
    );
  }

  if (logo?.text) {
    return (
      <div className="flex items-center gap-4 px-2 select-none">
        <span className="font-michroma text-[11px] sm:text-xs font-bold tracking-[0.25em] text-zinc-700 uppercase whitespace-nowrap hover:text-zinc-950 transition-colors">
          {logo.text}
        </span>
        <span className="text-zinc-400 font-mono text-[10px] select-none">
          //
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 px-2 select-none">
      <img
        alt={logo.alt || "Brand Logo"}
        src={logo.src}
        width={logo.width ?? "auto"}
        height={logo.height ?? "auto"}
        loading="lazy"
        className="pointer-events-none h-4 sm:h-5 select-none opacity-60 hover:opacity-100 transition-opacity grayscale object-contain"
      />
      <span className="text-zinc-400 font-mono text-[10px] select-none">
        //
      </span>
    </div>
  );
});

export const LogoMarquee = memo(function LogoMarquee({
  logos = [],
  children,
  className,
  duration = 42,
  durationOnHover = 70,
  gap = 36,
  reverse = false,
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden py-3.5 border-y border-zinc-300/80 bg-[#e3e2dc]/80 backdrop-blur-xs [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className,
      )}
    >
      <InfiniteSlider
        gap={gap}
        reverse={reverse}
        duration={duration}
        durationOnHover={durationOnHover}
      >
        {children
          ? children
          : [...logos, ...logos].map((logo, i) => (
              <LogoItem
                key={
                  typeof logo === "string"
                    ? `${logo}-${i}`
                    : `${logo.alt || logo.text || i}-${i}`
                }
                logo={logo}
              />
            ))}
      </InfiniteSlider>
    </div>
  );
});

LogoMarquee.displayName = "LogoMarquee";
export default LogoMarquee;
