import { cn } from "@/lib/utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[110px] w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-xs transition-all duration-200 resize-y",
        "placeholder:text-zinc-400",
        "focus-visible:border-zinc-950 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
