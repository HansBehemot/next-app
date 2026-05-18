"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signIn, signOut, useSession } from "next-auth/react";

const links = [
  { href: "/", label: "Home" },
  { href: "/tasks", label: "Zadania" },
  { href: "/users", label: "Użytkownicy" },
  { href: "/about", label: "O aplikacji" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { token, logout } = useAuth();
  const { data: session } = useSession();
  const router = useRouter();

  function handleLogout() {
    logout();
    signOut({ callbackUrl: "/" });
    router.push("/");
  }

  const isLoggedIn = token || session;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <span className="text-white font-bold">Todo App</span>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "text-blue-400 text-sm"
                  : "text-gray-400 hover:text-white text-sm transition-colors"
              }
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Wyloguj
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Zaloguj
              </Link>
              <button
                onClick={() => signIn("github")}
                className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg transition-colors"
              >
                GitHub
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
