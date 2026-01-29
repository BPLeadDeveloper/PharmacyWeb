"use client";

import { useState } from "react";
import {
  FiDollarSign,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiCreditCard,
  FiTrendingUp,
} from "react-icons/fi";

const statusColors: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  completed: { bg: "bg-green-100", text: "text-green-700", icon: FiCheckCircle },
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: FiClock },
  failed: { bg: "bg-red-100", text: "text-red-700", icon: FiXCircle },
  refunded: { bg: "bg-blue-100", text: "text-blue-700", icon: FiArrowDownLeft },
};

export default function TransactionsPage() {
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Transactions</h1>
          <p className="text-gray-600 mt-1">View and track all payment transactions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-emerald-50 to-white rounded-xl p-5 border border-emerald-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-linear-to-br from-emerald-100 to-emerald-50 rounded-lg shadow-md">
              <FiDollarSign className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">₹0</p>
              <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="bg-linear-to-br from-green-50 to-white rounded-xl p-5 border border-green-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-linear-to-br from-green-100 to-green-50 rounded-lg shadow-md">
              <FiCheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600 font-medium">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-linear-to-br from-yellow-50 to-white rounded-xl p-5 border border-yellow-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-linear-to-br from-yellow-100 to-yellow-50 rounded-lg shadow-md">
              <FiClock className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600 font-medium">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-linear-to-br from-red-50 to-white rounded-xl p-5 border border-red-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-linear-to-br from-red-100 to-red-50 rounded-lg shadow-md">
              <FiXCircle className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600 font-medium">Failed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Overview Card */}
      <div className="bg-linear-to-br from-white via-gray-50 to-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white hover:border-gray-300 transition-all duration-200">
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div className="flex items-center justify-center py-16 text-gray-400">
          <div className="text-center">
            <FiTrendingUp className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-500">No revenue data yet</p>
            <p className="text-sm">Revenue charts will appear here once you have transactions</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by transaction ID, order ID, or customer..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-3 border rounded-lg transition-colors ${
              showFilters
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FiFilter className="w-5 h-5 mr-2" />
            Filters
            <FiChevronDown
              className={`w-4 h-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              >
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              >
                <option value="">All Types</option>
                <option value="payment">Payment</option>
                <option value="refund">Refund</option>
                <option value="payout">Payout</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              >
                <option value="">All Methods</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
                <option value="wallet">Wallet</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Transaction ID
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Order ID
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Type
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Amount
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Method
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  <FiCreditCard className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-lg font-medium">No transactions yet</p>
                  <p className="text-sm mt-1">
                    Transactions will appear here once payments are processed
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
