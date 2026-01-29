"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface ProfileForm {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

export default function CompleteProfile() {
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [existingUser, setExistingUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    // Fetch existing user data
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setExistingUser(data);
          // Pre-fill form with existing data
          setForm({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            date_of_birth: data.date_of_birth ? data.date_of_birth.split("T")[0] : "",
            emergency_contact_name: data.customer?.emergency_contact_name || "",
            emergency_contact_phone: data.customer?.emergency_contact_phone || "",
          });
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/");
      });
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!form.first_name.trim()) {
      setError("First name is required");
      setLoading(false);
      return;
    }

    if (!form.last_name.trim()) {
      setError("Last name is required");
      setLoading(false);
      return;
    }

    if (!form.date_of_birth) {
      setError("Date of birth is required");
      setLoading(false);
      return;
    }

    // Check if user is at least 18 years old
    const dob = new Date(form.date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      setError("You must be at least 18 years old to register");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/auth/complete-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({}));
        throw new Error(message || "Failed to update profile");
      }

      // Redirect to home page on success
      router.push("/");
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#e8f4f8] to-[#d4e8ed] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#02475b] p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center mr-3">
              <span className="text-[#02475b] font-bold text-2xl">B</span>
            </div>
            <div className="text-white">
              <span className="font-bold text-2xl block">Bharath</span>
              <span className="text-sm opacity-80">24|7</span>
            </div>
          </div>
          <h1 className="text-white text-xl font-bold">Complete Your Profile</h1>
          <p className="text-gray-300 text-sm mt-1">Just a few more details to get started</p>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
                ✓
              </div>
              <span className="ml-2 text-sm text-gray-600">Email</span>
            </div>
            <div className="w-12 h-1 bg-[#f57224] rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#f57224] text-white flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-sm text-gray-600">Profile</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#f57224] text-gray-800 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#f57224] text-gray-800 transition"
                  required
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#f57224] text-gray-800 transition"
                required
              />
            </div>

            {/* Emergency Contact Section */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-[#02475b] font-semibold mb-3 flex items-center">
                <span className="mr-2">🚨</span>
                Emergency Contact (Optional)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="emergency_contact_name"
                    value={form.emergency_contact_name}
                    onChange={handleChange}
                    placeholder="Contact person name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#f57224] text-gray-800 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="emergency_contact_phone"
                    value={form.emergency_contact_phone}
                    onChange={handleChange}
                    placeholder="Contact phone number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#f57224] text-gray-800 transition"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f57224] hover:bg-[#e56213] disabled:bg-gray-300 text-white py-4 rounded-lg font-semibold transition flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  Complete Registration
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>

            {/* Info Note */}
            <div className="bg-blue-50 rounded-lg p-4 flex items-start space-x-3">
              <span className="text-blue-500 text-xl">🔒</span>
              <div>
                <p className="text-sm text-gray-700">
                  Your information is securely stored and will only be used for:
                </p>
                <ul className="text-xs text-gray-600 mt-1 space-y-1">
                  <li>• Processing your medicine orders</li>
                  <li>• Prescription verification</li>
                  <li>• Age verification for restricted medicines</li>
                  <li>• Emergency contact during delivery</li>
                </ul>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
