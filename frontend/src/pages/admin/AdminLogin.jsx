import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, redirect, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await api.post("/admin/login", data);
      console.log(response)
      setAuthUser(response.data.user);
      navigate("/admin/dashboard");
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <Navbar />

      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-purple-50 via-white to-indigo-50">
        {/* Background Blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-indigo-300 rounded-full blur-3xl opacity-30"></div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">
            job-app
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:outline-none"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password with toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-purple-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 text-white rounded-lg font-semibold hover:bg-purple-700 transition hover:cursor-pointer ${loading ? "bg-purple-700" : "bg-purple-600"}`}
              disabled={loading}
            >
              Login
            </button>
          </form>

          {/* Footer */}

          <div className="text-center mt-4">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-purple-600"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
