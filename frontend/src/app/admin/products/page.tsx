"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FiPlus,
  FiSearch,
  FiX,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiAlertCircle,
  FiBox,
  FiFilter,
  FiChevronDown,
  FiImage,
} from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Product {
  product_id: number;
  product_name: string;
  generic_name: string | null;
  category: string | null;
  dosage_form: string | null;
  strength: string | null;
  pack_size: string | null;
  mrp: number;
  discount_percent: number | null;
  stock_quantity: number;
  requires_prescription: boolean;
  is_active: boolean;
  brand?: {
    brand_id: number;
    brand_name: string;
  };
}

interface Brand {
  brand_id: number;
  brand_name: string;
}

interface ProductForm {
  product_name: string;
  generic_name: string;
  category: string;
  dosage_form: string;
  strength: string;
  pack_size: string;
  mrp: number;
  discount_percent: number;
  stock_quantity: number;
  requires_prescription: boolean;
  is_active: boolean;
  brand_id: number | null;
}

const initialFormState: ProductForm = {
  product_name: "",
  generic_name: "",
  category: "",
  dosage_form: "",
  strength: "",
  pack_size: "",
  mrp: 0,
  discount_percent: 0,
  stock_quantity: 0,
  requires_prescription: false,
  is_active: true,
  brand_id: null,
};

const categories = [
  "Tablets",
  "Capsules",
  "Syrups",
  "Injections",
  "Creams",
  "Ointments",
  "Drops",
  "Inhalers",
  "Powders",
  "Supplements",
  "Medical Devices",
  "Personal Care",
  "Baby Care",
  "Other",
];

const dosageForms = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Suspension",
  "Injection",
  "Cream",
  "Ointment",
  "Gel",
  "Lotion",
  "Drops",
  "Inhaler",
  "Powder",
  "Patch",
  "Suppository",
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductForm>(initialFormState);

  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/brands`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setBrands(data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, [fetchProducts, fetchBrands]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.generic_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory) {
      filtered = filtered.filter((product) => product.category === filterCategory);
    }

    // Brand filter
    if (filterBrand) {
      filtered = filtered.filter(
        (product) => product.brand?.brand_id === parseInt(filterBrand)
      );
    }

    // Stock filter
    if (filterStock === "in-stock") {
      filtered = filtered.filter((product) => product.stock_quantity > 0);
    } else if (filterStock === "out-of-stock") {
      filtered = filtered.filter((product) => product.stock_quantity === 0);
    } else if (filterStock === "low-stock") {
      filtered = filtered.filter(
        (product) => product.stock_quantity > 0 && product.stock_quantity <= 10
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, filterCategory, filterBrand, filterStock, products]);

  const clearFilters = () => {
    setSearchQuery("");
    setFilterCategory("");
    setFilterBrand("");
    setFilterStock("");
  };

  const openModal = (mode: "add" | "edit" | "view", product?: Product) => {
    setModalMode(mode);
    setSelectedProduct(product || null);
    setError(null);
    setSuccess(null);

    if (product && (mode === "edit" || mode === "view")) {
      setFormData({
        product_name: product.product_name,
        generic_name: product.generic_name || "",
        category: product.category || "",
        dosage_form: product.dosage_form || "",
        strength: product.strength || "",
        pack_size: product.pack_size || "",
        mrp: product.mrp,
        discount_percent: product.discount_percent || 0,
        stock_quantity: product.stock_quantity,
        requires_prescription: product.requires_prescription,
        is_active: product.is_active,
        brand_id: product.brand?.brand_id || null,
      });
    } else {
      setFormData(initialFormState);
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setFormData(initialFormState);
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const url =
        modalMode === "add"
          ? `${API_BASE}/products`
          : `${API_BASE}/products/${selectedProduct?.product_id}`;

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
        throw new Error(data.message || `Failed to ${modalMode} product`);
      }

      setSuccess(`Product ${modalMode === "add" ? "created" : "updated"} successfully!`);
      fetchProducts();

      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error: any) {
      setError(error.message || `Failed to ${modalMode} product`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    setActionLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete product");
      }

      setSuccess("Product deleted successfully!");
      fetchProducts();
      setDeleteConfirm(null);

      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to delete product");
    } finally {
      setActionLoading(false);
    }
  };

  const getSellingPrice = (mrp: number, discountPercent: number | null) => {
    if (!discountPercent) return mrp;
    return mrp - (mrp * discountPercent) / 100;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Products Management</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory and pricing</p>
        </div>
        <button
          onClick={() => openModal("add")}
          className="inline-flex items-center justify-center px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30 text-white font-semibold rounded-lg transition-all duration-200"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Add New Product
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
                placeholder="Search products by name, generic name, or category..."
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
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand.brand_id} value={brand.brand_id}>
                    {brand.brand_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Status
              </label>
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              >
                <option value="">All Stock</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock (≤10)</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="md:col-span-3 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid/Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Product
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Brand
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Stock
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
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
                        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <FiBox className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No products found</p>
                    <p className="text-sm mt-1">
                      Try adjusting your filters or add a new product
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.product_id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <FiBox className="text-white" size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {product.product_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {product.generic_name || product.strength || "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {product.category || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {product.brand?.brand_name || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800">
                          ₹{getSellingPrice(product.mrp, product.discount_percent).toFixed(2)}
                        </p>
                        {product.discount_percent && product.discount_percent > 0 && (
                          <p className="text-sm text-gray-400 line-through">
                            ₹{product.mrp.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-medium ${
                          product.stock_quantity === 0
                            ? "text-red-600"
                            : product.stock_quantity <= 10
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          product.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            product.is_active ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openModal("view", product)}
                          className="p-2 text-gray-500 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => openModal("edit", product)}
                          className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        {deleteConfirm === product.product_id ? (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleDelete(product.product_id)}
                              disabled={actionLoading}
                              className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                              title="Confirm Delete"
                            >
                              <FiCheck size={18} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <FiX size={18} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(product.product_id)}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
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
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
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
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto transform transition-all max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {modalMode === "add" && "Add New Product"}
                  {modalMode === "edit" && "Edit Product"}
                  {modalMode === "view" && "Product Details"}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Alerts in Modal */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="product_name"
                      value={formData.product_name}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Generic Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Generic Name
                    </label>
                    <input
                      type="text"
                      name="generic_name"
                      value={formData.generic_name}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter generic name"
                    />
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <select
                      name="brand_id"
                      value={formData.brand_id || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          brand_id: e.target.value ? parseInt(e.target.value) : null,
                        }))
                      }
                      disabled={modalMode === "view"}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="">Select Brand</option>
                      {brands.map((brand) => (
                        <option key={brand.brand_id} value={brand.brand_id}>
                          {brand.brand_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dosage Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dosage Form
                    </label>
                    <select
                      name="dosage_form"
                      value={formData.dosage_form}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="">Select Dosage Form</option>
                      {dosageForms.map((form) => (
                        <option key={form} value={form}>
                          {form}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Strength */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Strength
                    </label>
                    <input
                      type="text"
                      name="strength"
                      value={formData.strength}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="e.g., 500mg, 10ml"
                    />
                  </div>

                  {/* Pack Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pack Size
                    </label>
                    <input
                      type="text"
                      name="pack_size"
                      value={formData.pack_size}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="e.g., 10 tablets, 100ml"
                    />
                  </div>

                  {/* MRP */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      MRP (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="mrp"
                      value={formData.mrp}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Discount Percent */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      name="discount_percent"
                      value={formData.discount_percent}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="0"
                    />
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {/* Requires Prescription */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Requires Prescription</p>
                      <p className="text-sm text-gray-500">Rx only product</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="requires_prescription"
                        checked={formData.requires_prescription}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-disabled:opacity-50"></div>
                    </label>
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Active Status</p>
                      <p className="text-sm text-gray-500">Enable or disable</p>
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-disabled:opacity-50"></div>
                    </label>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    {modalMode === "view" ? "Close" : "Cancel"}
                  </button>
                  {modalMode !== "view" && (
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors flex items-center"
                    >
                      {actionLoading && (
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                      {modalMode === "add" ? "Create Product" : "Save Changes"}
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
