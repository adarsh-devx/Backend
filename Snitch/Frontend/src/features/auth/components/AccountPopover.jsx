import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  X,
  Package,
  LayoutDashboard,
  LogOut,
  ArrowRight,
  Edit3,
  ChevronDown,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react";
import { useAuth } from "../hook/use.auth";
import GoogleButton from "./GoogleButton";

export default function AccountPopover({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState("view"); // "view" | "edit"
  const [expandedSection, setExpandedSection] = useState("profile"); // "profile" | "address" | null
  const [emailInput, setEmailInput] = useState("");
  const popoverRef = useRef(null);
  const navigate = useNavigate();
  const { user, handleLogout, handleUpdateProfile, handleUpdateAddresses } =
    useAuth();

  // Edit form state
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");

  const [street, setStreet] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state with user details whenever user changes or popover opens
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setContact(user.contact || "");
      setPassword("");
      const primaryAddress = user.addresses?.[0] || {};
      setStreet(primaryAddress.street || "");
      setPincode(primaryAddress.pincode || "");
      setCity(primaryAddress.city || "");
      setState(primaryAddress.state || "");
    }
  }, [user, isOpen]);

  // When popover closes, reset back to "view" mode
  useEffect(() => {
    if (!isOpen) {
      setViewMode("view");
      setExpandedSection("profile");
      setSaveSuccess(false);
    }
  }, [isOpen]);

  // Close on outside click (protected while in "edit" mode so user doesn't lose progress)
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        if (viewMode === "edit") {
          // If editing, don't accidentally close on outside click to prevent data loss
          return;
        }
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, viewMode]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        if (viewMode === "edit") {
          setViewMode("view");
        } else {
          setIsOpen(false);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, viewMode]);

  const handleQuickEmailSubmit = (e) => {
    e.preventDefault();
    setIsOpen(false);
    navigate(`/login${emailInput ? `?email=${encodeURIComponent(emailInput)}` : ""}`);
  };

  const onSignOut = async () => {
    await handleLogout();
    setIsOpen(false);
    navigate("/");
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      // 1. Update Profile info
      await handleUpdateProfile({
        fullName,
        contact,
        ...(password.trim() ? { password } : {}),
      });

      // 2. If any address field is entered, update primary address
      if (street.trim() || city.trim() || pincode.trim() || state.trim()) {
        const existingAddresses = user?.addresses || [];
        const updatedAddress = {
          fullName: fullName || user?.fullName || "User",
          phone: contact || user?.contact || "0000000000",
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          isDefault: true,
        };
        const newAddressesList =
          existingAddresses.length > 0
            ? [
                updatedAddress,
                ...existingAddresses
                  .slice(1)
                  .map((a) => ({ ...a, isDefault: false })),
              ]
            : [updatedAddress];

        await handleUpdateAddresses(newAddressesList);
      }

      setSaveSuccess(true);
      setPassword("");
      setTimeout(() => {
        setSaveSuccess(false);
        setViewMode("view");
      }, 700);
    } catch (err) {
      console.error("Save changes error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div ref={popoverRef} className={`relative inline-block ${className}`}>
      {/* ── User Icon Trigger ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-1 hover:text-zinc-950 text-zinc-700 transition-colors cursor-pointer flex items-center justify-center"
        title="Account"
        aria-label="Account Menu"
        aria-expanded={isOpen}
      >
        <User className="w-4 h-4" />
      </button>

      {/* ── Floating Account Card Popover ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-[340px] sm:w-[360px] max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-zinc-200 z-50 p-5 font-space select-none"
          >
            {user ? (
              viewMode === "view" ? (
                /* ── VIEW 1: MY ACCOUNT (Option 1) ── */
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                    <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">
                      My Account
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="p-1 text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer rounded-full hover:bg-zinc-100"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* User Info Row */}
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-zinc-950 truncate">
                          {user.fullName || "User"}
                        </p>
                        {user.role === "seller" && (
                          <span className="inline-block mt-0.5 text-[9px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 bg-zinc-100 text-zinc-800 border border-zinc-200">
                            Seller Atelier
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("edit");
                        setExpandedSection("profile");
                      }}
                      className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-950 font-medium px-2 py-1 rounded hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
                      title="Edit profile & address"
                    >
                      <span className="text-[11px]">Edit</span>
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2 border-t border-zinc-100">
                    {user.role === "seller" && (
                      <Link
                        to="/seller/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <LayoutDashboard className="w-4 h-4 text-zinc-700" />
                          <span>Seller Dashboard</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        to="/cart"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 py-2.5 px-3 border border-zinc-200 hover:border-zinc-950 text-xs font-bold text-zinc-800 transition-colors"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Orders</span>
                      </Link>
                      <button
                        type="button"
                        onClick={onSignOut}
                        className="flex items-center justify-center gap-2 py-2.5 px-3 border border-zinc-200 hover:border-red-400 hover:text-red-600 text-xs font-bold text-zinc-800 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ── VIEW 2: IN-PLACE EDIT VIEW (With Profile & Address Accordions) ── */
                <form onSubmit={handleSaveChanges} className="space-y-3">
                  {/* Header: EDIT */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
                    <span className="text-xs font-mono uppercase tracking-widest text-zinc-950 font-bold">
                      Edit
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewMode("view")}
                      className="p-1 text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer rounded-full hover:bg-zinc-100"
                      aria-label="Back to Account"
                      title="Back to Account"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* ── ACCORDION 1: PROFILE ── */}
                  <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSection((prev) =>
                          prev === "profile" ? null : "profile"
                        )
                      }
                      className="w-full flex items-center justify-between p-3 text-left font-mono text-xs font-bold text-zinc-900 bg-zinc-50/80 hover:bg-zinc-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {expandedSection === "profile" ? (
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                        )}
                        <span className="uppercase tracking-wider">Profile</span>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {expandedSection === "profile" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="p-3.5 space-y-3 border-t border-zinc-100">
                            <div>
                              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1">
                                Full Name
                              </label>
                              <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="e.g. Adii"
                                required
                                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-none focus:border-zinc-950 font-space"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1">
                                Contact
                              </label>
                              <input
                                type="tel"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder="e.g. 4541545245"
                                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-none focus:border-zinc-950 font-space"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1">
                                Password
                              </label>
                              <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Leave blank to keep current"
                                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-none focus:border-zinc-950 font-space"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── ACCORDION 2: ADDRESS ── */}
                  <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSection((prev) =>
                          prev === "address" ? null : "address"
                        )
                      }
                      className="w-full flex items-center justify-between p-3 text-left font-mono text-xs font-bold text-zinc-900 bg-zinc-50/80 hover:bg-zinc-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {expandedSection === "address" ? (
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                        )}
                        <span className="uppercase tracking-wider">Address</span>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {expandedSection === "address" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="p-3.5 space-y-3 border-t border-zinc-100">
                            <div>
                              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1">
                                Address (Area and Street)
                              </label>
                              <input
                                type="text"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                placeholder="e.g. Flat 4B, Baker St"
                                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-none focus:border-zinc-950 font-space"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1">
                                Pincode
                              </label>
                              <input
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                placeholder="e.g. 400001"
                                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-none focus:border-zinc-950 font-space"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1">
                                  City
                                </label>
                                <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g. Mumbai"
                                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-none focus:border-zinc-950 font-space"
                              />
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1">
                                  State
                                </label>
                                <input
                                  type="text"
                                  value={state}
                                  onChange={(e) => setState(e.target.value)}
                                  placeholder="e.g. Maharashtra"
                                  className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-none focus:border-zinc-950 font-space"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── SAVE CHANGES BUTTON ── */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full py-2.5 px-4 bg-zinc-950 text-white rounded-lg text-xs font-mono uppercase font-bold tracking-wider hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : saveSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Saved!</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </form>
              )
            ) : (
              /* ── Logged Out State (Exact Nike Shopify layout) ── */
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-950 font-space">
                    Sign in or create account
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer rounded-full hover:bg-zinc-100"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Google Sign In Button */}
                <div className="pt-1">
                  <GoogleButton />
                </div>

                {/* Divider OR */}
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200" />
                  </div>
                  <div className="relative flex justify-center text-[11px] text-zinc-400 uppercase font-mono tracking-wider">
                    <span className="bg-white px-2">OR</span>
                  </div>
                </div>

                {/* Quick Email Form */}
                <form onSubmit={handleQuickEmailSubmit} className="space-y-2">
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Email"
                      className="w-full px-3.5 py-2.5 text-xs border border-zinc-300 rounded-lg outline-none focus:border-black font-space pr-10 transition-colors"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 p-1.5 text-zinc-500 hover:text-black cursor-pointer transition-colors"
                      title="Continue"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <input
                      type="checkbox"
                      id="news-offers"
                      defaultChecked
                      className="w-3.5 h-3.5 rounded accent-black"
                    />
                    <label
                      htmlFor="news-offers"
                      className="text-[11px] text-zinc-500 select-none cursor-pointer"
                    >
                      Email me with news and offers
                    </label>
                  </div>
                </form>

                {/* Bottom Shortcuts (Orders & Profile) */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 py-2 px-3 border border-zinc-200 hover:border-black text-xs font-medium text-zinc-800 transition-colors rounded-lg"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Orders</span>
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 py-2 px-3 border border-zinc-200 hover:border-black text-xs font-medium text-zinc-800 transition-colors rounded-lg"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
