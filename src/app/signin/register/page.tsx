"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setLoading(false);
      setError(data.error || "Error al registrar");
      return;
    }

    const signInResult = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      callbackUrl: "/dashboard",
      redirect: false,
    });

    setLoading(false);

    if (signInResult?.error) {
      setError(
        "Cuenta creada, pero no se pudo iniciar sesión. Inicia sesión manualmente."
      );
      router.push("/signIn");
      return;
    }

    if (signInResult?.ok) {
      window.location.href = "/dashboard";
    } else if (!signInResult?.error) {
      setError(
        "Cuenta creada, pero no se pudo iniciar sesión. Inicia sesión manualmente."
      );
    }
  };

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Completa tus datos para registrarte"
      footer={
        <p className="text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/signIn"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Iniciar sesión
          </Link>
        </p>
      }
    >
      {error ? <div className="alert-error mb-5">{error}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Nombre completo
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Ej. Juan Pérez"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="nombre@correo.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Mínimo 6 caracteres"
            minLength={6}
            required
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Se almacena cifrada con bcrypt.
          </p>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Creando cuenta..." : "Crear cuenta e ingresar"}
        </button>
      </form>
    </AuthLayout>
  );
}
