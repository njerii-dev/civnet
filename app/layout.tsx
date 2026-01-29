import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // THIS IS THE MOST IMPORTANT LINE

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Civnet | Community Issue Tracker",
  description: "Improve your community, one report at a time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        {/* This main tag ensures your content is positioned correctly */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}