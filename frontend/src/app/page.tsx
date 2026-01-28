"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Category {
  category_id: number;
  category_name: string;
  description?: string;
}

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  original_price?: number;
  discount?: string;
  display_image_emoji?: string;
}

interface Brand {
  brand_id: number;
  brand_name: string;
}

interface LabTest {
  lab_test_id: number;
  test_name: string;
  price: number;
  original_price?: number;
  description?: string;
}

export default function Home() {
  const [user, setUser] = useState<any | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesRes = await fetch(`${API_BASE}/api/categories`);
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }

        // Fetch featured products
        const productsRes = await fetch(`${API_BASE}/api/products?featured=true&limit=20`);
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }

        // Fetch brands
        const brandsRes = await fetch(`${API_BASE}/api/brands?limit=8`);
        if (brandsRes.ok) {
          const brandsData = await brandsRes.json();
          setBrands(brandsData);
        }

        // Fetch lab tests
        const labTestsRes = await fetch(`${API_BASE}/api/lab-tests?limit=5`);
        if (labTestsRes.ok) {
          const labTestsData = await labTestsRes.json();
          setLabTests(labTestsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Banner Section */}
      <section className="bg-linear-to-r from-[#e8f4f8] to-[#d4e8ed] py-6">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden bg-linear-to-r from-[#02475b] to-[#0a5c6f] text-white p-8 md:p-12">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Buy Medicines and Essentials
              </h1>
              <p className="text-lg mb-6 text-gray-200">
                Get up to 25% off on your first order. Free delivery on orders above ₹499
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/medicines" className="bg-[#f57224] hover:bg-[#e56213] text-white px-6 py-3 rounded-lg font-semibold transition">
                  Order Now
                </Link>
                <Link href="/upload-prescription" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition border border-white/30">
                  Upload Prescription
                </Link>
              </div>
            </div>
            <div className="hidden md:block absolute right-8 bottom-0">
              <div className="text-9xl">💊</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/medicines" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center space-x-4 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                💊
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Get 20%* off on</h3>
                <p className="text-sm text-gray-500">Medicines</p>
                <span className="text-xs text-[#02475b] font-medium">UPLOAD NOW</span>
              </div>
            </Link>
            <Link href="/doctors" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center space-x-4 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                👨‍⚕️
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Doctor</h3>
                <p className="text-sm text-gray-500">Consultations</p>
                <span className="text-xs text-[#02475b] font-medium">BOOK NOW</span>
              </div>
            </Link>
            <Link href="/lab-tests" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center space-x-4 border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                🧪
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Lab Tests</h3>
                <p className="text-sm text-gray-500">AT HOME</p>
                <span className="text-xs text-[#02475b] font-medium">BOOK NOW</span>
              </div>
            </Link>
            <Link href="/insurance" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center space-x-4 border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">
                🏥
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Health</h3>
                <p className="text-sm text-gray-500">Insurance</p>
                <span className="text-xs text-[#02475b] font-medium">BUY NOW</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Health Conditions */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse by Health Conditions</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-[#02475b] border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {categories.slice(0, 10).map((category) => (
                <Link
                  key={category.category_id}
                  href={`/category/${category.category_id}`}
                  className="category-card bg-blue-50 rounded-xl p-4 text-center border border-gray-100 hover:border-[#02475b]"
                >
                  <div className="text-4xl mb-2">📦</div>
                  <h3 className="font-medium text-gray-800 text-sm">{category.category_name}</h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Apollo Trusted Alternatives Banner */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="bg-linear-to-r from-[#1a1a2e] to-[#16213e] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Explore Bharath Trusted Alternatives</h2>
              <p className="text-gray-300">Same Salt. Bigger Savings.</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="bg-[#ffc107] text-black px-4 py-2 rounded-lg font-semibold">
                Lock in<br />Best Deals
              </div>
              <Link href="/alternatives" className="bg-white text-[#02475b] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Explore Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Deals Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
            <Link href="/products" className="text-[#02475b] font-semibold hover:underline flex items-center">
              See All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-[#02475b] border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {products.slice(0, 5).map((product) => (
                <div key={product.product_id} className="product-card bg-white rounded-xl p-4 border border-gray-100">
                  <div className="relative">
                    {product.discount && (
                      <span className="absolute top-0 left-0 bg-[#f57224] text-white text-xs px-2 py-1 rounded-br-lg">
                        {product.discount} OFF
                      </span>
                    )}
                    <div className="text-6xl text-center py-6">{product.display_image_emoji || "💊"}</div>
                  </div>
                  <h3 className="font-medium text-gray-800 text-sm line-clamp-2 mb-2">{product.product_name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#02475b]">₹{product.price}</span>
                    {product.original_price && (
                      <span className="text-sm text-gray-400 line-through">₹{product.original_price}</span>
                    )}
                  </div>
                  <button className="w-full mt-3 bg-[#02475b] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#013a4a] transition">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Circle Membership Banner */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="bg-linear-to-r from-[#ffd700] to-[#ffb800] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <span className="text-3xl">👑</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Save Up to 25% on Your Medicine Spends</h2>
                <p className="text-gray-700">With Bharath SBI Card SELECT</p>
              </div>
            </div>
            <Link href="/membership" className="mt-4 md:mt-0 bg-[#02475b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#013a4a] transition">
              Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* Minimum 50% Off Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Minimum 50 Percent Off</h2>
            <Link href="/offers" className="text-[#02475b] font-semibold hover:underline flex items-center">
              See All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-[#02475b] border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.slice(0, 4).map((product) => (
                <div key={product.product_id} className="product-card bg-white rounded-xl p-4 border border-gray-100">
                  <div className="relative">
                    <span className="absolute top-0 left-0 bg-green-600 text-white text-xs px-2 py-1 rounded-br-lg">
                      50%+ OFF
                    </span>
                    <div className="text-6xl text-center py-6">{product.display_image_emoji || "💊"}</div>
                  </div>
                  <h3 className="font-medium text-gray-800 text-sm line-clamp-2 mb-2">{product.product_name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#02475b]">₹{product.price}</span>
                    {product.original_price && (
                      <span className="text-sm text-gray-400 line-through">₹{product.original_price}</span>
                    )}
                  </div>
                  <button className="w-full mt-3 bg-[#02475b] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#013a4a] transition">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Shop by Brand */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop By Brand</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-[#02475b] border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {brands.map((brand) => (
                <Link
                  key={brand.brand_id}
                  href={`/brand/${brand.brand_id}`}
                  className="brand-logo bg-white rounded-xl p-4 text-center border border-gray-100 hover:border-[#02475b]"
                >
                  <div className="text-4xl mb-2">{brand.brand_name.charAt(0)}</div>
                  <p className="text-sm font-medium text-gray-700 line-clamp-1">{brand.brand_name}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ask Anything Banner */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="bg-[#02475b] rounded-2xl p-8 text-white">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold mb-2">Ask anything about your health.</h2>
              <p className="text-gray-300 mb-4">Get trusted answers directly from Bharath AI.</p>
              <button className="bg-[#ffc107] text-[#02475b] px-6 py-3 rounded-lg font-semibold hover:bg-[#ffb800] transition">
                + Ask Bharath*
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pregnancy Banner */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="bg-linear-to-r from-[#fff8e7] to-[#fff5db] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-6xl">🤰</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Be in charge from planning your pregnancy</h2>
                <p className="text-gray-600">to parenting.</p>
              </div>
            </div>
            <Link href="/pregnancy" className="mt-4 md:mt-0 bg-[#02475b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#013a4a] transition">
              Begin Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Lab Tests */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Lab Tests</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-[#02475b] border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {labTests.map((test) => (
                <div key={test.lab_test_id} className="product-card bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                  <div className="text-4xl mb-3">🧪</div>
                  <h3 className="font-medium text-gray-800 text-sm mb-2">{test.test_name}</h3>
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <span className="font-bold text-[#02475b]">₹{test.price}</span>
                    {test.original_price && (
                      <span className="text-sm text-gray-400 line-through">₹{test.original_price}</span>
                    )}
                  </div>
                  <button className="w-full bg-[#02475b] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#013a4a] transition">
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Brands Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore More Brands</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-[#02475b] border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {brands.slice(0, 12).map((brand) => (
                <Link
                  key={brand.brand_id}
                  href={`/brand/${brand.brand_id}`}
                  className="bg-white rounded-xl p-4 text-center border border-gray-100 hover:border-[#02475b] hover:shadow-md transition"
                >
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-xl font-bold text-gray-400">{brand.brand_name.charAt(0)}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 line-clamp-2">{brand.brand_name}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Health & Wellness Banner */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="bg-linear-to-r from-[#f8f9fa] to-[#e9ecef] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Health & Wellness</h2>
              <p className="text-gray-600 mb-4">Your complete health companion</p>
              <Link href="/wellness" className="bg-[#02475b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#013a4a] transition inline-block">
                Explore
              </Link>
            </div>
            <div className="mt-6 md:mt-0 text-8xl">🏃‍♂️</div>
          </div>
        </div>
      </section>

      {/* Why Bharath Pharmacy */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Why Choose Bharath Pharmacy?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">100% Genuine</h3>
              <p className="text-sm text-gray-600">All products are sourced directly from manufacturers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Free Delivery</h3>
              <p className="text-sm text-gray-600">Free delivery on orders above ₹499</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Secure Payments</h3>
              <p className="text-sm text-gray-600">100% secure and encrypted payments</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">📞</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600">Round the clock customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-3xl">
            {[
              { q: "How to order medicines online from Bharath Pharmacy?", a: "Simply search for your medicines, add them to cart, and checkout. You can also upload your prescription for prescription medicines." },
              { q: "Is online medicine delivery safe?", a: "Yes! We ensure all medicines are stored and transported under proper conditions. All products are sourced directly from authorized distributors." },
              { q: "How do I check if a medicine is genuine?", a: "All medicines on Bharath Pharmacy are 100% genuine. You can verify authenticity by checking the batch number and expiry date." },
              { q: "What payment options are available?", a: "We accept Credit/Debit cards, UPI, Net Banking, and Cash on Delivery for your convenience." },
            ].map((faq, index) => (
              <details key={index} className="bg-white rounded-lg border border-gray-200">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-800 hover:bg-gray-50">
                  {faq.q}
                </summary>
                <p className="px-6 pb-4 text-gray-600 text-sm">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
