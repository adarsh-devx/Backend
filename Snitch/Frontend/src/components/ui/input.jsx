import { cn } from "@/lib/utils";

function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 shadow-xs transition-all duration-200",
        "placeholder:text-zinc-400 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "focus-visible:border-zinc-950 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
        className
      )}
      {...props}
    />
  );
}

export { Input };
