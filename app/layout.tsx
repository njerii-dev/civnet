"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const publicPages = ["/login", "/signup", "/"];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.authenticated) {
          setUser(data.user);
        } else if (!publicPages.includes(pathname)) {
          router.push("/login");
        }
      } catch (err) {
        if (!publicPages.includes(pathname)) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const isPublicPage = publicPages.includes(pathname);
  const showSidebar = !isPublicPage && user;

  if (loading && !isPublicPage) {
    return (
      <html lang="en">
        <body className="bg-gray-50">
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex">
          {showSidebar && <Sidebar user={user} />}
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}