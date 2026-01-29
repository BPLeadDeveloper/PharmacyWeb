"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import {
  FiPlus,
  FiSearch,
  FiX,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiAlertCircle,
  FiTag,
  FiGlobe,
  FiExternalLink,
} from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Brand {
  brand_id: number;
  brand_name: string;
  origin_country: string | null;
  manufacturer_name: string | null;
  web_url: string | null;
  is_active: boolean;
}

interface BrandForm {
  brand_name: string;
  origin_country: string;
  manufacturer_name: string;
  web_url: string;
  is_active: boolean;
}

const initialFormState: BrandForm = {
  brand_name: "",
  origin_country: "",
  manufacturer_name: "",
  web_url: "",
  is_active: true,
};

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchById, setSearchById] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<BrandForm>(initialFormState);
  
  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchBrands = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/brands`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setBrands(data);
        setFilteredBrands(data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      setError("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Search by name
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBrands(brands);
    } else {
      const filtered = brands.filter(brand =>
        brand.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.manufacturer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.origin_country?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBrands(filtered);
    }
  }, [searchQuery, brands]);

  // Search by ID
  const handleSearchById = async () => {
    if (!searchById.trim()) {
      fetchBrands();
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/brands/${searchById}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const brand = await res.json();
        setFilteredBrands([brand]);
        setError(null);
      } else {
        setFilteredBrands([]);
        setError(`Brand with ID ${searchById} not found`);
      }
    } catch (error) {
      setError("Error searching for brand");
      setFilteredBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode: "add" | "edit" | "view", brand?: Brand) => {
    setModalMode(mode);
    setSelectedBrand(brand || null);
    setError(null);
    setSuccess(null);
    
    if (brand && (mode === "edit" || mode === "view")) {
      setFormData({
        brand_name: brand.brand_name,
        origin_country: brand.origin_country || "",
        manufacturer_name: brand.manufacturer_name || "",
        web_url: brand.web_url || "",
        is_active: brand.is_active,
      });
    } else {
      setFormData(initialFormState);
    }
    
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBrand(null);
    setFormData(initialFormState);
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const url = modalMode === "add" 
        ? `${API_BASE}/brands` 
        : `${API_BASE}/brands/${selectedBrand?.brand_id}`;
      
      const method = modalMode === "add" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Failed to ${modalMode} brand`);
      }

      setSuccess(`Brand ${modalMode === "add" ? "created" : "updated"} successfully!`);
      fetchBrands();
      
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error: any) {
      setError(error.message || `Failed to ${modalMode} brand`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (brandId: number) => {
    setActionLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/brands/${brandId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete brand");
      }

      setSuccess("Brand deleted successfully!");
      fetchBrands();
      setDeleteConfirm(null);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to delete brand");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Brands Management</h1>
          <p className="text-gray-600 mt-1">Manage your product brands and suppliers</p>
        </div>
        <button
          onClick={() => openModal("add")}
          className="inline-flex items-center justify-center px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30 text-white font-semibold rounded-lg transition-all duration-200"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Add New Brand
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-linear-to-r from-red-50 to-red-50/50 border border-red-200 text-red-700 px-5 py-4 rounded-xl flex items-center shadow-sm hover:shadow-md transition-shadow">
          <FiAlertCircle className="w-5 h-5 mr-3 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <FiX className="w-5 h-5 hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-linear-to-r from-green-50 to-green-50/50 border border-green-200 text-green-700 px-5 py-4 rounded-xl flex items-center shadow-sm hover:shadow-md transition-shadow">
          <FiCheck className="w-5 h-5 mr-3 shrink-0" />
          <span className="flex-1">{success}</span>
          <button onClick={() => setSuccess(null)} className="ml-auto">
            <FiX className="w-5 h-5 hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* Search Section */}
      <div className="bg-linear-to-br from-white via-gray-50 to-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search by Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search by Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brands by name, manufacturer, or country..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white hover:border-gray-300"
              />
              <FiSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Search by ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search by ID
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={searchById}
                onChange={(e) => setSearchById(e.target.value)}
                placeholder="Enter brand ID..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
              <button
                onClick={handleSearchById}
                className="px-6 py-3 bg-linear-to-r from-emerald-600 to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 text-white font-medium rounded-lg transition-all duration-200"
              >
                Search
              </button>
              {(searchById || searchQuery) && (
                <button
                  onClick={() => {
                    setSearchById("");
                    setSearchQuery("");
                    fetchBrands();
                  }}
                  className="px-4 py-3 bg-linear-to-r from-gray-100 to-gray-50 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Brands Table */}
      <div className="bg-linear-to-br from-white via-gray-50 to-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-gray-50 via-gray-50 to-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">ID</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">Brand</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">Manufacturer</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">Country</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">Status</th>
                <th className="text-center px-6 py-4 text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-linear-to-r hover:from-emerald-50 hover:to-transparent transition-colors">
                    <td className="px-6 py-4"><div className="h-4 bg-linear-to-r from-gray-200 to-gray-100 rounded animate-pulse w-8"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-linear-to-r from-gray-200 to-gray-100 rounded animate-pulse w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-linear-to-r from-gray-200 to-gray-100 rounded animate-pulse w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-linear-to-r from-gray-200 to-gray-100 rounded animate-pulse w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-linear-to-r from-gray-200 to-gray-100 rounded-full animate-pulse w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-linear-to-r from-gray-200 to-gray-100 rounded animate-pulse w-24 mx-auto"></div></td>
                  </tr>
                ))
              ) : filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-4 bg-linear-to-br from-gray-100 to-gray-50 rounded-full mb-4">
                        <FiTag className="w-16 h-16 text-gray-400" />
                      </div>
                      <p className="text-lg font-semibold text-gray-700">No brands found</p>
                      <p className="text-sm text-gray-500 mt-2">Try adjusting your search or add a new brand</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBrands.map((brand) => (
                  <tr key={brand.brand_id} className="border-b border-gray-100 hover:bg-linear-to-r hover:from-emerald-50 hover:to-transparent transition-colors duration-200">
                    <td className="px-6 py-5">
                      <span className="text-sm font-semibold text-gray-600">#{brand.brand_id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                          <span className="text-white font-bold text-sm">
                            {brand.brand_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{brand.brand_name}</p>
                          {brand.web_url && (
                            <a
                              href={brand.web_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                            >
                              {brand.web_url}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-700 font-medium">
                      {brand.manufacturer_name || "-"}
                    </td>
                    <td className="px-6 py-5 text-gray-700 font-medium">
                      {brand.origin_country || "-"}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          brand.is_active
                            ? "bg-linear-to-r from-green-50 to-green-50 text-green-700 border border-green-200"
                            : "bg-linear-to-r from-red-50 to-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full mr-2 ${brand.is_active ? "bg-green-500" : "bg-red-500"}`}></span>
                        {brand.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openModal("view", brand)}
                          className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 hover:shadow-md"
                          title="View"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openModal("edit", brand)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:shadow-md"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {deleteConfirm === brand.brand_id ? (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleDelete(brand.brand_id)}
                              disabled={actionLoading}
                              className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                              title="Confirm Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(brand.brand_id)}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {filteredBrands.length} of {brands.length} brands
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-gray-900/50 transition-opacity"
              onClick={closeModal}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto transform transition-all">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {modalMode === "add" && "Add New Brand"}
                  {modalMode === "edit" && "Edit Brand"}
                  {modalMode === "view" && "Brand Details"}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Alerts in Modal */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                    {success}
                  </div>
                )}

                {/* Brand Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="brand_name"
                    value={formData.brand_name}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f57224]/20 focus:border-[#f57224] transition disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter brand name"
                  />
                </div>

                {/* Manufacturer Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manufacturer Name
                  </label>
                  <input
                    type="text"
                    name="manufacturer_name"
                    value={formData.manufacturer_name}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f57224]/20 focus:border-[#f57224] transition disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter manufacturer name"
                  />
                </div>

                {/* Origin Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Origin Country
                  </label>
                  <input
                    type="text"
                    name="origin_country"
                    value={formData.origin_country}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f57224]/20 focus:border-[#f57224] transition disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter origin country"
                  />
                </div>

                {/* Website URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="web_url"
                    value={formData.web_url}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f57224]/20 focus:border-[#f57224] transition disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="https://example.com"
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">Active Status</p>
                    <p className="text-sm text-gray-500">Enable or disable this brand</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f57224]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f57224] peer-disabled:opacity-50"></div>
                  </label>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                  >
                    {modalMode === "view" ? "Close" : "Cancel"}
                  </button>
                  {modalMode !== "view" && (
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-6 py-3 bg-[#f57224] hover:bg-[#e56213] disabled:bg-gray-300 text-white font-medium rounded-xl transition-colors flex items-center"
                    >
                      {actionLoading && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {modalMode === "add" ? "Create Brand" : "Save Changes"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
