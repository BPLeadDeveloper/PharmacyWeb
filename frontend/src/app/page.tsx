"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Home() {
  const [user, setUser] = useState<any | null>(null);

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

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Bharath Pharmacy</h1>
          <p className="text-xl mb-8">Your trusted partner for health and wellness. Quality medicines and expert care.</p>
          <div className="flex justify-center gap-4">
            {!user && (
              <Link href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
                Register
              </Link>
            )}
            <Link href="/login" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">About Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bharath Pharmacy has been serving the community for over 20 years, providing high-quality pharmaceuticals,
            health products, and personalized care. Our mission is to improve health outcomes through reliable service
            and expert advice.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2026 Bharath Pharmacy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
