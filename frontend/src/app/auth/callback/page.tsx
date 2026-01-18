"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function AuthCallback() {
  const [status, setStatus] = useState("Processing...");
  const [user, setUser] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || params.get("access_token");
    if (!token) {
      setError("No token in callback URL");
      setStatus("Failed");
      return;
    }

    localStorage.setItem("token", token);

    // Fetch profile from backend
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || "Failed to fetch profile");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setStatus("Success");
        // Redirect to login page to show user details
        setTimeout(() => router.push("/login"), 2000); // Delay to show success message
      })
      .catch((err) => {
        setError(err.message || String(err));
        setStatus("Failed");
      });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-xl rounded-lg bg-white p-8 shadow">
        <h1 className="mb-4 text-2xl font-semibold">Auth callback</h1>
        <p className="mb-4">Status: {status}</p>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {user && (
          <div>
            <h2 className="text-lg font-medium">Logged in user</h2>
            <pre className="rounded bg-gray-100 p-3">{JSON.stringify(user, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  );
}
