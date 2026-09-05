import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
import { setError } from "../auth.slice";
import Loader from "../../../components/Loader";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const authError = useSelector((state) => state.auth.error);
  const navigate = useNavigate();
  const { handleLogin, dispatch } = useAuth();

  // Clear any previous Redux auth errors when Login page mounts
  useEffect(() => {
    dispatch(setError(null));
  }, [dispatch]);

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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (authError) {
      dispatch(setError(null));
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
    try {
      const res = await handleLogin({ email, password });
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
    <div className="min-h-screen w-full bg-[#f8fafc] text-black flex items-center justify-center p-4 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px]">
      <Card className="w-full max-w-sm border-2 border-black shadow-[6px_6px_0px_0px_#000000] bg-[#dbeafe] text-black rounded-2xl p-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-black tracking-tight text-black">
            Login to your account
          </CardTitle>
          <CardDescription className="text-zinc-800 text-sm font-medium">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authError && (
            <div className="mb-4 p-3 bg-red-100 border-2 border-black rounded-xl text-rose-700 text-xs font-bold shadow-[2px_2px_0px_0px_#000]">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-bold text-black">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="m@example.com"
                  className="border-2 border-black bg-white text-black placeholder-zinc-400 focus:ring-0 focus:outline-none rounded-xl h-11 px-3.5 shadow-[2px_2px_0px_0px_#000]"
                  required
                />
                {errors.email && (
                  <p className="text-xs text-rose-600 font-bold">{errors.email}</p>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-sm font-bold text-black">
                    Password
                  </Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-xs font-bold text-black underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-2 border-black bg-white text-black focus:ring-0 focus:outline-none rounded-xl h-11 px-3.5 shadow-[2px_2px_0px_0px_#000]"
                  required
                />
                {errors.password && (
                  <p className="text-xs text-rose-600 font-bold">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 h-11 bg-[#3b82f6] hover:bg-[#2563eb] text-black font-extrabold border-2 border-black shadow-[3px_3px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all rounded-xl cursor-pointer"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2 pt-2">
          <div className="mt-1 text-center text-xs font-semibold text-zinc-900">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-black underline underline-offset-4 font-black hover:text-blue-700"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
