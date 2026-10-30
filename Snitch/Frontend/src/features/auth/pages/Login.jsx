import { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/use.auth";
import { cn } from "@/lib/utils";
import { Mail, Lock, Eye, EyeOff, AlertTriangle, Loader2 } from "lucide-react";
import GoogleButton from "../components/GoogleButton";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});

  // Load saved email if rememberMe was previously set
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail, rememberMe }));
    }
  }, []);

  const validateField = useCallback((field, value) => {
    let error = "";
    switch (field) {
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
    const fields = ["email", "password"];
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
      const loggedUser = await handleLogin({
        email: formData.email,
        password: formData.password,
      });

      if (formData.rememberMe) {
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("rememberMe");
      }

      if (loggedUser?.role === "seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setErrors({
        general: err?.message || "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = () =>
    cn(
      "w-full h-11 pl-10 pr-4 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm text-zinc-900",
      "placeholder:text-zinc-400 hover:border-zinc-300 focus:bg-white focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 transition-all",
    );

  return (
    <div className="relative min-h-screen bg-[#fbfaf8] flex items-center justify-center p-3 sm:p-4 py-6 overflow-x-hidden">
      {/* ── Background Illustration 1: User's Swallow Bird with Measuring Tape Ribbon ── */}
      <img
        src="/assets/bird.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-2 right-2 sm:top-5 sm:right-6 lg:top-6 lg:right-10 w-40 sm:w-64 md:w-80 lg:w-[420px] max-w-[40vw] object-contain mix-blend-multiply opacity-60 sm:opacity-95 z-0"
      />

      {/* ── Background Illustration 2: Bottom-Left Lookbooks, Mannequin & Botanical ── */}
      <img
        src="/assets/atelier-collage.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-3 left-3 sm:bottom-6 sm:left-8 lg:bottom-8 lg:left-12 w-28 sm:w-44 md:w-56 lg:w-68 max-w-[28vw] object-contain mix-blend-multiply opacity-55 sm:opacity-95 z-0"
      />

      {/* ── Central Form Card with High Contrast & Generous Padding ── */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto p-6 sm:p-8 bg-white border border-zinc-200/90 rounded-2xl shadow-[0_12px_40px_-6px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.02)]">
        {/* Header - Option 2 Strong Modern Typography */}
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase mb-1 block">
            Snitch Atelier
          </span>
          <h1 className="text-2xl sm:text-[1.65rem] font-bold tracking-[-0.03em] text-zinc-950">
            Welcome Back
          </h1>
          <p className="text-zinc-500 text-xs sm:text-[13px] mt-1 font-normal">
            Access your clothing & store world.
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
          <span className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all text-center bg-white text-zinc-950 shadow-xs cursor-default">
            Sign In
          </span>
          <Link
            to="/register"
            className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all text-center text-zinc-500 hover:text-zinc-900 cursor-pointer"
          >
            Sign Up
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
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
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <div className="checkbox-wrapper-46">
              <input
                type="checkbox"
                id="cbx-remember"
                className="inp-cbx"
                checked={formData.rememberMe}
                onChange={(e) =>
                  handleInputChange("rememberMe", e.target.checked)
                }
              />
              <label htmlFor="cbx-remember" className="cbx">
                <span>
                  <svg viewBox="0 0 12 10" height="9px" width="11px">
                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                  </svg>
                </span>
                <span className="text-zinc-500 font-medium">Remember me</span>
              </label>
            </div>
            <a
              href="#"
              className="text-zinc-950 font-semibold hover:underline cursor-pointer"
            >
              Forgot password?
            </a>
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
                Signing in...
              </span>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Social Login Separator */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200" />
          </div>
          <span className="relative bg-white/80 backdrop-blur-xs px-3 text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
            or continue with
          </span>
        </div>

        {/* Google Button */}
        <GoogleButton />

        {/* Bottom toggle */}
        <p className="text-center text-xs text-zinc-500 mt-5">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-zinc-950 font-semibold hover:underline cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
