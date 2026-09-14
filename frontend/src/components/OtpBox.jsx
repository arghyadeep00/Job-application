import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const OtpBox = ({ visible, description, otpTarget, onClose, onVerified, duration = 120 }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(duration);

  useEffect(() => {
    if (!visible) {
      return;
    }
    
    setOtp("");
    setLoading(false);
    setSecondsLeft(duration);

    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [visible, duration]);

  if (!visible) return null;

  const expired = secondsLeft === 0;

  const formatTime = (s) => {
    const mm = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) return;
    if (expired) {
      toast.error("OTP expired. Please request a new OTP.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/verify-otp", { value: otpTarget, otp });
      setLoading(false);

      if (res.data.success) {
        onVerified();
        onClose();
      } else {
        toast.error("Invalid or expired OTP");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Verification failed. Try again.");
    }
  };

  const resendOtp = async () => {
    setLoading(true);

    try {
      const res = await api.post("/resend-otp", { value: otpTarget });
      setLoading(false);

      if (res.data?.success) {
        toast.success("OTP resent successfully.");
        setOtp("");
        setSecondsLeft(duration);
      } else {
        toast.error(res.data?.message || "Failed to resend OTP. Try again.");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Resend failed. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-[90%] max-w-md rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-semibold text-purple-600 mb-2">
          {description[0]?.title}
        </h3>

        <p className="text-sm text-gray-600 mb-2">{description[0]?.message}</p>

        <p className="text-sm text-gray-500 mb-3">
          Time left: <span className="font-medium">{formatTime(secondsLeft)}</span>
        </p>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          className="w-full px-4 py-2 rounded-lg border mb-2"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          {!expired ? (
            <button
              onClick={verifyOtp}
              disabled={loading || otp.length !== 6}
              className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          ) : (
            <button
              onClick={resendOtp}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpBox;
