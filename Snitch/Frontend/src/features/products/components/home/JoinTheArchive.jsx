import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";

export default function JoinTheArchive() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "success" | "error"
  const [message, setMessage] = useState("");
  const easeCurve = [0.16, 1, 0.3, 1];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("success");
    setMessage("You have been added to the Snitch Archive dispatch list.");
    setEmail("");
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 4000);
  };

  return (
    <section className="w-full bg-zinc-950 text-white border-b border-zinc-900 py-16 sm:py-24 select-none overflow-hidden">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left Column: Headline, Copy & Signup Form - Glides from Left */}
        <motion.div
          initial={{ opacity: 0, x: -75 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: easeCurve }}
          className="lg:col-span-7 space-y-5 sm:space-y-6"
        >
          <h2 className="font-michroma text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-white leading-tight">
            JOIN THE ARCHIVE
          </h2>

          <p className="font-inter text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
            Be the first to know about new drops, editorials and exclusive
            releases.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex items-center w-full max-w-md pt-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="Enter your email"
              className="flex-1 bg-transparent border border-zinc-700 focus:border-white px-4 py-3 font-mono text-xs uppercase text-white placeholder:text-zinc-500 outline-none transition-colors"
            />
            <button
              type="submit"
              className="bg-white hover:bg-zinc-200 text-zinc-950 px-4 py-3 border border-white transition-colors cursor-pointer shrink-0 flex items-center justify-center"
              title="Submit Email"
            >
              {status === "success" ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </form>

          {message && (
            <div
              className={`font-mono text-[11px] ${
                status === "success" ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {message}
            </div>
          )}
        </motion.div>

        {/* Right Column: Dark Silhouette Portrait - Glides from Right */}
        <motion.div
          initial={{ opacity: 0, x: 75 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, delay: 0.1, ease: easeCurve }}
          className="lg:col-span-5 flex items-center justify-end"
        >
          <div className="w-full max-w-[380px] aspect-[4/3] sm:aspect-[1/1] overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl group">
            <img
              src="/useImage/mockups/newsletter_archive_collector.png"
              alt="SNITCH Archive Collector"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
