import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
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

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();
  const { handleRegister } = useAuth();

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
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
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
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await handleRegister(formData);
      if (res && res.success) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-black flex items-center justify-center p-4 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px]">
      <Card className="w-full max-w-sm border-2 border-black shadow-[6px_6px_0px_0px_#000000] bg-[#dbeafe] text-black rounded-2xl p-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-black tracking-tight text-black">
            Create an account
          </CardTitle>
          <CardDescription className="text-zinc-800 text-sm font-medium">
            Enter your details below to create your new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-sm font-bold text-black">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="border-2 border-black bg-white text-black placeholder-zinc-400 focus:ring-0 focus:outline-none rounded-xl h-11 px-3.5 shadow-[2px_2px_0px_0px_#000]"
                  required
                />
                {errors.username && (
                  <p className="text-xs text-rose-600 font-bold">{errors.username}</p>
                )}
              </div>

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
                <Label htmlFor="password" className="text-sm font-bold text-black">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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
                {isSubmitting ? "Creating account..." : "Sign Up"}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2 pt-2">
          <div className="mt-1 text-center text-xs font-semibold text-zinc-900">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-black underline underline-offset-4 font-black hover:text-blue-700"
            >
              Sign in instead
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
