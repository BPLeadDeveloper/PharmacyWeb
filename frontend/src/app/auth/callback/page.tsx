"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Authenticating...");

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");
    const needsProfileCompletion = searchParams.get("needsProfileCompletion");
    const needsPhoneVerification = searchParams.get("needsPhoneVerification");

    // Handle OAuth errors (e.g., access_denied)
    if (error) {
      setError(`Authentication failed: ${error}`);
      setTimeout(() => router.push("/"), 2000);
      return;
    }

    if (token) {
      // Store the token
      localStorage.setItem("token", token);
      setStatus("Verifying your account...");

      // Fetch user profile
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (res.ok) {
            const user = await res.json();
            
            // Check if profile completion is needed
            if (needsProfileCompletion === "true" || !user.first_name) {
              setStatus("Redirecting to complete your profile...");
              setTimeout(() => router.push("/complete-profile"), 1000);
            }
            // All set, redirect to home
            else {
              setStatus("Login successful! Redirecting...");
              setTimeout(() => router.push("/"), 1000);
            }
          } else {
            throw new Error("Failed to fetch user profile");
          }
        })
        .catch((err) => {
          setError(err.message);
          // Remove invalid token
          localStorage.removeItem("token");
          setTimeout(() => router.push("/"), 3000);
        });
    } else {
      setError("No authentication token received");
      // Redirect to home after a delay
      setTimeout(() => router.push("/"), 3000);
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#e8f4f8] to-[#d4e8ed]">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-14 h-14 bg-[#02475b] rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <div>
            <span className="text-[#02475b] font-bold text-2xl block">Bharath</span>
            <span className="text-sm text-gray-500">24|7</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">{status}</h1>
        
        {error ? (
          <div className="space-y-4">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              <p className="font-semibold mb-1">Authentication Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <p className="text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Loading Spinner */}
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-[#02475b] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">Please wait while we set up your account.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#e8f4f8] to-[#d4e8ed]">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-[#02475b] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}