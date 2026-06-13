import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiKey,
  FiMail,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { FaGithub, FaGoogle } from "react-icons/fa";

function getAuthProvider(image?: string | null) {
  if (image?.includes("googleusercontent.com")) {
    return {
      name: "Google",
      icon: FaGoogle,
      color: "text-red-500 bg-red-50 border-red-100",
    };
  }
  if (image?.includes("githubusercontent.com")) {
    return {
      name: "GitHub",
      icon: FaGithub,
      color: "text-slate-800 bg-slate-100 border-slate-200",
    };
  }
  return {
    name: "Credenciales",
    icon: FiKey,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
  };
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const provider = getAuthProvider(session?.user?.image);
  const ProviderIcon = provider.icon;
  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  const accountDetails = [
    { label: "Nombre completo", value: session?.user?.name ?? "—" },
    { label: "Correo electrónico", value: session?.user?.email ?? "—" },
    { label: "Método de acceso", value: provider.name },
    { label: "Estado de sesión", value: "Activa y verificada" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">Perfil</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Mi cuenta
          </h1>
          <p className="mt-2 text-slate-500">
            Consulta y gestiona la información de tu sesión.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <FiArrowLeft />
          Volver al dashboard
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tarjeta de identidad */}
        <div className="stat-card flex flex-col items-center text-center lg:col-span-1">
          <div className="relative">
            {session?.user?.image ? (
              <Image
                height={112}
                width={112}
                src={session.user.image}
                alt="Avatar"
                className="h-28 w-28 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-lg"
              />
            ) : (
              <span className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl font-bold text-white shadow-lg">
                {initials}
              </span>
            )}
            <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white shadow">
              <FiCheckCircle className="text-sm" />
            </span>
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            {session?.user?.name ?? "Usuario"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {session?.user?.email ?? "Sin email"}
          </p>

          <span
            className={`mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${provider.color}`}
          >
            <ProviderIcon className="text-sm" />
            {provider.name}
          </span>
        </div>

        {/* Detalles de cuenta */}
        <div className="stat-card lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <FiUser className="text-lg" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Información personal
              </h2>
              <p className="text-sm text-slate-500">
                Datos asociados a tu sesión actual
              </p>
            </div>
          </div>

          <dl className="divide-y divide-slate-100">
            {accountDetails.map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <dt className="text-sm font-medium text-slate-500">{label}</dt>
                <dd className="text-sm font-semibold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Seguridad */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="stat-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <FiShield className="text-lg" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Seguridad</h2>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-500" />
              Ruta protegida por middleware de NextAuth
            </li>
            <li className="flex items-start gap-2">
              <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-500" />
              Sesión JWT activa y validada en el servidor
            </li>
            {provider.name === "Credenciales" ? (
              <li className="flex items-start gap-2">
                <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-500" />
                Contraseña almacenada con cifrado bcrypt
              </li>
            ) : (
              <li className="flex items-start gap-2">
                <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-500" />
                Autenticación delegada a {provider.name}
              </li>
            )}
          </ul>
        </div>

        <div className="stat-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <FiMail className="text-lg" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Contacto</h2>
          </div>
          <p className="text-sm text-slate-500">
            Este es el correo vinculado a tu cuenta. Se utiliza para identificar
            tu sesión en la aplicación.
          </p>
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900">
            {session?.user?.email ?? "No disponible"}
          </p>
        </div>
      </div>
    </div>
  );
}
