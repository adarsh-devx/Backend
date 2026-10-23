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

// ── Password strength ────────────────────────────────────────────────────────
const calculatePasswordStrength = (password) => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };
  const score = Object.values(requirements).filter(Boolean).length;
  const feedback = [];
  if (!requirements.length) feedback.push("At least 8 characters");
  if (!requirements.uppercase) feedback.push("One uppercase letter");
  if (!requirements.lowercase) feedback.push("One lowercase letter");
  if (!requirements.number) feedback.push("One number");
  if (!requirements.special) feedback.push("One special character");
  return { score, feedback };
};

const PasswordStrengthIndicator = ({ password }) => {
  const strength = calculatePasswordStrength(password);

  const getStrengthColor = (score) => {
    if (score <= 1) return "text-destructive";
    if (score <= 2) return "text-orange-500";
    if (score <= 3) return "text-yellow-500";
    if (score <= 4) return "text-blue-500";
    return "text-emerald-500";
  };

  const getStrengthText = (score) => {
    if (score <= 1) return "Very Weak";
    if (score <= 2) return "Weak";
    if (score <= 3) return "Fair";
    if (score <= 4) return "Good";
    return "Strong";
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-zinc-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full ${getStrengthColor(strength.score)} bg-current rounded-full transition-all duration-300`}
            style={{ width: `${(strength.score / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs text-zinc-500 min-w-[60px] text-right font-medium">
          {getStrengthText(strength.score)}
        </span>
      </div>
      {strength.feedback.length > 0 && (
        <div className="grid grid-cols-2 gap-1">
          {strength.feedback.map((item, index) => (
            <div key={index} className="flex items-center gap-1 text-xs text-amber-600">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
          error = "Full name is required";
        }
        break;
      case "email":
        if (!value || !String(value).trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (String(value).length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      case "phone":
        if (!value || !String(value).trim()) {
          error = "Contact number is required";
        } else if (!/^\+?[\d\s\-()]{7,15}$/.test(String(value).trim())) {
          error = "Please enter a valid contact number";
        }
        break;
      case "agreeToTerms":
        if (!value) {
          error = "You must agree to the terms and conditions";
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
    [fieldTouched, validateField]
  );

  const handleFieldBlur = useCallback(
    (field) => {
      setFieldTouched((prev) => ({ ...prev, [field]: true }));
      const error = validateField(field, formData[field]);
      setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    },
    [formData, validateField]
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
      setErrors({ general: err?.message || "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (hasError) =>
    cn(
      "w-full h-11 pl-10 pr-4 bg-zinc-50/50 border rounded-xl text-sm text-zinc-900",
      "placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 transition-all",
      hasError ? "border-red-500 ring-1 ring-red-500/20" : "border-zinc-200"
    );

  return (
    <div className="relative min-h-screen bg-[#fbfaf8] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* ── Background Illustration 1: User's Swallow Bird with Measuring Tape Ribbon ── */}
      <img
        src="/assets/bird.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-2 right-2 sm:top-5 sm:right-6 lg:top-6 lg:right-10 w-56 sm:w-72 md:w-96 lg:w-[480px] max-w-[42vw] object-contain mix-blend-multiply opacity-85 sm:opacity-95 z-0"
      />

      {/* ── Background Illustration 2: Bottom-Left Lookbooks, Mannequin & Botanical ── */}
      <img
        src="/assets/atelier-collage.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-4 left-4 sm:bottom-6 sm:left-8 lg:bottom-8 lg:left-12 w-36 sm:w-48 md:w-60 lg:w-72 max-w-[28vw] object-contain mix-blend-multiply opacity-80 sm:opacity-95 z-0"
      />

      {/* ── Central Form Card with High Contrast & Generous Padding ── */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto p-6 sm:p-8 bg-white border border-zinc-200/90 rounded-2xl shadow-[0_12px_40px_-6px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.02)]">
        {/* Header - Option 2 Strong Modern Typography */}
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase mb-1 block">
            Snitch Atelier
          </span>
          <h1 className="text-2xl sm:text-[1.65rem] font-bold tracking-[-0.03em] text-zinc-950 uppercase">
            Create an Account
          </h1>
          <p className="text-zinc-500 text-xs sm:text-[13px] mt-1 font-normal">
            Join Snitch for seamless shopping & selling
          </p>
        </div>

        {/* Error banner */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Modern Tab Switcher */}
        <div className="flex bg-zinc-100/80 rounded-xl p-1 mb-5">
          <Link
            to="/login"
            className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all text-center text-zinc-500 hover:text-zinc-900 cursor-pointer"
          >
            Sign In
          </Link>
          <span className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all text-center bg-white text-zinc-950 shadow-xs cursor-default">
            Sign Up
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
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
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                <AlertTriangle className="h-3 w-3" />
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
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                <AlertTriangle className="h-3 w-3" />
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
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                <AlertTriangle className="h-3 w-3" />
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
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                <AlertTriangle className="h-3 w-3" />
                {errors.password}
              </p>
            )}
            <PasswordStrengthIndicator password={formData.password} />
          </div>

          {/* Register as a seller */}
          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/60 hover:bg-zinc-50 transition-colors cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.isSeller}
              onChange={(e) => handleInputChange("isSeller", e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-zinc-300 accent-zinc-900 cursor-pointer"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5 text-zinc-900" />
                <p className="text-xs font-semibold text-zinc-900 leading-none">
                  Register as a seller
                </p>
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">
                List products and start selling your brand on Snitch
              </p>
            </div>
          </label>

          {/* Terms checkbox */}
          <div>
            <label className="flex items-start gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-zinc-300 accent-zinc-900 cursor-pointer"
              />
              <span className="text-zinc-500">
                I agree to the{" "}
                <a href="#" className="text-zinc-950 font-medium underline underline-offset-2 hover:text-zinc-700">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-zinc-950 font-medium underline underline-offset-2 hover:text-zinc-700">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1 font-medium">
                <AlertTriangle className="h-3 w-3" />
                {errors.agreeToTerms}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 mt-2 bg-zinc-950 text-white font-semibold rounded-xl text-xs sm:text-sm tracking-wider uppercase hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
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

        {/* Bottom toggle */}
        <p className="text-center text-xs text-zinc-500 mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-zinc-950 font-semibold hover:underline cursor-pointer"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
