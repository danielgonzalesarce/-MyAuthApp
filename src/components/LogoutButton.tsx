"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/signin" })}
      className={`rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 ${className}`}
    >
      Cerrar sesión
    </button>
  );
}
