import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiShield, FiUser } from "react-icons/fi";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const firstName = session?.user?.name?.split(" ")[0] ?? "Usuario";

  const stats = [
    {
      icon: FiUser,
      label: "Usuario",
      value: session?.user?.name ?? "—",
      accent: "from-indigo-500 to-violet-500",
    },
    {
      icon: FiShield,
      label: "Seguridad",
      value: "Ruta protegida",
      accent: "from-emerald-500 to-teal-500",
    },
    {
      icon: FiCheckCircle,
      label: "Estado",
      value: "Autenticado",
      accent: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-sm font-medium text-indigo-600">Dashboard</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Hola, {firstName}
        </h1>
        <p className="mt-2 text-slate-500">
          Bienvenido a tu panel. Tu sesión está activa y verificada.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ icon: Icon, label, value, accent }) => (
          <div key={label} className="stat-card">
            <div
              className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${accent} p-2.5 text-white shadow-lg`}
            >
              <Icon className="text-lg" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              {label}
            </p>
            <p className="mt-1 truncate text-base font-semibold text-slate-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="stat-card lg:col-span-3">
          <h2 className="text-base font-semibold text-slate-900">
            Detalles de sesión
          </h2>
          <dl className="mt-5 space-y-4">
            {[
              { label: "Nombre", value: session?.user?.name },
              { label: "Email", value: session?.user?.email },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
              >
                <dt className="text-sm text-slate-500">{label}</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {value ?? "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="stat-card flex flex-col justify-between lg:col-span-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Acceso rápido
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Gestiona tu cuenta autenticada.
            </p>
          </div>
          <Link
            href="/profile"
            className="mt-6 flex items-center justify-between rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-200 transition hover:opacity-90"
          >
            Ver mi perfil
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
