"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        
        if (data.authenticated) {
          // Redirect to issues page if authenticated
          router.push("/issues");
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        setAuthenticated(false);
      }
    };

    checkAuth();
  }, [router]);

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <main className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Civnet
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Help your community by reporting local issues and staying informed about what's happening in your area.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/signup"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Account
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Sign In
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Reporting</h3>
            <p className="text-gray-600">
              Submit issues in seconds with title, description, category and details.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
            <p className="text-gray-600">
              Monitor status updates and get notifications when issues are being addressed.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Power</h3>
            <p className="text-gray-600">
              Vote on issues and collaborate with neighbors to amplify important problems.
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-8">Impact So Far</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold">127+</p>
              <p className="text-blue-100 mt-2">Issues Reported</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">84%</p>
              <p className="text-blue-100 mt-2">Resolution Rate</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">2,300+</p>
              <p className="text-blue-100 mt-2">Active Citizens</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">15</p>
              <p className="text-blue-100 mt-2">Issues This Week</p>
            </div>
          </div>
        </div>

        {/* Quick Features */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-400 transition-colors">
              <p className="text-2xl mb-2">⚡</p>
              <p className="font-medium text-gray-900">Instant Reporting</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 hover:border-green-400 transition-colors">
              <p className="text-2xl mb-2">📲</p>
              <p className="font-medium text-gray-900">Mobile Ready</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-400 transition-colors">
              <p className="text-2xl mb-2">🔔</p>
              <p className="font-medium text-gray-900">Live Updates</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 hover:border-orange-400 transition-colors">
              <p className="text-2xl mb-2">🛡️</p>
              <p className="font-medium text-gray-900">Secure & Safe</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
