import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 antialiased selection:bg-brand-accent/20 selection:text-brand-accent">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          {children}
        </main>
      </body>
    </html>
  );
}