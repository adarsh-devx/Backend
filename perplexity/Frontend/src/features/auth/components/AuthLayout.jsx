import React from "react";

const AuthLayout = ({ title, subtitle, icon, children }) => {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Background Decorative Glowing Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#6D8196]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-15%] w-[600px] h-[600px] rounded-full bg-[#6D8196]/5 blur-[150px] pointer-events-none" />

      {/* Glassmorphic Container */}
      <div className="relative z-10 w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-zinc-700/60">
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-8">
          {icon && (
            <div className="w-12 h-12 rounded-xl bg-[#6D8196] flex items-center justify-center shadow-[0_0_20px_rgba(109,129,150,0.4)] mb-4">
              {icon}
            </div>
          )}
          {title && (
            <h2 className="text-3xl font-extrabold tracking-tight text-[#FFFFE3]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-[#CBCBCB] mt-2 text-center">
              {subtitle}
            </p>
          )}
        </div>

        {/* Form or page content */}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
