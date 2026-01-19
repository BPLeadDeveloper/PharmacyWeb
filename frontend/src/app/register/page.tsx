"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Register() {
  const router = useRouter();
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
  });
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
            // Redirect to home if already logged in
            router.push("/");
          }
        })
        .catch(() => {
          // Token invalid, remove it
          localStorage.removeItem("token");
        });
    }
  }, []);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({}));
        throw new Error(message || "Registration failed");
      }

      const data = await res.json();
      // Display returned user
      setUser(data.user || null);
      // Redirect to home after success
      router.push("/");
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register with Us</h2>

        {user ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-600">Registration Successful!</h3>
            <div className="bg-gray-100 p-4 rounded">
              <h4 className="font-medium mb-2">User Details:</h4>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
            <Link
              href="/"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition block text-center"
            >
              Go to Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">First Name</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  value={registerForm.first_name}
                  onChange={(e) => setRegisterForm({ ...registerForm, first_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Last Name</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  value={registerForm.last_name}
                  onChange={(e) => setRegisterForm({ ...registerForm, last_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Email</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Phone</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Date of Birth</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  type="date"
                  value={registerForm.date_of_birth}
                  onChange={(e) => setRegisterForm({ ...registerForm, date_of_birth: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Password</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  required
                />
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}

              <button
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>

              <button
                type="button"
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                onClick={() => {
                  window.location.href = `${API_BASE}/auth/google`;
                }}
              >
                Sign up with Google
              </button>
            </form>
        )}
        <div className="mt-4 text-center">
          <Link href="/login" className="text-blue-600 hover:underline">Already have an account? Login</Link>
        </div>
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}