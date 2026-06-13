import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-slate-900">Next Auth App</h1>

      {session ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-slate-600">
            Sesión iniciada como{" "}
            <span className="font-semibold text-slate-900">
              {session.user?.email}
            </span>
          </p>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Ir al Dashboard
            </Link>
            <Link
              href="/profile"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Ver Perfil
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-slate-600">No has iniciado sesión.</p>
          <Link
            href="/signIn"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Iniciar sesión
          </Link>
        </div>
      )}
    </main>
  );
}
