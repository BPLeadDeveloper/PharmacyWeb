"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface User {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
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
          localStorage.removeItem("token");
        });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: "POST" });
    } catch {}
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  const navLinks = [
    { name: "Buy Medicines", href: "/medicines", highlight: true },
    { name: "Find Doctors", href: "/doctors" },
    { name: "Lab Tests", href: "/lab-tests" },
    { name: "Circle Membership", href: "/membership" },
    { name: "Health Records", href: "/health-records" },
    { name: "Credit Card", href: "/credit-card", badge: "New" },
    { name: "Buy Insurance", href: "/insurance", badge: "New" },
  ];

  const subNavLinks = [
    "Apollo Products",
    "Baby Care",
    "Nutritional Drinks & Supplements",
    "Health Devices",
    "Home Essentials",
    "Health Condition",
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Header */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#02475b] rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <div>
                  <span className="text-[#02475b] font-bold text-xl">Bharath</span>
                  <span className="block text-xs text-gray-500">Pharmacy</span>
                </div>
              </div>
            </Link>

            {/* Delivery Address */}
            <div className="hidden md:flex items-center cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg">
              <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <span className="text-xs text-gray-500">Delivery Address</span>
                <p className="text-sm font-medium text-gray-700 flex items-center">
                  Select Address
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-6 hidden lg:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search medicines, health products & more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#02475b] text-gray-700"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link href="/cart" className="relative p-2 hover:bg-gray-50 rounded-lg">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#f57224] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Login/User */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 px-4 py-2 border border-[#02475b] text-[#02475b] rounded-lg hover:bg-[#02475b] hover:text-white transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="hidden md:inline">{user.first_name || "User"}</span>
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                      <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        My Profile
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        My Orders
                      </Link>
                      <Link href="/prescriptions" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        My Prescriptions
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-2 px-4 py-2 border border-[#02475b] text-[#02475b] rounded-lg hover:bg-[#02475b] hover:text-white transition"
                >
                  <span>Login</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-8 overflow-x-auto py-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`whitespace-nowrap text-sm font-medium ${
                  link.highlight
                    ? "text-[#02475b] border-b-2 border-[#02475b] pb-2"
                    : "text-gray-600 hover:text-[#02475b]"
                } flex items-center`}
              >
                {link.name}
                {link.badge && (
                  <span className="ml-1 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="bg-[#02475b] text-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-8 overflow-x-auto py-2">
            {subNavLinks.map((link) => (
              <Link
                key={link}
                href={`/${link.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                className="whitespace-nowrap text-sm hover:text-[#ffc107] transition"
              >
                {link}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
