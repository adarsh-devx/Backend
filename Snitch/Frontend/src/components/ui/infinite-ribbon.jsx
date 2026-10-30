import { cn } from "@/lib/utils";

export function InfiniteRibbon({
  repeat = 4,
  duration = 32,
  reverse = false,
  rotation = 0,
  children,
  className,
}) {
  const repeatCount = Math.max(1, Math.floor(repeat));
  const animationName = reverse
    ? "iconiq-infinite-ribbon-reverse"
    : "iconiq-infinite-ribbon";

  return (
    <div
      className={cn(
        "w-[160vw] min-w-[2200px] shrink-0 overflow-hidden bg-[#e3e2dc] py-1.5 sm:py-2 text-zinc-950 font-space text-xs sm:text-[13px] font-extrabold uppercase tracking-widest border-y border-zinc-400/80 shadow-md select-none will-change-transform",
        className,
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <span className="sr-only">{children}</span>
      <div
        aria-hidden="true"
        className="iconiq-infinite-ribbon-track flex w-max whitespace-nowrap will-change-transform"
        style={{
          animationName: animationName,
          animationDuration: `${Math.max(0.1, duration)}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: "running",
          WebkitAnimationName: animationName,
          WebkitAnimationDuration: `${Math.max(0.1, duration)}s`,
          WebkitAnimationTimingFunction: "linear",
          WebkitAnimationIterationCount: "infinite",
        }}
      >
        {Array.from({ length: repeatCount * 2 }, (_, index) => (
          <span className="mr-8 inline-block select-none shrink-0" key={index}>
            {children}
          </span>
        ))}
      </div>
    </div>
  );
}

export function InfiniteRibbonMarquee({
  text = "SNITCH ATELIER // AUTUMN WINTER 2026 // TOKYO RUNWAY ARCHIVE // TECHNICAL SHELL INNOVATION // LIMITED RUN DROPS // STREETS TO ARCHIVE // PARIS EDITORIAL //",
  duration = 38,
  rotation = 2.6,
  className,
}) {
  return (
    <div
      className={cn(
        "relative w-full h-24 sm:h-28 overflow-hidden bg-[#e7e7e0] border-y border-zinc-300 select-none",
        className,
      )}
    >
      {/* Tape 1 Layer: Centered Overlay (Left-moving) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <InfiniteRibbon
          className="bg-[#e3e2dc] text-zinc-950 border-y border-zinc-400/80 shadow-md"
          duration={duration}
          rotation={rotation}
        >
          {text}
        </InfiniteRibbon>
      </div>

      {/* Tape 2 Layer: Centered Overlay (Right-moving cross) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <InfiniteRibbon
          className="bg-[#d8d6ce] text-zinc-950 border-y border-zinc-400/90 shadow-xl"
          duration={duration}
          reverse={true}
          rotation={-rotation}
        >
          {text}
        </InfiniteRibbon>
      </div>
    </div>
  );
}

export default InfiniteRibbonMarquee;
