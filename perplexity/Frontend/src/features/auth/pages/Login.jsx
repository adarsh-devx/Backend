import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import AuthLayout from "../components/AuthLayout";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const payload = {
      email,
      password,
    };

    try {
      const res = await handleLogin(payload);
      if (res && res.success) {
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Enter your credentials to access your account"
      icon={
        <svg
          className="w-6 h-6 text-[#FFFFE3]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      }
    >
      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email field */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#CBCBCB] block">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full bg-zinc-950/60 border ${
                errors.email
                  ? "border-red-500/80 focus:ring-red-500/30"
                  : "border-zinc-800/80 focus:ring-[#6D8196]/30 focus:border-[#6D8196]"
              } rounded-xl py-3 px-4 text-[#FFFFE3] placeholder-zinc-600 focus:outline-none focus:ring-4 transition-all duration-200`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 animate-pulse">
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#CBCBCB] block">
              Password
            </label>
            <a
              href="#"
              className="text-xs text-[#6D8196] hover:text-[#8397ac] transition-colors font-medium"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full bg-zinc-950/60 border ${
                errors.password
                  ? "border-red-500/80 focus:ring-red-500/30"
                  : "border-zinc-800/80 focus:ring-[#6D8196]/30 focus:border-[#6D8196]"
              } rounded-xl py-3 px-4 text-[#FFFFE3] placeholder-zinc-600 focus:outline-none focus:ring-4 transition-all duration-200`}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 animate-pulse">
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember me and keep logged in */}
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-[#6D8196] focus:ring-[#6D8196]/30 accent-[#6D8196]"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-xs text-[#CBCBCB] cursor-pointer select-none"
          >
            Keep me logged in
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full relative group overflow-hidden bg-[#6D8196] hover:bg-[#5a6d80] text-[#FFFFE3] font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(109,129,150,0.2)] hover:shadow-[0_0_25px_rgba(109,129,150,0.45)] transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-[#FFFFE3]"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Verifying...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="mt-8 text-center text-xs text-[#CBCBCB]/60">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-[#6D8196] hover:text-[#8397ac] font-semibold transition-colors"
        >
          Sign up now
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
