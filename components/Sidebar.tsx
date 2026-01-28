"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  user?: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Report Issue", href: "/issues/report", icon: "📝" },
    { label: "My Reports", href: "/dashboard", icon: "📋" },
  ];

  if (user?.role === "ADMIN") {
    navItems.push({ label: "Admin View (For Admins)", href: "/admin/dashboard", icon: "⚙️" });
  }

  navItems.push({ label: "Profile", href: "/profile", icon: "👤" });

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-blue-50 to-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:relative md:translate-x-0 z-40 border-r border-gray-200`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b-2 border-blue-100 bg-white">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-white">C</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-lg">Civnet</span>
              <span className="text-xs text-gray-500 font-medium">Community Issues</span>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-6 border-b-2 border-blue-100 bg-gradient-to-r from-blue-50 to-white">
          <p className="text-sm font-bold text-gray-900">Welcome, {user?.name || "User"}!</p>
          <p className="text-xs text-gray-500 mt-2 break-all">{user?.email}</p>
        </div>

        {/* Report New Issue Button */}
        <div className="p-6 border-b-2 border-blue-100 bg-white">
          <Link
            href="/issues/report"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-xl">+</span> Report New Issue
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium ${
                isActive(item.href)
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t-2 border-blue-100 bg-white">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors border border-red-200"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
