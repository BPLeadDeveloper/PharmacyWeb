"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function VerifyPhone() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`phone-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`phone-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate phone number (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid 10-digit Indian mobile number");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/auth/send-phone-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: `+91${phone}` }),
      });

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({}));
        throw new Error(message || "Failed to send OTP");
      }

      setShowOtpInput(true);
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/auth/verify-phone-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: `+91${phone}`, otp: otpCode }),
      });

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({}));
        throw new Error(message || "Invalid OTP");
      }

      // Redirect to profile completion page
      router.push("/complete-profile");
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (countdown > 0) return;
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/auth/send-phone-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: `+91${phone}` }),
      });

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({}));
        throw new Error(message || "Failed to resend OTP");
      }

      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#e8f4f8] to-[#d4e8ed] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#02475b] p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center mr-3">
              <span className="text-[#02475b] font-bold text-2xl">B</span>
            </div>
            <div className="text-white">
              <span className="font-bold text-2xl block">Bharath</span>
              <span className="text-sm opacity-80">24|7</span>
            </div>
          </div>
          <h1 className="text-white text-xl font-bold">Verify Your Mobile Number</h1>
          <p className="text-gray-300 text-sm mt-1">For secure transactions and updates</p>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
                ✓
              </div>
              <span className="ml-2 text-sm text-gray-600">Email</span>
            </div>
            <div className="w-12 h-1 bg-[#f57224] rounded"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full ${showOtpInput ? 'bg-[#f57224]' : 'bg-gray-200'} text-white flex items-center justify-center text-sm font-semibold`}>
                2
              </div>
              <span className="ml-2 text-sm text-gray-600">Phone</span>
            </div>
            <div className="w-12 h-1 bg-gray-200 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="ml-2 text-sm text-gray-600">Profile</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6">
          {!showOtpInput ? (
            <>
              <h2 className="text-[#02475b] text-lg font-semibold mb-4">
                Enter your mobile number
              </h2>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="relative">
                  <div className="flex items-center border-2 border-gray-200 rounded-lg focus-within:border-[#f57224] transition">
                    <span className="pl-4 text-gray-700 font-semibold border-r pr-3 py-4">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="flex-1 px-3 py-4 outline-none text-gray-800"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading || phone.length !== 10}
                      className="bg-[#f57224] hover:bg-[#e56213] disabled:bg-gray-300 text-white p-3 m-1 rounded-lg transition"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  OTP will be sent via SMS and WhatsApp to this number
                </p>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="bg-blue-50 rounded-lg p-4 flex items-start space-x-3">
                  <span className="text-blue-500 text-xl">ℹ️</span>
                  <div>
                    <p className="text-sm text-gray-700">
                      We need your mobile number to:
                    </p>
                    <ul className="text-xs text-gray-600 mt-1 space-y-1">
                      <li>• Send order updates and delivery notifications</li>
                      <li>• Contact you regarding prescriptions</li>
                      <li>• Provide 24/7 customer support</li>
                    </ul>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* OTP Verification */}
              <button 
                onClick={() => {
                  setShowOtpInput(false);
                  setOtp(["", "", "", "", "", ""]);
                  setError(null);
                }}
                className="mb-4 text-[#02475b] flex items-center hover:underline"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Change Number
              </button>

              <h2 className="text-[#02475b] text-lg font-semibold mb-2">
                Verify your mobile number
              </h2>
              <p className="text-gray-600 mb-6">
                We've sent a 6-digit OTP to <span className="font-semibold">+91 {phone}</span>
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* OTP Input Boxes */}
                <div className="flex justify-center space-x-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`phone-otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="otp-input"
                    />
                  ))}
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.join("").length !== 6}
                  className="w-full bg-[#f57224] hover:bg-[#e56213] disabled:bg-gray-300 text-white py-4 rounded-lg font-semibold transition"
                >
                  {loading ? "Verifying..." : "Verify & Continue"}
                </button>

                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-gray-500">
                      Resend OTP in <span className="text-[#f57224] font-semibold">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-[#02475b] font-semibold hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
