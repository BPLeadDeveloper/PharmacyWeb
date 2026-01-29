"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiEye,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiShoppingBag,
} from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Customer {
  user_id: number;
  email: string;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchCustomers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
        setFilteredCustomers(data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Apply filters
  useEffect(() => {
    let filtered = [...customers];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (customer) =>
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone?.includes(searchQuery) ||
          customer.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus === "active") {
      filtered = filtered.filter((customer) => customer.is_active);
    } else if (filterStatus === "inactive") {
      filtered = filtered.filter((customer) => !customer.is_active);
    } else if (filterStatus === "verified") {
      filtered = filtered.filter((customer) => customer.is_email_verified);
    } else if (filterStatus === "unverified") {
      filtered = filtered.filter((customer) => !customer.is_email_verified);
    }

    setFilteredCustomers(filtered);
  }, [searchQuery, filterStatus, customers]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Customers</h1>
          <p className="text-gray-600 mt-1">Manage and view your customer base</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-emerald-50 to-white rounded-xl p-5 border border-emerald-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-linear-to-br from-emerald-100 to-emerald-50 rounded-lg shadow-md">
              <FiUsers className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              <p className="text-sm text-gray-600 font-medium">Total Customers</p>
            </div>
          </div>
        </div>
        <div className="bg-linear-to-br from-green-50 to-white rounded-xl p-5 border border-green-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-linear-to-br from-green-100 to-green-50 rounded-lg shadow-md">
              <FiMail className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter((c) => c.is_email_verified).length}
              </p>
              <p className="text-sm text-gray-600 font-medium">Verified</p>
            </div>
          </div>
        </div>
        <div className="bg-linear-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-linear-to-br from-blue-100 to-blue-50 rounded-lg shadow-md">
              <FiShoppingBag className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter((c) => c.is_active).length}
              </p>
              <p className="text-sm text-gray-600 font-medium">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-linear-to-br from-purple-50 to-white rounded-xl p-5 border border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-linear-to-br from-purple-100 to-purple-50 rounded-lg shadow-md">
              <FiCalendar className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600 font-medium">New Today</p>
            </div>
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
                placeholder="Search by name, email, or phone..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="verified">Email Verified</option>
                <option value="unverified">Email Unverified</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="md:col-span-2 flex items-end justify-end">
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

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Contact
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Verification
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Joined
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <FiUsers className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No customers found</p>
                    <p className="text-sm mt-1">
                      Try adjusting your search or filters
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.user_id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {(customer.first_name?.[0] || customer.email[0]).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {customer.first_name && customer.last_name
                              ? `${customer.first_name} ${customer.last_name}`
                              : "No Name"}
                          </p>
                          <p className="text-sm text-gray-500">ID: #{customer.user_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            customer.is_email_verified
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          <FiMail className="w-3 h-3 mr-1" />
                          {customer.is_email_verified ? "Verified" : "Pending"}
                        </span>
                        {customer.phone && (
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              customer.is_phone_verified
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            <FiPhone className="w-3 h-3 mr-1" />
                            {customer.is_phone_verified ? "Verified" : "Pending"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          customer.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            customer.is_active ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                        {customer.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {formatDate(customer.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {filteredCustomers.length} of {customers.length} customers
          </p>
        </div>
      </div>
    </div>
  );
}
