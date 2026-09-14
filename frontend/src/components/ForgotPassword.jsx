import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../services/api";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");
  const [savedOtp, setSavedOtp] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [step, setStep] = useState(1);
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      if (step === 1) {
        setLoading(true);
        const email = data.email;
        const res = await api.post("/forgot-password/send-otp", { email });
        setSavedEmail(email);
        setLoading(false);
        toast.success(res.data.message);
        setStep(2);
      } else if (step === 2) {
        setSavedOtp(data.otp);
        const res = await api.post("/forgot-password/verify-email", {
          email: savedEmail,
          otp: data.otp,
        });

        if (res.data.success) {
          setStep(3);
        }
      } else if (step === 3) {
        const res = await api.post("/forgot-password/reset-password", {
          email: savedEmail,
          password: data.password,
          otp: savedOtp,
        });
        toast.success(res.data.message);
        reset();
        setStep(1);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-500 text-center mt-2">
          Reset your password in a few simple steps
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Email */}
          {step === 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-200 focus:ring-purple-500"
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Enter valid email format",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          )}

          {/* OTP */}
          {step === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                placeholder="6-digit OTP"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.otp
                    ? "border-red-500"
                    : "border-gray-200 focus:ring-purple-500"
                }`}
                {...register("otp", {
                  required: "OTP is required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Enter valid 6-digit OTP",
                  },
                })}
              />
              {errors.otp && (
                <p className="text-sm text-red-500">{errors.otp.message}</p>
              )}
            </div>
          )}

          {/* New Password */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="text"
                  placeholder="New Password"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-200 focus:ring-purple-500"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-200 focus:ring-purple-500"
                  }`}
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            {loading
              ? "Please wait..."
              : step === 1
                ? "Send OTP"
                : step === 2
                  ? "Verify OTP"
                  : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm text-indigo-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
