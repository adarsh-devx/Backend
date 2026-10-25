import * as React from "react";
import { cn } from "@/lib/utils";

function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      data-slot="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 cursor-pointer select-none active:scale-[0.98]",
        variant === "default" &&
          "bg-zinc-950 text-white shadow-sm hover:bg-zinc-800",
        variant === "destructive" &&
          "bg-red-600 text-white shadow-xs hover:bg-red-700 focus-visible:ring-red-500/30",
        variant === "outline" &&
          "border border-zinc-200 bg-white text-zinc-900 shadow-xs hover:bg-zinc-50 hover:border-zinc-300",
        variant === "secondary" &&
          "bg-zinc-100 text-zinc-900 shadow-xs hover:bg-zinc-200/80",
        variant === "ghost" &&
          "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950",
        variant === "link" &&
          "text-zinc-900 underline-offset-4 hover:underline",
        size === "default" && "h-10 px-4 py-2",
        size === "sm" && "h-8 rounded-md px-3 text-xs gap-1.5",
        size === "lg" && "h-11 rounded-lg px-6 text-sm font-semibold",
        size === "icon" && "size-9 rounded-md",
        className
      )}
      {...props}
    />
  );
}

export { Button };
