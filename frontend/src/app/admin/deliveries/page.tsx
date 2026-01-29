"use client";

import { useState } from "react";
import {
  FiTruck,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiPackage,
  FiNavigation,
} from "react-icons/fi";

const statusColors: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: FiClock },
  assigned: { bg: "bg-blue-100", text: "text-blue-700", icon: FiPackage },
  "in-transit": { bg: "bg-purple-100", text: "text-purple-700", icon: FiNavigation },
  delivered: { bg: "bg-green-100", text: "text-green-700", icon: FiCheckCircle },
};

export default function DeliveriesPage() {
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Deliveries</h1>
          <p className="text-gray-600 mt-1">Track and manage order deliveries</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusColors).map(([status, { bg, text, icon: Icon }]) => (
          <div
            key={status}
            className="group bg-linear-to-br from-white via-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setFilterStatus(status)}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${bg} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`${text} text-lg`} size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600 font-medium capitalize">{status.replace("-", " ")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-linear-to-br from-white via-gray-50 to-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by delivery ID, order ID, or address..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 hover:border-gray-300 bg-white"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-3 border rounded-lg transition-all duration-200 ${
              showFilters
                ? "bg-linear-to-r from-emerald-50 to-emerald-50 border-emerald-300 text-emerald-700 shadow-md"
                : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            <FiFilter className="w-5 h-5 mr-2" />
            Filters
            <FiChevronDown
              className={`w-4 h-4 ml-2 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
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
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
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
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end justify-end">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("");
                }}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Deliveries Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Delivery ID
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Order ID
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Address
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Scheduled
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <FiTruck className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-lg font-medium">No deliveries yet</p>
                  <p className="text-sm mt-1">
                    Deliveries will appear here once orders are ready for dispatch
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
