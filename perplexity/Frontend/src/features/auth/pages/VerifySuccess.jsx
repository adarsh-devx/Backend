import React from "react";
import { Link } from "react-router";
import AuthLayout from "../components/AuthLayout";

const VerifySuccess = () => {
  return (
    <AuthLayout
      title="Email Verified!"
      subtitle="Your email address has been successfully verified. Your account is now active and ready to use."
      icon={
        <svg
          className="w-6 h-6 text-[#FFFFE3]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      }
    >
      <div className="text-center">
        {/* Action Button */}
        <Link
          to="/login"
          className="inline-block w-full bg-[#6D8196] hover:bg-[#5a6d80] text-[#FFFFE3] font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(109,129,150,0.2)] hover:shadow-[0_0_25px_rgba(109,129,150,0.45)] transition-all duration-300 transform active:scale-[0.98] cursor-pointer mt-2"
        >
          Go to Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default VerifySuccess;
