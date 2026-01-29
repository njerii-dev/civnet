"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  // Define navigation based on user role
  const citizenLinks = [
    { name: "Dashboard", href: "/dashboard", icon: "🏠" },
    { name: "Report Issue", href: "/report", icon: "📢" },
    { name: "My Reports", href: "/my-reports", icon: "📋" },
  ];

  const adminLinks = [
    { name: "Admin Dashboard", href: "/admin/dashboard", icon: "🏛️" },
    { name: "All Issues", href: "/issues", icon: "🧾" },
    { name: "Enhanced View", href: "/admin/dashboard-enhanced", icon: "📊" },
  ];

  const links = user?.role === "ADMIN" ? adminLinks : citizenLinks;

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
      <div className="mb-8 p-2">
        <h1 className="text-2xl font-bold text-blue-600">Civnet</h1>
        <p className="text-xs text-gray-400 capitalize">{user?.role} Portal</p>
      </div>

      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === link.href 
                ? "bg-blue-50 text-blue-600 font-medium" 
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>{link.icon}</span>
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="text-xs text-red-500 hover:underline"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}