"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signup } from "@/app/actions/authActions";
import { AlertCircle, ArrowRight, Lock, Mail, User } from "lucide-react";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (err: string) => {
    switch (err) {
      case "MissingFields": return "Please fill out all fields.";
      case "UserExists": return "An account with this email already exists.";
      default: return "An unexpected error occurred. Please try again.";
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-brand-primary/10 border-2 border-slate-100">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Join Civnet</h1>
            <p className="text-slate-500 font-semibold leading-relaxed">Start making your community better today.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-50 border-2 border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-bold whitespace-pre-wrap">
                {getErrorMessage(error)}
              </p>
            </div>
          )}

          <form action={signup} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-extrabold text-slate-700 ml-1 block">Full Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                  <User size={20} />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-extrabold text-slate-700 ml-1 block">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-extrabold text-slate-700 ml-1 block">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-4 text-lg shadow-brand-primary/20"
            >
              Create Account
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t-2 border-slate-50">
            <p className="text-center text-sm font-bold text-slate-500">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-brand-accent hover:text-brand-primary transition-colors ml-1">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
