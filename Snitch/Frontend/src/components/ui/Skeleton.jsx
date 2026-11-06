import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-zinc-300/70 border border-zinc-200/50",
        className
      )}
      {...props}
    />
  );
}

export default Skeleton;

