"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { FiGrid, FiLogOut, FiUser } from "react-icons/fi";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: FiGrid },
  { href: "/profile", label: "Perfil", icon: FiUser },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 flex-col border-r border-slate-200/80 bg-white lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-200">
            A
          </span>
          <span className="font-semibold text-slate-900">MyAuthApp</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`sidebar-link ${pathname === href ? "sidebar-link-active" : ""}`}
            >
              <Icon className="text-lg" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="Avatar"
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-100"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">
                {session?.user?.name}
              </p>
              <p className="truncate text-xs text-slate-400">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <FiLogOut className="text-lg" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col">
        {/* Topbar mobile */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200/80 bg-white px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
              A
            </span>
            <span className="font-semibold text-slate-900">MyAuthApp</span>
          </div>
          <nav className="flex gap-1">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  pathname === href
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
