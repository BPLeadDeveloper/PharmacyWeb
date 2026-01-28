"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Register page now redirects to login since we use OTP-based authentication
export default function Register() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page - registration is now handled via OTP flow
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#e8f4f8] to-[#d4e8ed]">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl text-center">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-[#02475b] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 mt-4">Redirecting to login...</p>
      </div>
    </div>
  );
}
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}

              <button
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>

              <button
                type="button"
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                onClick={() => {
                  window.location.href = `${API_BASE}/auth/google`;
                }}
              >
                Sign up with Google
              </button>
            </form>
        )}
        <div className="mt-4 text-center">
          <Link href="/login" className="text-blue-600 hover:underline">Already have an account? Login</Link>
        </div>
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}