import Link from "next/link";
import { signup } from "@/app/actions/authActions";

export default function SignupPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Join Civnet</h1>
        <p className="text-slate-500 text-center mb-8 text-sm">Start making your community better</p>

        <form action={signup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <input name="fullName" type="text" placeholder="John Doe" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <input name="email" type="email" placeholder="name@example.com" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input name="password" type="password" placeholder="••••••••" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}