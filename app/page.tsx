"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        
        if (data.authenticated) {
          // Redirect to dashboard if authenticated
          router.push("/dashboard");
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <main className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Civnet</h1>
          <div className="text-4xl text-green-600 font-semibold">C</div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Civnet
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Help your community by reporting local issues and staying informed about what's happening in your area.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Create Account
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-lg"
          >
            Sign In
          </Link>
        </div>
      </main>
    </div>
  );
}
