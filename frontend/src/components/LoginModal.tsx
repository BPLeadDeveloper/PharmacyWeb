"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    // Reset state when modal opens/closes
    if (!isOpen) {
      setShowOtpInput(false);
      setOtp(["", "", "", "", "", ""]);
      setError(null);
      setEmail("");
    }
  }, [isOpen]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`modal-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`modal-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
      const res = await fetch(`${API_BASE}/auth/verify-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({}));
        throw new Error(message || "Invalid OTP");
      }

      const data = await res.json();
      
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }

      onClose();

      if (data.needsProfileCompletion || data.needsPhoneVerification) {
        router.push("/verify-phone");
      } else {
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    window.location.href = `${API_BASE}/auth/google`;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-[#f57224] p-6 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3">
              <span className="text-[#02475b] font-bold text-xl">B</span>
            </div>
            <div className="text-white">
              <span className="font-bold text-xl block">Bharath</span>
              <span className="text-sm opacity-80">24|7</span>
            </div>
          </div>
          <h1 className="text-white text-lg font-bold">Login for Best Offer</h1>
          <div className="mt-3 flex justify-center">
            <span className="text-4xl">📱</span>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {!showOtpInput ? (
            <>
              <h2 className="text-[#02475b] text-base font-semibold mb-3">
                Please enter your email to login
              </h2>

              <form onSubmit={handleSendOtp} className="space-y-3">
                <div className="flex items-center border-2 border-gray-200 rounded-lg focus-within:border-[#f57224] transition">
                  <span className="pl-3 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-3 outline-none text-gray-800"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="bg-[#f57224] hover:bg-[#e56213] disabled:bg-gray-300 text-white p-2 m-1 rounded-lg transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>

                <p className="text-xs text-gray-500">
                  OTP will be sent to this email address
                </p>

                {error && (
                  <div className="bg-red-50 text-red-600 p-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  By signing up, I agree to the{" "}
                  <Link href="/privacy-policy" className="text-[#02475b] underline">Privacy Policy</Link>,{" "}
                  <Link href="/terms" className="text-[#02475b] underline">Terms and Conditions</Link>.
                </p>
              </form>

              <div className="my-4 flex items-center">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-3 text-gray-500 text-xs">OR</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center space-x-2 border-2 border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 font-medium text-sm">Continue with Google</span>
              </button>

              <div className="mt-4 bg-[#fff8e7] rounded-lg p-3 flex items-center space-x-2">
                <span className="text-2xl">🛵</span>
                <div>
                  <p className="font-semibold text-[#02475b] text-sm">Free delivery | FREEDEL</p>
                  <p className="text-xs text-gray-600">Available in major cities</p>
                </div>
              </div>

              <div className="mt-3 bg-[#02475b] text-white text-center py-2 rounded-lg">
                <p className="font-semibold text-sm">EXCITING OFFERS FOR FIRST TIME USERS</p>
              </div>
            </>
          ) : (
            <>
              <button 
                onClick={() => {
                  setShowOtpInput(false);
                  setOtp(["", "", "", "", "", ""]);
                  setError(null);
                }}
                className="mb-3 text-[#02475b] flex items-center hover:underline text-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <h2 className="text-[#02475b] text-base font-semibold mb-1">
                Verify your email
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span>
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`modal-otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-10 h-10 text-center text-lg font-bold border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#f57224]"
                    />
                  ))}
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-2 rounded-lg text-sm text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.join("").length !== 6}
                  className="w-full bg-[#f57224] hover:bg-[#e56213] disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="text-center text-sm">
                  {countdown > 0 ? (
                    <p className="text-gray-500">
                      Resend OTP in <span className="text-[#f57224] font-semibold">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
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
