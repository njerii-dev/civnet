"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Building2, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = useState<'citizen' | 'admin'>('citizen');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Logic for authentication (e.g., NextAuth or Clerk) goes here
    console.log(`Logging in as ${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-slate-50 px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo / Branding */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
            <Building2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome to Civnet
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to manage community issues
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10">
          
          {/* Role Selector */}
          <div className="flex p-1 bg-slate-100 rounded-lg mb-8">
            <button
              onClick={() => setRole('citizen')}
              className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${
                role === 'citizen' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Citizen
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${
                role === 'admin' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Official
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 h-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 h-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
            >
              {loading ? 'Signing in...' : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
              {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              New to Civnet?{' '}
              <Link href="/signup" className="font-bold text-blue-600 hover:text-blue-500">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}