"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReportIssuePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "ROADS",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        
        if (!data.authenticated) {
          router.push("/login");
          return;
        }
        
        setAuthenticated(true);
      } catch (err) {
        console.error("Auth check error:", err);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/issues/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit issue");
        return;
      }

      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        category: "ROADS",
      });

      // Redirect to issue details after 2 seconds
      setTimeout(() => {
        router.push(`/issues/${data.issue.id}`);
      }, 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {authenticated === null ? (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h1>
          <p className="text-gray-600">Help improve our community by reporting local issues</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {success && (
            <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold text-green-800">Issue submitted successfully!</p>
                  <p className="text-sm text-green-700">Redirecting to your issue...</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠</span>
                <div>
                  <p className="font-semibold text-red-800">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                Issue Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="e.g., Pothole on Main Street"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100</p>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="ROADS">🛣️ Roads & Potholes</option>
                <option value="LIGHTING">💡 Street Lighting</option>
                <option value="WASTE">♻️ Waste & Garbage</option>
                <option value="OTHER">📋 Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                placeholder="Please provide details about the issue... (location, what's wrong, urgency level, etc.)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                value={formData.description}
                onChange={handleChange}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500</p>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.description.trim()}
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⚙️</span>
                  Submitting...
                </span>
              ) : (
                "Submit Issue"
              )}
            </button>
          </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          Your issue will be reviewed by city officials. You'll receive updates on its status.
        </p>
        </div>
      </div>
      )}
    </>
  );
}
