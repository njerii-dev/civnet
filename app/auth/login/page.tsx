import Link from "next/link";
import { login } from "@/app/actions/authActions";

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Welcome Back</h1>
        <p className="text-slate-500 text-center mb-8 text-sm">Sign in to track your reports</p>

        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <input name="email" type="email" placeholder="name@example.com" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input name="password" type="password" placeholder="••••••••" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account? <Link href="/auth/signup" className="text-blue-600 font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}