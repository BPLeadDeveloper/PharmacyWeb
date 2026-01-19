"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      // Fetch user profile if token exists
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          }
        })
        .catch(() => {
          // Token invalid, remove it
          localStorage.removeItem("token");
        });
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({}));
        throw new Error(message || "Login failed");
      }

      const data = await res.json();
      // Save token and display returned user
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }
      setUser(data.user || null);
      // Redirect to home
      router.push("/");
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to Bharath Pharmacy</h1>

        {user ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-green-600">Login Successful!</h2>
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-medium mb-2">User Details:</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
            <button
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
              onClick={async () => {
                try {
                  await fetch(`${API_BASE}/auth/logout`, { method: "POST" });
                } catch {}
                localStorage.removeItem("token");
                setUser(null);
                router.push("/");
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">Email</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Password</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
              onClick={() => {
                window.location.href = `${API_BASE}/auth/google`;
              }}
            >
              Sign in with Google
            </button>

            <div className="mt-4 text-center">
          <Link href="/register" className="text-blue-600 hover:underline">Don't have an account? Register</Link>
        </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}