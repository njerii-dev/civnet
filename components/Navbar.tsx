import Link from "next/link";
import { Building2, LogOut, User } from "lucide-react";
import { auth, signOut } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b shadow-sm">
      <Link href="/" className="flex items-center gap-2 font-bold text-blue-600">
        <Building2 size={24} />
        <span>Civnet</span>
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium">
        <Link href="/dashboard/citizens" className="hover:text-blue-600">My Reports</Link>
        <Link href="/report" className="hover:text-blue-600">New Report</Link>

        {session ? (
          <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
            <div className="flex items-center gap-2 text-slate-600">
              <User size={16} />
              <span className="max-w-[100px] truncate">{session.user?.name}</span>
            </div>
            <form action={async () => {
              "use server";
              await signOut();
            }}>
              <button className="text-slate-500 hover:text-red-600 transition-colors">
                <LogOut size={18} />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-slate-600 hover:text-blue-600">Login</Link>
            <Link href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
              Join
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}