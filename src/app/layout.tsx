import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "OPA Enterprise UI — Self-Service PBAC",
  description: "Self-service Policy-Based Access Control for enterprises",
};

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/onboard", label: "Onboard App" },
  { href: "/policies", label: "Policies" },
  { href: "/audit", label: "Audit Log" },
  { href: "/users", label: "Users & Groups" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50">
        <header className="bg-indigo-700 text-white shadow">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
            <Link href="/dashboard" className="font-bold text-lg tracking-tight">
              OPA Enterprise
            </Link>
            <nav className="flex gap-6 text-sm font-medium">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="hover:text-indigo-200 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
          OPA Enterprise UI — Self-Service PBAC
        </footer>
      </body>
    </html>
  );
}
