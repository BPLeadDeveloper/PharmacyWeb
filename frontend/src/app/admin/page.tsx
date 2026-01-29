"use client";

import { useState, useEffect } from "react";
import {
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowRight,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiTag,
} from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalBrands: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("today");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalBrands: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch brands count
        try {
          const brandsRes = await fetch(`${API_BASE}/brands`, { headers });
          if (brandsRes.ok) {
            const brands = await brandsRes.json();
            setStats((prev) => ({
              ...prev,
              totalBrands: Array.isArray(brands) ? brands.length : 0,
            }));
          }
        } catch (e) {
          console.error("Error fetching brands:", e);
        }

        // Additional stats can be fetched here when API is ready
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const mainStats = [
    {
      name: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: "+0%",
      trend: "up",
      icon: FiDollarSign,
      color: "emerald",
    },
    {
      name: "Total Orders",
      value: stats.totalOrders.toString(),
      change: "+0%",
      trend: "up",
      icon: FiShoppingCart,
      color: "blue",
    },
    {
      name: "Total Products",
      value: stats.totalProducts.toString(),
      change: "+0%",
      trend: "up",
      icon: FiBox,
      color: "purple",
    },
    {
      name: "Total Customers",
      value: stats.totalCustomers.toString(),
      change: "+0%",
      trend: "up",
      icon: FiUsers,
      color: "orange",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; iconBg: string }> = {
      emerald: { bg: "bg-emerald-50", text: "text-emerald-600", iconBg: "bg-linear-to-br from-emerald-400 to-emerald-600" },
      blue: { bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-linear-to-br from-blue-400 to-blue-600" },
      purple: { bg: "bg-purple-50", text: "text-purple-600", iconBg: "bg-linear-to-br from-purple-400 to-purple-600" },
      orange: { bg: "bg-orange-50", text: "text-orange-600", iconBg: "bg-linear-to-br from-orange-400 to-orange-600" },
    };
    return colors[color] || colors.emerald;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-2">Welcome back! Here&apos;s your store overview.</p>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center space-x-2">
          {["today", "week", "month", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                timeRange === range
                  ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat) => {
          const colors = getColorClasses(stat.color);
          return (
            <div
              key={stat.name}
              className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 overflow-hidden relative"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className={`p-3 rounded-lg ${colors.iconBg} shadow-lg transition-transform group-hover:scale-110 duration-300`}>
                  <stat.icon className="text-white" size={24} />
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm font-semibold ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <FiTrendingUp size={16} />
                  ) : (
                    <FiTrendingDown size={16} />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="relative z-10 mt-4">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-yellow-50 to-white rounded-xl p-5 border border-yellow-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-lg">
              <FiClock className="text-white" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              <p className="text-sm text-gray-600 font-medium">Pending Orders</p>
            </div>
          </div>
        </div>
        <div className="bg-linear-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-linear-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg">
              <FiPackage className="text-white" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.processingOrders}</p>
              <p className="text-sm text-gray-600 font-medium">Processing</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.deliveredOrders}</p>
              <p className="text-sm text-gray-500">Delivered</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiAlertCircle className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelledOrders}</p>
              <p className="text-sm text-gray-500">Cancelled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-linear-to-br from-white via-gray-50 to-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-linear-to-r from-gray-50 to-transparent">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <a
              href="/admin/orders"
              className="flex items-center space-x-1 bg-linear-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 text-sm font-medium"
            >
              <span>View All</span>
              <FiArrowRight size={16} />
            </a>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-linear-to-br from-emerald-100 to-emerald-50 rounded-full mb-4">
                <FiShoppingCart className="text-emerald-600" size={48} />
              </div>
              <p className="text-gray-600 mt-4 font-medium">No recent orders</p>
              <p className="text-gray-500 text-sm">Orders will appear here once customers place them</p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-linear-to-br from-white via-gray-50 to-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-linear-to-r from-gray-50 to-transparent">
            <h2 className="text-lg font-bold text-gray-900">Top Products</h2>
            <a
              href="/admin/products"
              className="flex items-center space-x-1 bg-linear-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 text-sm font-medium"
            >
              <span>View All</span>
              <FiArrowRight size={16} />
            </a>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-linear-to-br from-blue-100 to-blue-50 rounded-full mb-4">
                <FiBox className="text-blue-600" size={48} />
              </div>
              <p className="text-gray-600 mt-4 font-medium">No products yet</p>
              <p className="text-gray-500 text-sm">Add products to see top sellers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-linear-to-br from-white via-gray-50 to-white rounded-xl border border-gray-200 p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/products"
            className="group flex flex-col items-center justify-center p-5 bg-linear-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
          >
            <div className="p-3 bg-linear-to-br from-emerald-100 to-emerald-50 rounded-lg group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300 mb-2">
              <FiBox className="text-emerald-600 group-hover:scale-110 transition-transform duration-300" size={24} />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors">Add Product</span>
          </a>
          <a
            href="/admin/brands"
            className="group flex flex-col items-center justify-center p-5 bg-linear-to-br from-blue-50 to-white rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
          >
            <div className="p-3 bg-linear-to-br from-blue-100 to-blue-50 rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300 mb-2">
              <FiTag className="text-blue-600 group-hover:scale-110 transition-transform duration-300" size={24} />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">Add Brand</span>
          </a>
          <a
            href="/admin/orders"
            className="group flex flex-col items-center justify-center p-5 bg-linear-to-br from-purple-50 to-white rounded-xl border border-purple-100 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          >
            <div className="p-3 bg-linear-to-br from-purple-100 to-purple-50 rounded-lg group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300 mb-2">
              <FiShoppingCart className="text-purple-600 group-hover:scale-110 transition-transform duration-300" size={24} />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">View Orders</span>
          </a>
          <a
            href="/admin/customers"
            className="group flex flex-col items-center justify-center p-5 bg-linear-to-br from-orange-50 to-white rounded-xl border border-orange-100 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
          >
            <div className="p-3 bg-linear-to-br from-orange-100 to-orange-50 rounded-lg group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-all duration-300 mb-2">
              <FiUsers className="text-orange-600 group-hover:scale-110 transition-transform duration-300" size={24} />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-700 transition-colors">View Customers</span>
          </a>
        </div>
      </div>
    </div>
  );
}
