import { Link } from "react-router";

export default function AtelierFooter() {
  const shopLinks = [
    { label: "All Apparel", href: "#catalog" },
    { label: "New Arrivals", href: "#catalog" },
    { label: "Best Sellers", href: "#catalog" },
    { label: "Collections", href: "#fw26" },
    { label: "Accessories", href: "#catalog" },
  ];

  const companyLinks = [
    { label: "About", href: "#philosophy" },
    { label: "Editorial", href: "#editorial" },
    { label: "Atelier", href: "#philosophy" },
    { label: "Sustainability", href: "#philosophy" },
    { label: "Careers", href: "#careers" },
  ];

  const supportLinks = [
    { label: "Help Center", href: "#help" },
    { label: "Shipping", href: "#shipping" },
    { label: "Returns", href: "#returns" },
    { label: "Size Guide", href: "#size-guide" },
    { label: "Contact", href: "#contact" },
  ];

  const followLinks = [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "X (Twitter)", href: "https://x.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "Pinterest", href: "https://pinterest.com" },
    { label: "Spotify", href: "https://spotify.com" },
  ];

  return (
    <footer className="w-full bg-black text-white select-none border-t border-zinc-900">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 pt-14 sm:pt-20 pb-8 space-y-12 sm:space-y-16">
        {/* Top 5 Columns Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Brand Wordmark */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link
              to="/"
              className="font-michroma text-xl font-bold tracking-[0.25em] uppercase text-white hover:opacity-80 transition-opacity block"
            >
              SNITCH
            </Link>
          </div>

          {/* Column 2: SHOP */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
              SHOP
            </h4>
            <ul className="space-y-2 font-mono text-xs text-zinc-500">
              {shopLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: COMPANY */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
              COMPANY
            </h4>
            <ul className="space-y-2 font-mono text-xs text-zinc-500">
              {companyLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: SUPPORT */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
              SUPPORT
            </h4>
            <ul className="space-y-2 font-mono text-xs text-zinc-500">
              {supportLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: FOLLOW */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
              FOLLOW
            </h4>
            <ul className="space-y-2 font-mono text-xs text-zinc-500">
              {followLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Currency, Copyright, Legal */}
        <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-zinc-500 uppercase tracking-widest text-center sm:text-left">
          <div>INDIA (INR) | ENGLISH</div>
          <div>&copy; 2026 SNITCH. ALL RIGHTS RESERVED.</div>
          <div className="flex items-center gap-4">
            <a href="#terms" className="hover:text-white transition-colors">
              TERMS
            </a>
            <a href="#privacy" className="hover:text-white transition-colors">
              PRIVACY
            </a>
            <a href="#cookies" className="hover:text-white transition-colors">
              COOKIES
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
