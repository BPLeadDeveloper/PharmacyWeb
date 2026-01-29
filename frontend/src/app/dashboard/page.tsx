"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface User {
  user_id: number;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  is_active?: boolean;
  is_email_verified?: boolean;
  is_phone_verified?: boolean;
  created_at: string;
  updated_at?: string;
  last_login_at?: string;
  role?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem("token");
          router.push("/");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 border-4 border-[#02475b] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMemberSince = () => {
    if (!user.created_at) return "N/A";
    const date = new Date(user.created_at);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-linear-to-r from-[#02475b] to-[#03627d] rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.first_name}! 👋
              </h1>
              <p className="text-white/80">
                Manage your health and wellness in one place
              </p>
            </div>
          </div>
        </div>

        {/* User Profile Information */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Header */}
            <div className="bg-linear-to-r from-[#02475b] to-[#03627d] p-8">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#02475b] text-3xl font-bold shadow-lg">
                  {user.first_name[0]}{user.last_name[0]}
                </div>
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-1">
                    {user.first_name} {user.last_name}
                  </h2>
                  <p className="text-white/80 text-lg">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Account Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User ID */}
                <div className="border-l-4 border-[#02475b] pl-4">
                  <p className="text-sm text-gray-500 mb-1">User ID</p>
                  <p className="text-lg font-semibold text-gray-800">#{user.user_id}</p>
                </div>

                {/* Role */}
                <div className="border-l-4 border-[#02475b] pl-4">
                  <p className="text-sm text-gray-500 mb-1">Role</p>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.role === "ADMIN"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="border-l-4 border-[#02475b] pl-4">
                  <p className="text-sm text-gray-500 mb-1">Email Address</p>
                  <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                </div>

                {/* Phone */}
                <div className="border-l-4 border-[#02475b] pl-4">
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {user.phone || "Not provided"}
                  </p>
                </div>

                {/* Date of Birth */}
                <div className="border-l-4 border-[#02475b] pl-4">
                  <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {user.date_of_birth ? formatDate(user.date_of_birth) : "Not provided"}
                  </p>
                </div>

                {/* Member Since */}
                <div className="border-l-4 border-[#02475b] pl-4">
                  <p className="text-sm text-gray-500 mb-1">Member Since</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {getMemberSince()}
                  </p>
                </div>

                {/* Address */}
                <div className="border-l-4 border-[#02475b] pl-4 md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Account Status</p>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.is_email_verified
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      Email: {user.is_email_verified ? "Verified" : "Unverified"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.is_phone_verified
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      Phone: {user.is_phone_verified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </div>

                {/* Last Login */}
                <div className="border-l-4 border-[#02475b] pl-4">
                  <p className="text-sm text-gray-500 mb-1">Last Login</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {user.last_login_at ? formatDate(user.last_login_at) : "Never"}
                  </p>
                </div>

                {/* Updated At */}
                <div className="border-l-4 border-[#02475b] pl-4">
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {user.updated_at ? formatDate(user.updated_at) : "N/A"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 px-6 py-3 bg-[#02475b] text-white rounded-lg hover:bg-[#03627d] transition-colors font-medium"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Edit Profile</span>
                </Link>

                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors font-medium"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
