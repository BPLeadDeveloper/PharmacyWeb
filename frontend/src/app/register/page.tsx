"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const email = searchParams.get("email");
    const password = searchParams.get("password");

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    // Automatically register with provided credentials
    handleAutoRegister(email, password);
  }, [searchParams]);

  async function handleAutoRegister(email: string, password: string) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone: "", // Will be filled in complete-profile
          password,
          first_name: "",
          last_name: "",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Store token if provided
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
        }
        // Redirect to complete profile
        router.push("/complete-profile");
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#e8f4f8] to-[#d4e8ed] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          <div className="bg-[#f57224] p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center mr-3">
                <span className="text-[#02475b] font-bold text-2xl">B</span>
              </div>
              <div className="text-white">
                <span className="font-bold text-2xl block">Bharath</span>
                <span className="text-sm opacity-80">24|7</span>
              </div>
            </div>
            <h1 className="text-white text-xl font-bold mt-2">Register</h1>
          </div>
          <div className="p-6 text-center">
            <div className="w-16 h-16 border-4 border-[#f57224] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Creating your account...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#e8f4f8] to-[#d4e8ed] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          <div className="bg-[#f57224] p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center mr-3">
                <span className="text-[#02475b] font-bold text-2xl">B</span>
              </div>
              <div className="text-white">
                <span className="font-bold text-2xl block">Bharath</span>
                <span className="text-sm opacity-80">24|7</span>
              </div>
            </div>
            <h1 className="text-white text-xl font-bold mt-2">Register</h1>
          </div>
          <div className="p-6 text-center">
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#f57224] hover:bg-[#e56213] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f57224]"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function Register() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-[#e8f4f8] to-[#d4e8ed] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 border-4 border-[#f57224] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}