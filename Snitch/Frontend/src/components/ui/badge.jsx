import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, variant = "default", ...props }) {
  return (
    <div
      data-slot="badge"
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-colors gap-1",
        variant === "default" && "border-transparent bg-zinc-950 text-white",
        variant === "secondary" && "border-transparent bg-zinc-100 text-zinc-900",
        variant === "outline" && "border-zinc-200 text-zinc-700 bg-white/80",
        variant === "success" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        variant === "destructive" && "border-red-200 bg-red-50 text-red-700",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
