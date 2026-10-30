import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/use.auth";
import { cn } from "@/lib/utils";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertTriangle,
  Phone,
  Loader2,
  Store,
} from "lucide-react";
import GoogleButton from "../components/GoogleButton";

// ── Register Page ────────────────────────────────────────────────────────────
const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    isSeller: false,
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});

  const validateField = useCallback((field, value) => {
    let error = "";
    switch (field) {
      case "name":
        if (!String(value || "").trim()) {
          error = "REQUIRED";
        } else if (String(value || "").trim().length < 3) {
          error = "Full name must be at least 3 characters";
        }
        break;
      case "email":
        if (!value || !String(value).trim()) {
          error = "REQUIRED";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value) {
          error = "REQUIRED";
        } else if (String(value).length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      case "phone":
        if (!value || !String(value).trim()) {
          error = "REQUIRED";
        } else if (!/^\+?[\d\s\-()]{7,15}$/.test(String(value).trim())) {
          error = "Please enter a valid contact number";
        }
        break;
      case "agreeToTerms":
        if (!value) {
          error = "REQUIRED";
        }
        break;
      default:
        break;
    }
    return error;
  }, []);

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (fieldTouched[field]) {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: error || undefined }));
      }
    },
    [fieldTouched, validateField],
  );

  const handleFieldBlur = useCallback(
    (field) => {
      setFieldTouched((prev) => ({ ...prev, [field]: true }));
      const error = validateField(field, formData[field]);
      setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    },
    [formData, validateField],
  );

  const validateForm = useCallback(() => {
    const newErrors = {};
    const fields = ["name", "email", "phone", "password", "agreeToTerms"];
    fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    try {
      await handleRegister({
        fullName: formData.name,
        email: formData.email,
        contact: formData.phone,
        password: formData.password,
        isSeller: Boolean(formData.isSeller),
      });
      navigate("/");
    } catch (err) {
      setErrors({
        general: err?.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = () =>
    cn(
      "w-full h-10 pl-10 pr-4 bg-zinc-50/50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900",
      "placeholder:text-zinc-400 hover:border-zinc-300 focus:bg-white focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 transition-all",
    );

  return (
    <div className="relative min-h-screen bg-[#fbfaf8] flex items-center justify-center p-3 sm:p-4 py-6 overflow-x-hidden">
      {/* ── Background Illustration 1: User's Swallow Bird with Measuring Tape Ribbon ── */}
      <img
        src="/assets/bird.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-2 right-2 sm:top-4 sm:right-6 lg:top-5 lg:right-10 w-40 sm:w-64 md:w-80 lg:w-[420px] max-w-[40vw] object-contain mix-blend-multiply opacity-60 sm:opacity-95 z-0"
      />

      {/* ── Background Illustration 2: Bottom-Left Lookbooks, Mannequin & Botanical ── */}
      <img
        src="/assets/atelier-collage.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-3 left-3 sm:bottom-5 sm:left-6 lg:bottom-6 lg:left-8 w-28 sm:w-40 md:w-52 lg:w-64 max-w-[28vw] object-contain mix-blend-multiply opacity-55 sm:opacity-95 z-0"
      />

      {/* ── Central Form Card with High Contrast & Compact Spacing ── */}
      <div className="relative z-10 w-full max-w-[410px] mx-auto p-5 sm:p-6 bg-white border border-zinc-200/90 rounded-2xl shadow-[0_12px_40px_-6px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.02)]">
        {/* Header */}
        <div className="text-center mb-3.5">
          <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase mb-0.5 block">
            Snitch Atelier
          </span>
          <h1 className="text-xl sm:text-[1.45rem] font-bold tracking-[-0.03em] text-zinc-950 leading-tight">
            Create Account
          </h1>
          <p className="text-zinc-500 text-xs mt-0.5 font-normal">
            Join Snitch for seamless shopping & selling
          </p>
        </div>

        {/* Error banner */}
        {errors.general && (
          <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Modern Tab Switcher */}
        <div className="flex bg-zinc-100/80 rounded-xl p-1 mb-3.5">
          <Link
            to="/login"
            className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all text-center text-zinc-500 hover:text-zinc-900 cursor-pointer"
          >
            Sign In
          </Link>
          <span className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all text-center bg-white text-zinc-950 shadow-xs cursor-default">
            Sign Up
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          {/* Full Name */}
          <div>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={() => handleFieldBlur("name")}
                className={inputClass(errors.name)}
              />
            </div>
            {errors.name && errors.name !== "REQUIRED" && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleFieldBlur("email")}
                className={inputClass(errors.email)}
              />
            </div>
            {errors.email && errors.email !== "REQUIRED" && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                type="tel"
                placeholder="Contact Number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                onBlur={() => handleFieldBlur("phone")}
                className={inputClass(errors.phone)}
              />
            </div>
            {errors.phone && errors.phone !== "REQUIRED" && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onBlur={() => handleFieldBlur("password")}
                className={cn(inputClass(errors.password), "pr-10")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && errors.password !== "REQUIRED" && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          {/* Register as a seller - Animated Checkbox */}
          <div className="checkbox-wrapper-46">
            <input
              type="checkbox"
              id="cbx-seller"
              className="inp-cbx"
              checked={formData.isSeller}
              onChange={(e) => handleInputChange("isSeller", e.target.checked)}
            />
            <label htmlFor="cbx-seller" className="cbx">
              <span>
                <svg viewBox="0 0 12 10" height="9px" width="11px">
                  <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                </svg>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-700">
                <Store className="h-3.5 w-3.5 text-zinc-800 shrink-0" />
                <span className="font-semibold text-zinc-900">
                  Register as a seller
                </span>
                <span className="text-zinc-400 text-[11px]">
                  (start selling on Snitch)
                </span>
              </span>
            </label>
          </div>

          {/* Terms checkbox - Animated Checkbox */}
          <div>
            <div className="checkbox-wrapper-46">
              <input
                type="checkbox"
                id="cbx-terms"
                className="inp-cbx"
                checked={formData.agreeToTerms}
                onChange={(e) =>
                  handleInputChange("agreeToTerms", e.target.checked)
                }
              />
              <label htmlFor="cbx-terms" className="cbx">
                <span>
                  <svg viewBox="0 0 12 10" height="9px" width="11px">
                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                  </svg>
                </span>
                <span className="text-zinc-500 text-[11px] sm:text-xs">
                  I agree to the{" "}
                  <a
                    href="#"
                    onClick={(e) => e.stopPropagation()}
                    className="text-zinc-950 font-medium underline underline-offset-2 hover:text-zinc-700"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    onClick={(e) => e.stopPropagation()}
                    className="text-zinc-950 font-medium underline underline-offset-2 hover:text-zinc-700"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-[11px] mt-1 pl-6.5 flex items-center gap-1 font-medium">
                <AlertTriangle className="h-3 w-3 shrink-0" />
                {errors.agreeToTerms}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 mt-1 bg-zinc-950 text-white font-semibold rounded-xl text-xs sm:text-sm tracking-wider uppercase hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Account...
              </span>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Social Login Separator */}
        <div className="relative my-3 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200" />
          </div>
          <span className="relative bg-white/80 backdrop-blur-xs px-2.5 text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
            or continue with
          </span>
        </div>

        {/* Google Button */}
        <GoogleButton className="h-10" />
      </div>
    </div>
  );
};

export default Register;
