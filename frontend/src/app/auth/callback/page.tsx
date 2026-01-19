"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Store the token
      localStorage.setItem("token", token);

      // Fetch user profile
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (res.ok) {
            const user = await res.json();
            // Redirect to home on success
            router.push("/");
          } else {
            throw new Error("Failed to fetch user profile");
          }
        })
        .catch((err) => {
          setError(err.message);
          // Remove invalid token
          localStorage.removeItem("token");
        });
    } else {
      setError("No token provided");
      // Redirect to home after a delay
      setTimeout(() => router.push("/"), 3000);
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
        {error ? (
          <div className="text-red-600 mb-4">{error}</div>
        ) : (
          <div className="text-gray-600 mb-4">Please wait while we log you in.</div>
        )}
        <div className="text-sm text-gray-500">
          You will be redirected shortly.
        </div>
      </div>
    </div>
  );
}