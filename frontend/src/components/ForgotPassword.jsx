import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../services/api";
import toast from "react-hot-toast";
import { Mail, KeyRound, Lock, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

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
        toast.success(res.data.message || "OTP sent to your email!");
        setStep(2);
      } else if (step === 2) {
        setSavedOtp(data.otp);
        const res = await api.post("/forgot-password/verify-email", {
          email: savedEmail,
          otp: data.otp,
        });

        if (res.data.success) {
          toast.success("OTP verified!");
          setStep(3);
        }
      } else if (step === 3) {
        const res = await api.post("/forgot-password/reset-password", {
          email: savedEmail,
          password: data.password,
          otp: savedOtp,
        });
        toast.success(res.data.message || "Password successfully reset!");
        reset();
        setStep(1);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl border border-slate-100 p-8 sm:p-10">
        {/* Step Progress Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s
                    ? "bg-purple-600 text-white ring-4 ring-purple-100"
                    : step > s
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {step > s ? <CheckCircle2 size={16} /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-10 h-0.5 transition-all ${
                    step > s ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            {step === 1 && "Recover Password"}
            {step === 2 && "Enter Verification Code"}
            {step === 3 && "Set New Password"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {step === 1 && "Enter your registered email address to receive an OTP"}
            {step === 2 && `Enter the 6-digit code sent to ${savedEmail}`}
            {step === 3 && "Create a secure new password for your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Step 1: Email */}
          {step === 1 && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                    errors.email
                      ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                      : "border-slate-200 focus:ring-purple-500/20 focus:border-purple-600"
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter valid email format",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                6-Digit OTP Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound size={18} />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-center tracking-widest font-mono font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                    errors.otp
                      ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                      : "border-slate-200 focus:ring-purple-500/20 focus:border-purple-600"
                  }`}
                  {...register("otp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^\d{6}$/,
                      message: "Enter valid 6-digit OTP",
                    },
                  })}
                />
              </div>
              {errors.otp && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.otp.message}</p>
              )}
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                      errors.password
                        ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                        : "border-slate-200 focus:ring-purple-500/20 focus:border-purple-600"
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters",
                      },
                    })}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                      errors.confirmPassword
                        ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                        : "border-slate-200 focus:ring-purple-500/20 focus:border-purple-600"
                    }`}
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{errors.confirmPassword.message}</p>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-purple-500/20 hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : step === 1 ? (
              "Send Verification Code"
            ) : step === 2 ? (
              "Verify Code"
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-slate-100">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition"
          >
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
