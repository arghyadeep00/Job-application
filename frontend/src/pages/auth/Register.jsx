import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useForm } from "react-hook-form";
import { fuseState, useState } from "react";
import OtpBox from "../../components/OtpBox";
import toast from "react-hot-toast";
import api from "../../services/api";
import domain from "../../utils/domain";
import countryCodes from "../../utils/countryCode";

const Register = () => {
  const otpDetails = [
    {
      id: "email",
      title: "Verify Your Email",
      message: "Enter the verification code sent to your email address.",
    },
    {
      id: "phoneNumber",
      title: "Verify Your Phone Number",
      message: "Enter the verification code sent to your mobile number",
    },
  ];
  const [loading, setLoading] = useState(false);
  const [otpTarget, setOtpTarget] = useState("");
  const [otpType, setOtpType] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [otpPopup, setOtpPopup] = useState(false);
  const [otpMessage, setOtpMessage] = useState({});
  const [otpLoadin, setOtpLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  let email = watch("email");
  let password = watch("password");
  let countryCode = watch("countryCode");
  let phoneNumber = watch("phoneNumber");

  // const onSubmit = (data) => console.log(data);
  const onSubmit = async (data) => {
    try {
      if (emailVerified === false) {
        return toast.error("Please verify email first");
      }

      //******** PHONE VERIFICAITON IS DISABLE FOR TWILIO PAID API **********//

      // if (phoneVerified === false) {
      //   return toast.error("Please verify Phone Number first");
      // }
      setLoading(true);
      const formData = new FormData();
      formData.append("firstname", data.firstname);
      formData.append("middlename", data.middlename);
      formData.append("lastname", data.lastname);
      formData.append("email", data.email);
      formData.append("countryCode", data.countryCode);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("password", data.confirmPassword);
      formData.append("domain", data.domain);
      formData.append("isEmailVerified", emailVerified);
      formData.append("isPhoneVerified", phoneVerified);
      formData.append("resume", data.resume[0]);

      const response = await api.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      reset();
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Form submiting error");
    } finally {
      setLoading(false);
    }
  };

  const openOtpBox = async (type) => {
    const message = otpDetails.find((f) => f.id === type);
    const value = type == "email" ? email : phoneNumber;
    if (type === "phoneNumber") {
      if (!countryCode) {
        toast.error("Enter country code first");
      }
    }

    if (!value) return toast.error(`Enter ${type} first `);
    toast.success("OTP send successfylly");
    setOtpLoading(true);
    setOtpMessage([message]);
    setOtpTarget(value);
    setOtpType(type);
    setOtpPopup(true);
    await api.post("/send-otp", { type, value, countryCode });
    setOtpLoading(false);
  };

  return (
    <div>
      {/* Verify Popup */}
      <OtpBox
        visible={otpPopup}
        description={otpMessage}
        otpTarget={otpTarget}
        onClose={() => setOtpPopup(false)}
        onVerified={() =>
          otpType === "email" ? setEmailVerified(true) : setPhoneVerified(true)
        }
      />
      <Navbar />

      <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-purple-50 via-white to-indigo-50">
        {/* Background Blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-indigo-300 rounded-full blur-3xl opacity-30"></div>

        {/* Full Page Form Container */}
        <div className="relative z-10 max-w-4xl mx-auto py-5 px-6">
          <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-10">
            {/* Title */}
            <h2 className="text-3xl font-bold text-center text-purple-600 mb-2">
              Join job-app
            </h2>
            <p className="text-center text-gray-600 mb-10">
              Apply for Internship
            </p>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Name Fields */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  {/* first name */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="First name"
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 
                    ${
                      errors.firstname
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                    {...register("firstname", {
                      required: "First name is required",
                      minLength: {
                        value: 3,
                        message: "First name must be at least 3 characters",
                      },
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: "Only alphabets are allowed",
                      },
                    })}
                  />
                  {errors.firstname && (
                    <p className="text-sm text-red-500">
                      {errors.firstname.message}
                    </p>
                  )}
                </div>
                {/* middle name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    placeholder="middlename"
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                {/* Last name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Last name"
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 
                    ${
                      errors.lastname
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                    {...register("lastname", {
                      required: "Last name is required",
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: "Only alphabets are allowed",
                      },
                      minLength: {
                        value: 3,
                        message: "Last name must be at least 3 characters",
                      },
                    })}
                  />
                  {errors.lastname && (
                    <p className="text-sm text-red-500">
                      {errors.lastname.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className={`w-[85%] px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Enter valid email format",
                      },
                    })}
                  />
                  <button
                    className={`border border-gray-200 w-[15%] cursor-pointer rounded ${
                      emailVerified ? "text-green-500" : "primary-color"
                    }`}
                    disabled={otpLoadin || emailVerified}
                    onClick={() => openOtpBox("email")}
                  >
                    {emailVerified ? "Verified" : "Verify"}
                  </button>
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Phone number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>

                <div className="flex gap-2">
                  {/* Country Code */}
                  <select
                    className={`w-[10%] py-2 rounded-lg border focus:outline-none focus:ring-1 ${
                      errors.countryCode
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                    {...register("countryCode", {
                      required: "Country code is required",
                    })}
                  >
                    <option value="">Code</option>
                    {countryCodes.map((c) => (
                      <option key={c.iso} value={c.dialCode}>
                        {c.dialCode}
                      </option>
                    ))}
                  </select>

                  {/* Phone */}
                  <input
                    type="text"
                    placeholder="0000000000"
                    className={`w-[75%] px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 ${
                      errors.phoneNumber
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{6,14}$/,
                        message: "Enter valid phone number",
                      },
                    })}
                  />

                  {/* Verify */}
                  <button
                    type="button"
                    className={`border border-gray-200 w-[15%] cursor-pointer rounded ${
                      phoneVerified ? "text-green-500" : "primary-color"
                    }`}
                    onClick={() => openOtpBox("phoneNumber")}
                  >
                    {phoneVerified ? "Verified" : "Verify"}
                  </button>
                </div>
                <div className="flex gap-5">
                  {errors.countryCode && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.countryCode.message}
                    </p>
                  )}

                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Passwords */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="••••••••"
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                {/* confirm passowrd */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                    {...register("confirmPassword", {
                      required: "confirm password is required",
                      validate: (value) =>
                        value === password || "Password do not match",
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Domain Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Choose Your Domain <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 ${
                    errors.domain
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  }`}
                  {...register("domain", {
                    required: "Please select your domin",
                  })}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a domain
                  </option>

                  {domain.map((item, key) => (
                    <option value={item.value} key={key}>
                      {item.title}
                    </option>
                  ))}
                </select>
                {errors.domain && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.domain.message}
                  </p>
                )}
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Resume (PDF) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  className={`w-full px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-1 ${
                    errors.resume
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:ring-purple-500"
                  }`}
                  {...register("resume", {
                    required: "Resume PDF is required",
                    validate: {
                      fileType: (files) =>
                        files?.[0]?.type === "application/pdf" ||
                        "Only PDF files are allowed",
                      fileSize: (files) =>
                        files?.[0]?.size <= 2 * 1024 * 1024 ||
                        "File size must be less than 2MB",
                    },
                  })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only PDF files are allowed
                </p>
              </div>

              {/* Terms */}
              <div>
                <div className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="accent-purple-600 mt-1"
                    {...register("terms", {
                      required: "You must agree to the Terms & Conditions",
                    })}
                  />
                  <p className="text-gray-600">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-purple-600 hover:underline"
                    >
                      Terms & Conditions
                    </Link>
                  </p>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.terms.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`w-full py-3  text-white rounded-lg font-semibold hover:bg-purple-700 transition cursor-pointer ${loading ? "bg-purple-700" : "bg-purple-700"}`}
                disabled={loading}
              >
                {loading ? "Creating Account...." : "Create Account"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-600 mt-8">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 font-medium hover:underline"
              >
                Login
              </Link>
            </p>

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
    </div>
  );
};

export default Register;
